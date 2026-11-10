import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Upload a file to the private media bucket and return a long-lived link for public display. */
export async function uploadMediaFile(file: File, folder: string) {
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type || undefined });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage.from("media").createSignedUrl(path, TEN_YEARS);
  if (signErr || !data) throw signErr ?? new Error("Could not create link");
  return { path, url: data.signedUrl };
}

export async function signedVendorFile(path: string) {
  const { data } = await supabase.storage.from("vendor-uploads").createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  const first = rows[0];
  if (!first) return;
  const headers = Object.keys(first);
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : Array.isArray(v) ? v.join("; ") : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const statusStyles: Record<string, string> = {
  received: "bg-secondary text-secondary-foreground",
  under_review: "bg-accent/40 text-foreground",
  approved: "bg-success/15 text-success",
  waitlisted: "bg-muted text-muted-foreground",
  declined: "bg-destructive/10 text-destructive",
};
