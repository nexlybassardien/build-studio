import { useRef, useState } from "react";
import { FileText, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export type UploadedFile = { path: string; name: string; preview?: string; isImage: boolean };

const MAX_BYTES = 10 * 1024 * 1024;

export function FileDrop({
  label,
  hint,
  draftId,
  accept,
  multiple,
  max,
  files,
  onChange,
  imagesOnly,
}: {
  label: string;
  hint: string;
  draftId: string;
  accept: string;
  multiple?: boolean;
  max: number;
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  imagesOnly?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const handle = async (list: FileList | null) => {
    if (!list?.length) return;
    setError(null);
    const incoming = Array.from(list).slice(0, Math.max(0, max - files.length));
    if (!incoming.length) {
      setError(`You can upload up to ${max} file${max > 1 ? "s" : ""}.`);
      return;
    }
    for (const f of incoming) {
      if (f.size > MAX_BYTES) return setError(`${f.name} is larger than 10MB.`);
      if (imagesOnly && !f.type.startsWith("image/")) return setError(`${f.name} isn't an image.`);
    }
    setBusy(true);
    const added: UploadedFile[] = [];
    for (const f of incoming) {
      const ext = (f.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
      const path = `applications/${draftId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("vendor-uploads").upload(path, f, {
        contentType: f.type || undefined,
        upsert: false,
      });
      if (upErr) {
        setError(`Couldn't upload ${f.name}. Please try again.`);
        continue;
      }
      const isImage = f.type.startsWith("image/");
      added.push({ path, name: f.name, isImage, preview: isImage ? URL.createObjectURL(f) : undefined });
    }
    setBusy(false);
    onChange(multiple ? [...files, ...added] : added.slice(0, 1));
  };

  return (
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handle(e.dataTransfer.files);
        }}
        disabled={busy || files.length >= max}
        className={cn(
          "mt-3 flex w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed px-4 py-8 text-sm transition-colors disabled:opacity-60",
          drag ? "border-primary bg-secondary" : "border-input bg-muted/50 hover:border-primary hover:bg-secondary/60",
        )}
      >
        {busy ? (
          <Loader2 className="h-6 w-6 animate-spin text-pink-deep" />
        ) : imagesOnly ? (
          <ImagePlus className="h-6 w-6 text-pink-deep" />
        ) : (
          <Upload className="h-6 w-6 text-pink-deep" />
        )}
        <span className="font-semibold">{busy ? "Uploading…" : "Tap to upload or drag files here"}</span>
        <span className="text-xs text-muted-foreground">
          {files.length}/{max} · max 10MB each
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handle(e.target.files);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
      {files.length > 0 && (
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {files.map((f) => (
            <li key={f.path} className="group relative aspect-square overflow-hidden rounded-2xl bg-muted">
              {f.preview ? (
                <img src={f.preview} alt={f.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1 p-2 text-center">
                  <FileText className="h-6 w-6 text-pink-deep" />
                  <span className="line-clamp-2 text-[0.65rem] text-muted-foreground">{f.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => onChange(files.filter((x) => x.path !== f.path))}
                aria-label={`Remove ${f.name}`}
                className="glass absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
