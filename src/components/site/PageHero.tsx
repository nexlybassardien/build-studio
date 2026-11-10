import type { ReactNode } from "react";

/** Editorial page header used by inner pages: full-bleed image with soft scrim. */
export function PageHero({
  eyebrow,
  title,
  italic,
  intro,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  intro?: string;
  image: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full animate-kenburns object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-hero-scrim" />
      <div className="mx-auto w-full max-w-6xl px-5 pb-14 pt-36 sm:px-8 sm:pb-20">
        <p className="eyebrow animate-rise text-ink-foreground/85">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl animate-rise text-5xl font-semibold leading-[0.95] text-ink-foreground text-balance [animation-delay:120ms] sm:text-7xl lg:text-8xl">
          {title} {italic && <span className="font-italic-serif text-blush">{italic}</span>}
        </h1>
        {intro && (
          <p className="mt-6 max-w-xl animate-rise text-base leading-relaxed text-ink-foreground/85 [animation-delay:220ms] sm:text-lg">
            {intro}
          </p>
        )}
        {children && <div className="mt-8 animate-rise [animation-delay:320ms]">{children}</div>}
      </div>
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  italic,
  body,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  italic?: string;
  body?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="eyebrow text-pink-deep">{eyebrow}</p>}
      <h2 className="mt-3 text-4xl font-semibold leading-[1.02] text-balance sm:text-6xl">
        {title} {italic && <span className="font-italic-serif text-pink-deep">{italic}</span>}
      </h2>
      {body && <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{body}</p>}
    </div>
  );
}
