import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, FileText, Instagram, Loader2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminHeader, EmptyState, Panel } from "@/components/admin/AdminUI";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { signedVendorFile, statusStyles } from "@/lib/admin";
import { APPLICATION_STATUSES } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type AppStatus = Database["public"]["Enums"]["application_status"];

export const Route = createFileRoute("/_authenticated/admin/applications/$id")({
  component: ApplicationDetail,
});

function useSignedUrls(paths: string[]) {
  return useQuery({
    queryKey: ["admin", "signed", paths],
    enabled: paths.length > 0,
    queryFn: async () => Promise.all(paths.map(async (p) => ({ path: p, url: await signedVendorFile(p) }))),
  });
}

function ApplicationDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data: a, isLoading } = useQuery({
    queryKey: ["admin", "application", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("vendor_applications").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [notes, setNotes] = useState("");
  useEffect(() => setNotes(a?.internal_notes ?? ""), [a?.internal_notes]);

  const images = a ? [...(a.logo_path ? [a.logo_path] : []), ...a.product_paths] : [];
  const { data: imageUrls = [] } = useSignedUrls(images);
  const { data: docUrls = [] } = useSignedUrls(a?.document_paths ?? []);

  const update = useMutation({
    mutationFn: async (patch: { status?: AppStatus; internal_notes?: string }) => {
      const { error } = await supabase.from("vendor_applications").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Application updated");
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: () => toast.error("Couldn't save changes"),
  });

  if (isLoading) return <Loader2 className="mx-auto mt-20 h-8 w-8 animate-spin text-pink-deep" />;
  if (!a) return <EmptyState title="Application not found" />;

  const rows: [string, string | null][] = [
    ["Contact person", a.contact_person],
    ["City / location", a.city],
    ["Categories", a.categories.join(", ") + (a.other_category ? ` (${a.other_category})` : "")],
    ["Space type", a.space_type],
    ["Preferred stall size", a.stall_size],
    ["Needs electricity", a.needs_electricity ? "Yes" : "No"],
    ["Needs water", a.needs_water ? "Yes" : "No"],
    ["Special setup", a.special_setup],
    ["Equipment", a.equipment],
    ["Special requirements", a.special_requirements],
    ["Participated before", a.participated_before ? "Yes" : "No"],
  ];

  const site = a.website ? (a.website.startsWith("http") ? a.website : `https://${a.website}`) : null;

  return (
    <>
      <Link to="/admin/applications" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All applications
      </Link>
      <AdminHeader
        title={a.business_name}
        subtitle={`${a.reference} · submitted ${new Date(a.created_at).toLocaleString("en-ZA")}`}
        actions={
          <span className={cn("rounded-full px-4 py-2 text-sm font-bold", statusStyles[a.status])}>
            {APPLICATION_STATUSES.find((s) => s.value === a.status)?.label}
          </span>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <Panel>
            <h2 className="text-xl font-semibold">About the business</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{a.description}</p>
            <dl className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</dt>
                  <dd className="mt-1 whitespace-pre-line text-sm">{v || "—"}</dd>
                </div>
              ))}
            </dl>
          </Panel>
          <Panel>
            <h2 className="text-xl font-semibold">Their answers</h2>
            {[
              ["What makes the business unique", a.uniqueness],
              ["Why they'd like to participate", a.motivation],
              ["Additional information", a.additional_info],
            ].map(([k, v]) => (
              <div key={k} className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</p>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{v || "—"}</p>
              </div>
            ))}
          </Panel>
          <Panel>
            <h2 className="text-xl font-semibold">Brand showcase</h2>
            {imageUrls.length === 0 && docUrls.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No files uploaded.</p>
            ) : (
              <>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {imageUrls.map(
                    (f, i) =>
                      f.url && (
                        <a key={f.path} href={f.url} target="_blank" rel="noreferrer" className="group relative aspect-square overflow-hidden rounded-2xl bg-muted">
                          <img src={f.url} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                          {i === 0 && a.logo_path && <span className="glass absolute left-2 top-2 rounded-full px-2 py-0.5 text-[0.65rem] font-bold">Logo</span>}
                        </a>
                      ),
                  )}
                </div>
                {docUrls.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {docUrls.map(
                      (d) =>
                        d.url && (
                          <li key={d.path}>
                            <a href={d.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm font-semibold hover:bg-secondary">
                              <FileText className="h-4 w-4 text-pink-deep" /> {d.path.split("/").pop()} <ExternalLink className="ml-auto h-3.5 w-3.5" />
                            </a>
                          </li>
                        ),
                    )}
                  </ul>
                )}
              </>
            )}
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel>
            <h2 className="text-xl font-semibold">Status</h2>
            <div className="mt-4 grid gap-2">
              {APPLICATION_STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  disabled={update.isPending}
                  onClick={() => update.mutate({ status: s.value })}
                  className={cn(
                    "flex h-11 items-center justify-between rounded-2xl border px-4 text-sm font-semibold transition-all",
                    a.status === s.value ? "border-primary bg-primary text-primary-foreground" : "border-input hover:border-primary",
                  )}
                >
                  {s.label}
                  {a.status === s.value && <span className="text-xs">Current</span>}
                </button>
              ))}
            </div>
          </Panel>
          <Panel>
            <h2 className="text-xl font-semibold">Contact</h2>
            <div className="mt-4 space-y-2 text-sm">
              <a href={`mailto:${a.email}`} className="flex items-center gap-2 font-semibold hover:text-pink-deep"><Mail className="h-4 w-4" /> {a.email}</a>
              <a href={`tel:${a.phone}`} className="flex items-center gap-2 font-semibold hover:text-pink-deep"><Phone className="h-4 w-4" /> {a.phone}</a>
              <a href={`https://wa.me/${a.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-semibold hover:text-pink-deep"><Phone className="h-4 w-4" /> WhatsApp</a>
              <a href={`https://www.instagram.com/${a.instagram.replace(/^@/, "")}/`} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-semibold hover:text-pink-deep"><Instagram className="h-4 w-4" /> {a.instagram}</a>
              {site && <a href={site} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-semibold hover:text-pink-deep"><ExternalLink className="h-4 w-4" /> {a.website}</a>}
            </div>
          </Panel>
          <Panel>
            <h2 className="text-xl font-semibold">Internal notes</h2>
            <p className="mt-1 text-xs text-muted-foreground">Private to the team. Never shown to the applicant.</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-3 min-h-36 w-full rounded-2xl border border-input bg-card p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/40"
              placeholder="Add a note…"
            />
            <Button className="mt-3 w-full" disabled={update.isPending || notes === (a.internal_notes ?? "")} onClick={() => update.mutate({ internal_notes: notes })}>
              {update.isPending && <Loader2 className="animate-spin" />} Save notes
            </Button>
          </Panel>
        </div>
      </div>
    </>
  );
}
