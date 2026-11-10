import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INSTAGRAM_URL, brandImages } from "@/lib/brand-media";

type Search = { ref?: string; name?: string };

export const Route = createFileRoute("/application-received")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    ref: typeof s.ref === "string" ? s.ref.slice(0, 20) : undefined,
    name: typeof s.name === "string" ? s.name.slice(0, 150) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Application received — The Faisa Edit" },
      { name: "description", content: "Thank you for applying to The Faisa Edit. Our team will review your application." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Application received — The Faisa Edit" },
      { property: "og:description", content: "You're officially on our radar!" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Received,
});

function Received() {
  const { ref, name } = Route.useSearch();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!ref) return;
    await navigator.clipboard.writeText(ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-gradient-blush px-5 pb-20 pt-32">
      <img src={brandImages.experience} alt="" aria-hidden className="absolute -right-20 top-24 -z-10 hidden w-80 rotate-6 rounded-4xl opacity-90 shadow-float lg:block" />
      <img src={brandImages.desserts} alt="" aria-hidden className="absolute -left-16 bottom-16 -z-10 hidden w-64 -rotate-6 rounded-4xl shadow-float lg:block" />
      <div className="mx-auto w-full max-w-2xl animate-rise rounded-4xl bg-card p-8 text-center shadow-float sm:p-14">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-pink">
          <Check className="h-7 w-7" />
        </span>
        <h1 className="mt-6 text-5xl font-semibold leading-[0.98] sm:text-6xl">
          You&apos;re officially <span className="font-italic-serif text-pink-deep">on our radar!</span>
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Thank you for applying to The Faisa Edit{name ? `, ${name}` : ""}. Our team has received your application and
          will review your details. Keep an eye on your inbox for updates.
        </p>

        {ref && (
          <div className="mx-auto mt-8 max-w-sm rounded-3xl bg-secondary p-5">
            <p className="eyebrow text-pink-deep">Your application reference</p>
            <div className="mt-2 flex items-center justify-center gap-3">
              <p className="font-mono text-3xl font-bold tracking-wider">{ref}</p>
              <button type="button" onClick={copy} aria-label="Copy reference" className="grid h-10 w-10 place-items-center rounded-full bg-card shadow-soft">
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Save this for any future correspondence.</p>
          </div>
        )}

        <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
          Please note: applications are subject to review and availability. Submitting an application does not guarantee
          a stall, and applications are being collected for future editions.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              <Instagram /> Follow @thefaisaeditx
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
