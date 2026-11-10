import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, SectionIntro } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox, MediaTile } from "@/components/site/Media";
import { brandImages, fallbackGallery, INSTAGRAM_URL, type GalleryItem } from "@/lib/brand-media";
import { mediaQuery, spotlightsQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/past-markets")({
  head: () => ({
    meta: [
      { title: "Past Markets & Gallery — The Faisa Edit" },
      {
        name: "description",
        content:
          "Photos, Reels and vendor highlights from past editions of The Faisa Edit, a curated lifestyle pop-up market in South Africa.",
      },
      { property: "og:title", content: "Past Markets — The Faisa Edit" },
      { property: "og:description", content: "The memories, the people, the brands and everything in between." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(mediaQuery),
      context.queryClient.ensureQueryData(spotlightsQuery),
    ]),
  component: PastMarkets,
});

const FILTERS = [
  { key: "all", label: "Everything" },
  { key: "image", label: "Photos" },
  { key: "video", label: "Videos" },
] as const;

function PastMarkets() {
  const { data: media } = useSuspenseQuery(mediaQuery);
  const { data: spotlights } = useSuspenseQuery(spotlightsQuery);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [open, setOpen] = useState<number | null>(null);

  const all: GalleryItem[] = media.length ? media : fallbackGallery;
  const items = useMemo(() => (filter === "all" ? all : all.filter((m) => m.media_type === filter)), [all, filter]);
  const reels = all.filter((m) => m.media_type === "video");

  return (
    <>
      <PageHero
        eyebrow="Past markets"
        title="A little look at"
        italic="the magic."
        intro="The memories, the people, the brands and everything in between."
        image={brandImages.crowdNight}
      />

      {reels.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pt-20 sm:px-8">
          <Reveal>
            <SectionIntro eyebrow="Reels" title="Press play on" italic="the vibe." />
          </Reveal>
          <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0">
            {reels.map((r) => (
              <div key={r.id} className="w-56 shrink-0 snap-start sm:w-64">
                <MediaTile item={r} aspect="aspect-[9/16]" onOpen={() => setOpen(items.findIndex((x) => x.id === r.id))} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="sticky top-20 z-30 -mx-2 mb-8 flex justify-center">
          <div className="glass inline-flex rounded-full p-1 shadow-float" role="tablist" aria-label="Filter gallery">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "h-10 rounded-full px-5 text-sm font-semibold transition-all duration-300 ease-ios",
                  filter === f.key ? "bg-ink text-ink-foreground" : "text-foreground/70 hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-4xl bg-secondary p-12 text-center">
            <p className="font-display text-3xl font-semibold">Nothing here yet</p>
            <p className="mt-2 text-muted-foreground">New {filter === "video" ? "videos" : "photos"} are on their way. Catch the latest on Instagram.</p>
          </div>
        ) : (
          <div className="masonry columns-2 md:columns-3 lg:columns-4">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={(i % 4) * 60}>
                <MediaTile item={item} onOpen={() => setOpen(i)} />
              </Reveal>
            ))}
          </div>
        )}
        <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
      </section>

      {/* Vendor spotlight */}
      <section className="bg-gradient-blush py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <SectionIntro
              eyebrow="Vendor spotlight"
              title="The brands that"
              italic="made it special."
              body="A celebration of the businesses who've been part of past editions."
            />
          </Reveal>
          {spotlights.length === 0 ? (
            <Reveal className="mt-10 rounded-4xl border-2 border-dashed border-primary/50 bg-card/60 p-10 text-center">
              <p className="font-display text-2xl font-semibold">Spotlights coming soon</p>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                We&apos;re putting together features on some of our favourite past vendors. Want to be featured next?
              </p>
              <Button asChild className="mt-6">
                <Link to="/become-a-vendor">Apply to be a vendor</Link>
              </Button>
            </Reveal>
          ) : (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {spotlights.map((s, i) => (
                <Reveal key={s.id} delay={(i % 3) * 80}>
                  <article className="group h-full overflow-hidden rounded-4xl bg-card shadow-soft transition-all duration-500 ease-ios hover:-translate-y-1 hover:shadow-float">
                    {s.image_url && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={s.image_url} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-ios group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3">
                        {s.logo_url && <img src={s.logo_url} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-2xl object-cover" />}
                        <h3 className="min-w-0 truncate text-2xl font-semibold">{s.brand_name}</h3>
                      </div>
                      {s.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>}
                      {s.instagram && (
                        <a
                          href={`https://www.instagram.com/${s.instagram.replace(/^@/, "")}/`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-pink-deep"
                        >
                          <Instagram className="h-4 w-4" /> @{s.instagram.replace(/^@/, "")}
                        </a>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 text-center sm:px-8">
        <h2 className="text-4xl font-semibold sm:text-5xl">
          See more on <span className="font-italic-serif text-pink-deep">Instagram</span>
        </h2>
        <Button asChild size="lg" className="mt-8">
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            <Instagram /> @thefaisaeditx
          </a>
        </Button>
      </section>
    </>
  );
}
