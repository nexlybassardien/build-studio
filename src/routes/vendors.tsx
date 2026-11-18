import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, SectionIntro } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { brandImages } from "@/lib/brand-media";
import { vendors } from "@/lib/vendors";

export const Route = createFileRoute("/vendors")({
  head: () => ({
    meta: [
      { title: "Current Vendors — The Faisa Edit" },
      {
        name: "description",
        content: "Meet the independent brands joining the current edition of The Faisa Edit.",
      },
    ],
  }),
  component: Vendors,
});

function Vendors() {
  return (
    <>
      <PageHero
        eyebrow="The current edition"
        title="Meet the"
        italic="vendors."
        intro="Get to know the independent brands bringing this edition of The Faisa Edit to life."
        image={brandImages.crowdNight}
      >
        <Button asChild size="lg">
          <Link to="/become-a-vendor">Join a future edition</Link>
        </Button>
      </PageHero>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <Reveal>
          <SectionIntro
            eyebrow="Current vendors"
            title="Good people, great"
            italic="little businesses."
            body="Meet the brands you can discover at the market. Save your favourites and come say hello."
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-14 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {vendors.map((vendor, i) => (
            <Reveal key={vendor.name} delay={(i % 4) * 60}>
              <article className="rounded-3xl bg-card p-2.5 shadow-soft transition-shadow duration-500 hover:shadow-float sm:p-3">
                <img
                  src={vendor.image}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-2xl object-cover"
                />
                <h2 className="px-1 pb-1 pt-3 font-display text-lg font-semibold sm:px-2 sm:text-xl">
                  {vendor.name}
                </h2>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16 flex flex-col items-start justify-between gap-6 rounded-4xl bg-secondary p-8 sm:p-10 md:flex-row md:items-center">
          <div>
            <p className="eyebrow text-pink-deep">Your brand belongs here</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Ready to join the next edit?
            </h2>
          </div>
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
