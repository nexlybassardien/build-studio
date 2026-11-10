import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminHeader, EmptyState, Panel } from "@/components/admin/AdminUI";
import { Field, TextArea, TextInput } from "@/components/vendor/fields";
import { supabase } from "@/integrations/supabase/client";
import { uploadMediaFile } from "@/lib/admin";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/spotlights")({
  component: Spotlights,
});

const empty = { brand_name: "", description: "", instagram: "" };

function Spotlights() {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const [logo, setLogo] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "spotlights"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vendor_spotlights").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "spotlights"] });
    qc.invalidateQueries({ queryKey: ["public"] });
  };

  const add = async () => {
    if (!form.brand_name.trim()) return toast.error("Brand name is required");
    setSaving(true);
    try {
      const logo_url = logo ? (await uploadMediaFile(logo, "spotlights")).url : null;
      const image_url = image ? (await uploadMediaFile(image, "spotlights")).url : null;
      const { error } = await supabase.from("vendor_spotlights").insert({
        brand_name: form.brand_name.trim(),
        description: form.description.trim() || null,
        instagram: form.instagram.trim().replace(/^@/, "") || null,
        logo_url,
        image_url,
        sort_order: data.length + 1,
      });
      if (error) throw error;
      toast.success("Spotlight added");
      setForm(empty);
      setLogo(null);
      setImage(null);
      refresh();
    } catch {
      toast.error("Couldn't add spotlight");
    } finally {
      setSaving(false);
    }
  };

  const toggle = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("vendor_spotlights").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vendor_spotlights").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      refresh();
    },
  });

  return (
    <>
      <AdminHeader title="Vendor Spotlights" subtitle="Feature businesses that have taken part in past editions on the Past Markets page." />
      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <Panel>
          <h2 className="text-xl font-semibold">Add a spotlight</h2>
          <div className="mt-4 space-y-4">
            <Field label="Brand name" htmlFor="s-name">
              <TextInput id="s-name" value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} />
            </Field>
            <Field label="Description" optional htmlFor="s-desc">
              <TextArea id="s-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Field>
            <Field label="Instagram handle" optional htmlFor="s-ig">
              <TextInput id="s-ig" value={form.instagram} placeholder="@brand" onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
            </Field>
            <Field label="Logo" optional htmlFor="s-logo">
              <input id="s-logo" type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:font-semibold" />
            </Field>
            <Field label="Feature photo" optional htmlFor="s-img">
              <input id="s-img" type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:font-semibold" />
            </Field>
            <Button onClick={add} disabled={saving} className="w-full">
              {saving ? <Loader2 className="animate-spin" /> : <Plus />} Add spotlight
            </Button>
          </div>
        </Panel>
        <div className="space-y-3">
          {isLoading ? (
            <Loader2 className="mx-auto mt-12 h-8 w-8 animate-spin text-pink-deep" />
          ) : data.length === 0 ? (
            <EmptyState title="No spotlights yet" body="Add your first featured vendor using the form." />
          ) : (
            data.map((s) => (
              <div key={s.id} className={cn("grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-3xl bg-card p-4 shadow-soft", !s.published && "opacity-60")}>
                {s.logo_url || s.image_url ? (
                  <img src={(s.logo_url || s.image_url)!} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                ) : (
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-secondary" />
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold">{s.brand_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.instagram ? `@${s.instagram}` : "No Instagram"} · {s.published ? "Published" : "Hidden"}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="icon" variant="ghost" onClick={() => toggle.mutate({ id: s.id, published: !s.published })} aria-label={s.published ? "Hide" : "Publish"}>
                    {s.published ? <Eye /> : <EyeOff />}
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" aria-label="Delete" onClick={() => confirm("Delete this spotlight?") && remove.mutate(s.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
