import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Sparkles, Store, Users, Palette, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, SectionIntro } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { brandImages } from "@/lib/brand-media";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About The Faisa Edit — More than a market" },
      {
        name: "description",
        content:
          "The Faisa Edit is a youth-driven South African pop-up market celebrating small businesses, young entrepreneurs, independent brands and local creativity.",
      },
      { property: "og:title", content: "About The Faisa Edit" },
      { property: "og:description", content: "More than a market. A whole little universe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const values = [
  { icon: Store, title: "Small businesses", body: "Giving independent brands a beautiful stage to be discovered." },
  { icon: Rocket, title: "Young entrepreneurs", body: "Championing the next generation of founders and makers." },
  { icon: Sparkles, title: "Independent brands", body: "Curating labels with personality, story and soul." },
  { icon: Palette, title: "Local creativity", body: "Celebrating the artists, designers and dreamers around us." },
  { icon: Users, title: "Community", body: "Bringing people together over good food and good finds." },
  { icon: Heart, title: "Unique experiences", body: "Sweating the details so every edit feels worth showing up for." },
];

const chapters = [
  {
    n: "01",
    title: "The edit",
    body: "Every edition starts with curation: finding brands, food concepts and creatives that make people stop and look twice.",
    img: brandImages.discover,
  },
  {
    n: "02",
    title: "The details",
    body: "Pink installations, thoughtful styling and little surprises turn a market into a moment people want to capture.",
    img: brandImages.experience,
  },
  {
    n: "03",
    title: "The people",
    body: "Vendors, visitors and friends come together. Conversations start, businesses grow and the community gets bigger.",
    img: brandImages.connect,
  },
  {
    n: "04",
    title: "What's next",
    body: "The next edit is always in the making. Each edition learns from the last, with more to discover every time.",
    img: brandImages.crowdNight,
  },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About The Faisa Edit"
        title="More than a market."
        italic="A whole little universe."
        intro="A curated, youth-driven pop-up bringing together fashion, food, lifestyle, beauty, creativity and the small businesses that make it all happen."
        image={brandImages.connect}
      />

      <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 md:py-32">
        <Reveal>
          <p className="font-italic-serif text-3xl leading-snug text-balance sm:text-5xl">
            We believe the best finds come with a story, and the best days are the ones spent{" "}
            <span className="text-pink-deep">supporting the people around you.</span>
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            The Faisa Edit is a platform for exciting local brands to be discovered, and a space for visitors to shop,
            eat, connect and simply enjoy the atmosphere. It&apos;s playful, a little bit pink and made for everyone.
          </p>
        </Reveal>
      </section>

      <section className="bg-gradient-blush py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <SectionIntro eyebrow="What we celebrate" title="Made for the makers," italic="and everyone who loves them." />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 3) * 80}>
                <div className="h-full rounded-3xl bg-card p-7 shadow-soft transition-all duration-500 ease-ios hover:-translate-y-1 hover:shadow-float">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-pink-deep">
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold">{v.title}</h3>
                  <p className="mt-2 text-muted-foreground">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <SectionIntro eyebrow="How an edit comes together" title="The story," italic="chapter by chapter." />
        </Reveal>
        <div className="mt-16 space-y-20 md:space-y-28">
          {chapters.map((c, i) => (
            <Reveal key={c.n}>
              <div className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="relative">
                  <img src={c.img} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-4xl object-cover shadow-float" />
                  <span className="absolute -top-6 left-6 font-display text-8xl font-semibold italic text-primary">{c.n}</span>
                </div>
                <div>
                  <p className="eyebrow text-pink-deep">Chapter {c.n}</p>
                  <h3 className="mt-3 text-5xl font-semibold">{c.title}</h3>
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-3 pb-24 sm:px-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center rounded-4xl bg-gradient-pink px-6 py-20 text-center">
          <h2 className="max-w-3xl text-4xl font-semibold text-ink text-balance sm:text-6xl">
            Want to be part of the <span className="font-italic-serif">next chapter?</span>
          </h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="ink">
              <Link to="/become-a-vendor">Apply as a vendor</Link>
            </Button>
            <Button asChild size="lg" variant="light">
              <Link to="/past-markets">See past markets</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
