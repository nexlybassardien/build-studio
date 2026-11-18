import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Instagram, Sparkles } from "lucide-react";
import heroVideo from "@/assets/faisa-hero-video.mp4";
import mobileHeroVideo from "@/assets/faisa-mobile.mp4";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox, MediaTile } from "@/components/site/Media";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { SectionIntro } from "@/components/site/PageHero";
import { getMarketMessage } from "@/components/site/NextEditCard";
import { brandImages, fallbackGallery, INSTAGRAM_URL, type GalleryItem } from "@/lib/brand-media";
import { vendors } from "@/lib/vendors";
import { mediaQuery, settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Faisa Edit — Not just a market. It's an entire experience." },
      {
        name: "description",
        content:
          "A curated, youth-driven pop-up market in South Africa. Discover local fashion, beauty, food, creatives and small businesses at The Faisa Edit.",
      },
      { property: "og:title", content: "The Faisa Edit — A curated pop-up experience" },
      {
        property: "og:description",
        content:
          "Discover local brands, good food, exciting finds and the people making things happen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "The Faisa Edit",
          description: "A curated, youth-driven pop-up market experience in South Africa.",
          sameAs: [INSTAGRAM_URL],
        }),
      },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(mediaQuery),
    ]),
  component: Home,
});

const experiences = [
  {
    key: "Shop",
    body: "Discover independent fashion, beauty and lifestyle brands.",
    img: brandImages.shop,
  },
  {
    key: "Eat",
    body: "Explore delicious food, treats and exciting food concepts.",
    img: brandImages.eat,
  },
  {
    key: "Discover",
    body: "Find unique products, emerging businesses and local talent.",
    img: brandImages.discover,
  },
  {
    key: "Connect",
    body: "Meet people, support entrepreneurs and enjoy the atmosphere.",
    img: brandImages.connect,
  },
  {
    key: "Experience",
    body: "Enjoy the details, installations, activations and surprises.",
    img: brandImages.experience,
  },
];

function Home() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { data: media } = useSuspenseQuery(mediaQuery);
  const market = getMarketMessage(settings);

  const highlights: GalleryItem[] = useMemo(() => {
    const featured = media.filter((m) => m.featured);
    const source = featured.length ? featured : media;
    return source.length ? source.slice(0, 9) : fallbackGallery.slice(0, 9);
  }, [media]);
  const igItems = (media.length ? media : fallbackGallery).slice(0, 6);

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [igLightbox, setIgLightbox] = useState<number | null>(null);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
        <video
          poster={brandImages.hero}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 -z-10 hidden h-full w-full object-cover md:block"
        >
          <source src={heroVideo} type="video/mp4" media="(min-width: 768px)" />
        </video>
        <img
          src={brandImages.hero}
          alt="Friends shopping at a pink pop-up market at golden hour"
          width={1920}
          height={1088}
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full animate-kenburns object-cover md:hidden"
        />
        <video
          poster={brandImages.hero}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 -z-10 h-full w-full object-cover md:hidden"
        >
          <source src={mobileHeroVideo} type="video/mp4" media="(max-width: 767px)" />
        </video>
        <div aria-hidden className="absolute inset-0 -z-10 bg-hero-scrim" />

        <div className="mx-auto w-full max-w-6xl px-5 pb-12 pt-32 sm:px-8 sm:pb-16">
          <span className="glass-dark inline-flex animate-rise items-center gap-2 rounded-full px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ink-foreground">
            <Sparkles className="h-3.5 w-3.5 text-pink" /> A curated pop-up experience
          </span>
          <h1 className="mt-6 animate-rise font-sans text-[3.2rem] font-extrabold uppercase leading-[0.85] tracking-[-0.04em] text-ink-foreground [animation-delay:100ms] sm:text-[6.5rem] lg:text-[9rem]">
            The Faisa
            <br />
            Edit
          </h1>
          <p className="mt-6 max-w-2xl animate-rise font-italic-serif text-3xl leading-[1.08] text-ink-foreground [animation-delay:200ms] sm:text-5xl">
            &ldquo;Not just a market.{" "}
            <span className="text-blush">It&apos;s an entire experience.&rdquo;</span>
          </p>
          <p className="mt-5 hidden max-w-lg animate-rise text-base leading-relaxed text-ink-foreground/85 [animation-delay:280ms] sm:block sm:text-lg">
            Discover local brands, good food, exciting finds and the people making things happen.
          </p>
          <div className="mt-8 flex animate-rise flex-col gap-3 [animation-delay:360ms] sm:flex-row">
            <Button asChild size="lg">
              <Link to="/experience">Explore the experience</Link>
            </Button>
            <Button asChild size="lg" variant="glass">
              <Link to="/become-a-vendor">Become a vendor</Link>
            </Button>
          </div>
        </div>

        {/* Floating status card */}
        <div className="absolute right-5 top-28 hidden w-72 animate-floaty sm:right-8 md:block [--r:2deg]">
          <div className="glass rounded-3xl p-5 shadow-float">
            <p className="eyebrow text-pink-deep">
              {market.hasEvent ? "Save the date" : "Coming soon"}
            </p>
            <p className="mt-2 font-display text-xl font-semibold uppercase leading-tight">
              {market.pill}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {market.hasEvent ? market.title : "Something exciting is coming. Stay in the loop."}
            </p>
            <Link
              to="/"
              hash="stay-in-the-loop"
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-pink-deep"
            >
              Get notified <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-border bg-primary py-4 text-primary-foreground">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10" aria-hidden={k === 1}>
              {[
                "Fashion",
                "Food",
                "Beauty",
                "Lifestyle",
                "Creatives",
                "Small businesses",
                "Good vibes",
                "Unique finds",
              ].map((w) => (
                <span key={w} className="flex items-center gap-10 font-display text-2xl italic">
                  {w} <span className="text-base not-italic">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* BRAND INTRO */}
      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-24 sm:px-8 md:grid-cols-2 md:py-32">
        <Reveal>
          <p className="eyebrow text-pink-deep">Welcome to the edit</p>
          <h2 className="mt-4 text-5xl font-semibold leading-[0.98] text-balance sm:text-6xl">
            Your favourite little world of{" "}
            <span className="font-italic-serif text-pink-deep">everything.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            The Faisa Edit brings together some of the most exciting independent brands, food
            concepts, creatives and entrepreneurs under one roof.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            From fashion and beauty to delicious food and unique finds, every edition is curated to
            create an experience worth showing up for.
          </p>
          <Button asChild variant="link" className="mt-6 text-base">
            <Link to="/about">
              Our story <ArrowRight />
            </Link>
          </Button>
        </Reveal>
        <Reveal delay={120} className="relative h-[520px] sm:h-[600px]">
          <img
            src={brandImages.shop}
            alt="Pastel clothing on a boutique rail"
            loading="lazy"
            className="absolute left-0 top-0 h-[78%] w-[62%] rounded-4xl object-cover shadow-float"
          />
          <img
            src={brandImages.desserts}
            alt="Strawberry tarts and pink cupcakes"
            loading="lazy"
            className="absolute bottom-0 right-0 h-[60%] w-[56%] rounded-4xl border-[6px] border-background object-cover shadow-float"
          />
          <div className="absolute bottom-[18%] left-[4%] animate-floaty rounded-2xl bg-card px-4 py-3 shadow-float [--r:-4deg]">
            <p className="font-italic-serif text-lg">curated with love ♡</p>
          </div>
        </Reveal>
      </section>

      {/* THE EXPERIENCE */}
      <section className="bg-gradient-blush py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionIntro eyebrow="The experience" title="Five ways to" italic="spend your day." />
            <Button asChild variant="outline">
              <Link to="/experience">
                See the full experience <ArrowUpRight />
              </Link>
            </Button>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {experiences.map((x, i) => (
              <Reveal
                key={x.key}
                delay={i * 80}
                className={i === 0 ? "col-span-2 lg:col-span-1" : ""}
              >
                <Link
                  to="/experience"
                  className="group relative block aspect-[3/4] overflow-hidden rounded-3xl shadow-soft transition-shadow duration-500 ease-ios hover:shadow-float"
                >
                  <img
                    src={x.img}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-ios group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-card-scrim" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="font-sans text-2xl font-extrabold uppercase tracking-tight text-ink-foreground sm:text-3xl">
                      {x.key}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-ink-foreground/85 sm:text-sm">
                      {x.body}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CURRENT VENDORS */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionIntro
            eyebrow="Current vendors"
            title="Meet the brands"
            italic="behind the edit."
            body="Get to know the small businesses bringing this edition to life."
          />
          <Button asChild variant="outline">
            <Link to="/vendors">
              Meet all the vendors <ArrowRight />
            </Link>
          </Button>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-4">
          {vendors.slice(0, 4).map((vendor, i) => (
            <Reveal key={vendor.name} delay={i * 70}>
              <Link to="/vendors" className="group block">
                <img
                  src={vendor.image}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/5] w-full rounded-3xl object-cover shadow-soft transition-shadow duration-500 group-hover:shadow-float"
                />
                <p className="mt-3 font-display text-lg font-semibold">{vendor.name}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PAST MARKET HIGHLIGHTS */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <SectionIntro
            eyebrow="Past market highlights"
            title="A little look at"
            italic="the magic."
            body="The memories, the people, the brands and everything in between."
          />
        </Reveal>
        <div className="masonry mt-12 columns-2 md:columns-3">
          {highlights.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 80}>
              <MediaTile item={item} onOpen={() => setLightbox(i)} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/past-markets">View the full gallery</Link>
          </Button>
        </div>
        <Lightbox
          items={highlights}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onIndex={setLightbox}
        />
      </section>

      {/* VENDOR FEATURE */}
      <section className="px-3 sm:px-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-4xl bg-gradient-pink px-6 py-20 sm:px-12 md:py-28">
          <div
            aria-hidden
            className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-blush/50 blur-3xl"
          />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <Reveal>
              <p className="eyebrow text-ink/70">For brands &amp; vendors</p>
              <h2 className="mt-4 text-5xl font-semibold leading-[0.95] text-ink text-balance sm:text-7xl">
                Have a brand? <span className="font-italic-serif">We have a spot for you.</span>
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80">
                Whether you&apos;re serving something delicious, selling your next favourite find or
                bringing a creative concept to life, The Faisa Edit could be the perfect place to
                showcase your business.
              </p>
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button asChild size="lg" variant="ink">
                  <Link to="/become-a-vendor">Apply for a stall</Link>
                </Button>
                <Link
                  to="/become-a-vendor"
                  hash="how-it-works"
                  className="inline-flex items-center gap-1.5 font-semibold text-ink underline-offset-4 hover:underline"
                >
                  How vendor applications work <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={150} className="relative h-[420px] sm:h-[480px]">
              <img
                src={brandImages.vendorStall}
                alt="A smiling vendor behind her styled market stall"
                loading="lazy"
                className="absolute right-0 top-0 h-[72%] w-[86%] rounded-4xl object-cover shadow-float"
              />
              <img
                src={brandImages.eat}
                alt="A pink food truck with customers"
                loading="lazy"
                className="absolute bottom-0 left-0 h-[52%] w-[46%] rounded-3xl border-[6px] border-primary object-cover shadow-float"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionIntro
            eyebrow="@thefaisaeditx"
            title="Your front-row seat to"
            italic="the Faisa Edit."
          />
          <Button asChild>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              <Instagram /> Follow on Instagram
            </a>
          </Button>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {igItems.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 70}>
              <MediaTile item={item} aspect="aspect-square" onOpen={() => setIgLightbox(i)} />
            </Reveal>
          ))}
        </div>
        <Lightbox
          items={igItems}
          index={igLightbox}
          onClose={() => setIgLightbox(null)}
          onIndex={setIgLightbox}
        />
      </section>

      {/* STAY IN THE LOOP */}
      <section id="stay-in-the-loop" className="scroll-mt-24 px-3 pb-24 sm:px-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-4xl bg-ink px-6 py-20 text-ink-foreground sm:px-12 md:py-24">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-pink/35 blur-3xl"
          />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow text-pink">{market.pill}</p>
              <h2 className="mt-4 text-5xl font-semibold leading-[0.95] sm:text-6xl">
                Don&apos;t miss the <span className="font-italic-serif text-pink">next edit.</span>
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-foreground/75">
                {settings.newsletter_note ||
                  "Be the first to hear about future market dates, vendor announcements, special experiences and everything happening at The Faisa Edit."}
              </p>
            </div>
            <NewsletterForm tone="dark" />
          </div>
        </div>
      </section>
    </>
  );
}
