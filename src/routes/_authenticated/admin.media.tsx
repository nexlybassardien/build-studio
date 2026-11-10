import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Play, Star, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminHeader, EmptyState, Panel, selectClass } from "@/components/admin/AdminUI";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { uploadMediaFile } from "@/lib/admin";
import { cn } from "@/lib/utils";

type Media = Database["public"]["Tables"]["media_items"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaManager,
});

const CATEGORIES = ["Atmosphere", "Vendors", "Food", "Food trucks", "Fashion", "Beauty", "Installations", "Behind the scenes", "Community", "Collaborations", "Crowd"];

function MediaManager() {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [category, setCategory] = useState("Atmosphere");

  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "media"],
    queryFn: async () => {
      const { data, error } = await supabase.from("media_items").select("*").order("sort_order").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin"] });
    qc.invalidateQueries({ queryKey: ["public"] });
  };

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files);
    setUploading(list.length);
    const maxOrder = data.reduce((m, x) => Math.max(m, x.sort_order), 0);
    let ok = 0;
    for (const [i, f] of list.entries()) {
      try {
        const isVideo = f.type.startsWith("video/");
        if (!isVideo && !f.type.startsWith("image/")) throw new Error("Unsupported file");
        const { path, url } = await uploadMediaFile(f, "gallery");
        const { error } = await supabase.from("media_items").insert({
          media_type: isVideo ? "video" : "image",
          url,
          storage_path: path,
          category,
          sort_order: maxOrder + i + 1,
        });
        if (error) throw error;
        ok++;
      } catch {
        toast.error(`Couldn't upload ${f.name}`);
      }
      setUploading((n) => n - 1);
    }
    if (ok) toast.success(`${ok} item${ok > 1 ? "s" : ""} added to the gallery`);
    refresh();
  };

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<Media> }) => {
      const { error } = await supabase.from("media_items").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
    onError: () => toast.error("Couldn't save"),
  });

  const remove = useMutation({
    mutationFn: async (m: Media) => {
      if (m.storage_path) await supabase.storage.from("media").remove([m.storage_path]);
      const { error } = await supabase.from("media_items").delete().eq("id", m.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      refresh();
    },
    onError: () => toast.error("Couldn't delete"),
  });

  const move = async (index: number, dir: -1 | 1) => {
    const a = data[index];
    const b = data[index + dir];
    if (!a || !b) return;
    const aOrder = a.sort_order === b.sort_order ? index : a.sort_order;
    const bOrder = a.sort_order === b.sort_order ? index + dir : b.sort_order;
    await Promise.all([
      supabase.from("media_items").update({ sort_order: bOrder }).eq("id", a.id),
      supabase.from("media_items").update({ sort_order: aOrder }).eq("id", b.id),
    ]);
    refresh();
  };

  const setPoster = async (m: Media, file: File) => {
    try {
      const { url } = await uploadMediaFile(file, "posters");
      patch.mutate({ id: m.id, values: { poster_url: url } });
    } catch {
      toast.error("Couldn't upload poster");
    }
  };

  return (
    <>
      <AdminHeader
        title="Media Manager"
        subtitle="Upload real market photos and videos. Starred items are featured on the homepage."
      />
      <Panel className="mb-6">
        <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <select aria-label="Category for new uploads" value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">Images and videos (MP4/MOV). Choose a category, then upload.</p>
          <Button onClick={() => inputRef.current?.click()} disabled={uploading > 0}>
            {uploading > 0 ? <Loader2 className="animate-spin" /> : <Upload />}
            {uploading > 0 ? `Uploading ${uploading}…` : "Upload media"}
          </Button>
          <input ref={inputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
        </div>
      </Panel>

      {isLoading ? (
        <Loader2 className="mx-auto mt-12 h-8 w-8 animate-spin text-pink-deep" />
      ) : data.length === 0 ? (
        <EmptyState title="No media yet" body="Until you upload, the website shows placeholder mood imagery. Upload real market photos and Reels to replace it." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((m, i) => (
            <MediaCard
              key={m.id}
              m={m}
              first={i === 0}
              last={i === data.length - 1}
              onMove={(d) => move(i, d)}
              onPatch={(values) => patch.mutate({ id: m.id, values })}
              onDelete={() => {
                if (confirm("Delete this item permanently?")) remove.mutate(m);
              }}
              onPoster={(f) => setPoster(m, f)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function MediaCard({
  m,
  first,
  last,
  onMove,
  onPatch,
  onDelete,
  onPoster,
}: {
  m: Media;
  first: boolean;
  last: boolean;
  onMove: (d: -1 | 1) => void;
  onPatch: (v: Partial<Media>) => void;
  onDelete: () => void;
  onPoster: (f: File) => void;
}) {
  const [caption, setCaption] = useState(m.caption ?? "");
  const posterRef = useRef<HTMLInputElement>(null);
  return (
    <div className="overflow-hidden rounded-3xl bg-card shadow-soft">
      <div className="relative aspect-[4/3] bg-muted">
        {m.media_type === "video" ? (
          <video src={m.url} poster={m.poster_url ?? undefined} muted controls preload="metadata" className="h-full w-full object-cover" />
        ) : (
          <img src={m.url} alt={m.caption ?? ""} loading="lazy" className="h-full w-full object-cover" />
        )}
        <button
          type="button"
          onClick={() => onPatch({ featured: !m.featured })}
          aria-label={m.featured ? "Remove from homepage" : "Feature on homepage"}
          className={cn("absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full shadow-soft", m.featured ? "bg-primary text-primary-foreground" : "glass")}
        >
          <Star className={cn("h-4 w-4", m.featured && "fill-current")} />
        </button>
        {m.media_type === "video" && (
          <span className="glass absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold">
            <Play className="h-3 w-3" /> Video
          </span>
        )}
      </div>
      <div className="space-y-2 p-4">
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          onBlur={() => caption !== (m.caption ?? "") && onPatch({ caption: caption || null })}
          placeholder="Add a caption…"
          className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:border-primary"
        />
        <select value={m.category ?? ""} onChange={(e) => onPatch({ category: e.target.value || null })} className={cn(selectClass, "h-10 w-full")} aria-label="Category">
          <option value="">No category</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="flex items-center gap-1 pt-1">
          <Button size="icon" variant="ghost" disabled={first} onClick={() => onMove(-1)} aria-label="Move earlier"><ArrowUp /></Button>
          <Button size="icon" variant="ghost" disabled={last} onClick={() => onMove(1)} aria-label="Move later"><ArrowDown /></Button>
          {m.media_type === "video" && (
            <>
              <Button size="sm" variant="ghost" onClick={() => posterRef.current?.click()}>Poster image</Button>
              <input ref={posterRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onPoster(e.target.files[0])} />
            </>
          )}
          <Button size="icon" variant="ghost" className="ml-auto text-destructive" onClick={onDelete} aria-label="Delete"><Trash2 /></Button>
        </div>
      </div>
    </div>
  );
}
