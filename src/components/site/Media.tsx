import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import type { GalleryItem } from "@/lib/brand-media";
import { cn } from "@/lib/utils";

/** Reusable media tile: lazy image or hover-preview video with poster. */
export function MediaTile({
  item,
  onOpen,
  className,
  aspect,
}: {
  item: GalleryItem;
  onOpen?: () => void;
  className?: string;
  aspect?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => videoRef.current?.pause()}
      className={cn(
        "group relative block w-full overflow-hidden rounded-3xl bg-muted text-left shadow-soft transition-shadow duration-500 ease-ios hover:shadow-float focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      aria-label={item.caption ? `Open: ${item.caption}` : `Open ${item.media_type}`}
    >
      {item.media_type === "video" ? (
        <video
          ref={videoRef}
          src={item.url}
          poster={item.poster_url ?? undefined}
          muted
          loop
          playsInline
          preload="metadata"
          className={cn("w-full object-cover transition-transform duration-700 ease-ios group-hover:scale-[1.04]", aspect)}
        />
      ) : (
        <img
          src={item.url}
          alt={item.caption ?? "A moment from The Faisa Edit"}
          loading="lazy"
          decoding="async"
          className={cn("w-full object-cover transition-transform duration-700 ease-ios group-hover:scale-[1.04]", aspect)}
        />
      )}
      {item.media_type === "video" && (
        <span className="glass-dark absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-ink-foreground">
          <Play className="h-4 w-4 fill-current" />
        </span>
      )}
      {(item.caption || item.category) && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-card-scrim p-4 pt-12 opacity-0 transition-all duration-500 ease-ios group-hover:translate-y-0 group-hover:opacity-100">
          {item.category && <span className="eyebrow block text-ink-foreground/80">{item.category}</span>}
          {item.caption && <span className="mt-1 block text-sm font-medium text-ink-foreground">{item.caption}</span>}
        </span>
      )}
    </button>
  );
}

/** Full-screen lightbox with keyboard + swipe navigation and video controls. */
export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null;
  const item = open ? items[index] : null;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onIndex((index + dir + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, go]);

  useEffect(() => setPlaying(true), [index]);

  if (!item) return null;

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Media viewer"
      className="fixed inset-0 z-[60] flex animate-in fade-in items-center justify-center bg-ink/95 duration-300"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-6">
        <span className="eyebrow text-ink-foreground/70">
          {index! + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="glass-dark grid h-11 w-11 place-items-center rounded-full text-ink-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex max-h-[82vh] max-w-[92vw] items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {item.media_type === "video" ? (
          <>
            <video
              key={item.id}
              ref={videoRef}
              src={item.url}
              poster={item.poster_url ?? undefined}
              autoPlay
              playsInline
              controls
              className="max-h-[82vh] max-w-[92vw] rounded-3xl"
            />
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause video" : "Play video"}
              className="glass-dark absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-full text-ink-foreground"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </>
        ) : (
          <img
            key={item.id}
            src={item.url}
            alt={item.caption ?? "A moment from The Faisa Edit"}
            className="max-h-[82vh] max-w-[92vw] animate-in zoom-in-95 rounded-3xl object-contain duration-500"
          />
        )}
      </div>

      {(item.caption || item.category) && (
        <div className="absolute inset-x-0 bottom-0 p-6 text-center" onClick={(e) => e.stopPropagation()}>
          {item.category && <p className="eyebrow text-pink">{item.category}</p>}
          {item.caption && <p className="mt-1 text-sm text-ink-foreground/90">{item.caption}</p>}
        </div>
      )}

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous"
            className="glass-dark absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-ink-foreground sm:grid"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next"
            className="glass-dark absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-ink-foreground sm:grid"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
