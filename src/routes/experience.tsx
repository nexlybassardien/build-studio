import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, SectionIntro } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { NextEditCard } from "@/components/site/NextEditCard";
import { brandImages } from "@/lib/brand-media";
import { settingsQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "The Market Experience — The Faisa Edit" },
      {
        name: "description",
        content:
          "Fashion, food, beauty, creative businesses and activations: discover what it feels like to spend a day at The Faisa Edit pop-up market.",
      },
      { property: "og:title", content: "The Market Experience — The Faisa Edit" },
      { property: "og:description", content: "There's always something to discover at The Faisa Edit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: Experience,
});

const worlds = [
  {
    title: "Fashion & lifestyle",
    caption: "Rails worth flipping through",
    body: "Independent labels, thrifted treasures, accessories and lifestyle pieces you won't find anywhere else.",
    img: brandImages.shop,
  },
  {
    title: "Food & drinks",
    caption: "Come hungry",
    body: "Food trucks, sweet treats, iced drinks and exciting food concepts to graze through all day.",
    img: brandImages.desserts,
  },
  {
    title: "Beauty & self-care",
    caption: "Swatch, sniff, repeat",
    body: "Skincare, cosmetics and little self-care rituals from brands who care about what goes into them.",
    img: brandImages.beauty,
  },
  {
    title: "Creative businesses",
    caption: "Made by hand",
    body: "Artists, makers and small creative businesses sharing the things they've poured their hearts into.",
    img: brandImages.vendorStall,
  },
];

const discoveries = [
  { title: "Family-friendly moments", body: "Where an edition allows, there's something for every age to enjoy.", img: brandImages.connect },
  { title: "Unique activations", body: "Brand experiences, pop-up moments and interactive surprises.", img: brandImages.experience },
  { title: "Photo-worthy details", body: "Installations designed to be shared, saved and remembered.", img: brandImages.hero },
  { title: "Evening atmosphere", body: "Fairy lights, music and the buzz of a good crowd.", img: brandImages.crowdNight },
];

function Experience() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const [active, setActive] = useState(0);

  return (
    <>
      <PageHero
        eyebrow="The market experience"
        title="A day out,"
        italic="perfectly edited."
        intro="Shop, eat, discover, connect. Here's what spending a day at The Faisa Edit feels like."
        image={brandImages.experience}
      >
        <Button asChild size="lg">
          <Link to="/" hash="stay-in-the-loop">Get notified about the next edit</Link>
        </Button>
      </PageHero>

      {/* Worlds */}
      <section className="mx-auto max-w-6xl space-y-24 px-5 py-24 sm:px-8 md:space-y-32 md:py-32">
        {worlds.map((w, i) => (
          <Reveal key={w.title}>
            <div className={cn("grid items-center gap-10 md:grid-cols-2 md:gap-16", i % 2 && "md:[&>*:first-child]:order-2")}>
              <div className="relative">
                <img src={w.img} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-4xl object-cover shadow-float" />
                <span className="glass absolute bottom-5 left-5 rounded-full px-4 py-2 font-italic-serif text-lg shadow-soft">
                  {w.caption}
                </span>
              </div>
              <div>
                <p className="eyebrow text-pink-deep">0{i + 1}</p>
                <h2 className="mt-3 text-5xl font-semibold leading-[0.98] sm:text-6xl">{w.title}</h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">{w.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Always something to discover */}
      <section className="bg-ink py-24 text-ink-foreground md:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <p className="eyebrow text-pink">Keep exploring</p>
            <h2 className="mt-3 max-w-3xl text-5xl font-semibold leading-[0.98] sm:text-7xl">
              There&apos;s always something <span className="font-italic-serif text-pink">to discover.</span>
            </h2>
          </Reveal>
          <div className="mt-14 flex flex-col gap-3 md:h-[520px] md:flex-row">
            {discoveries.map((d, i) => (
              <button
                key={d.title}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-expanded={active === i}
                className={cn(
                  "group relative h-64 overflow-hidden rounded-3xl text-left transition-all duration-700 ease-ios md:h-full",
                  active === i ? "md:flex-[3]" : "md:flex-1",
                )}
              >
                <img src={d.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-card-scrim" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-2xl font-semibold text-ink-foreground">{d.title}</p>
                  <p
                    className={cn(
                      "mt-2 max-w-sm text-sm text-ink-foreground/85 transition-all duration-500",
                      active === i ? "opacity-100" : "md:opacity-0",
                    )}
                  >
                    {d.body}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <NextEditCard settings={settings} />
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 rounded-4xl bg-secondary p-8 sm:p-12 md:flex-row md:items-center">
          <SectionIntro title="Want to be on the" italic="other side of the table?" />
          <Button asChild size="lg" variant="ink">
            <Link to="/become-a-vendor">
              Apply for a stall <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
