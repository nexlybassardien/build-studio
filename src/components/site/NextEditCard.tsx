import { Link } from "@tanstack/react-router";
import { CalendarDays, Instagram, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicSettings } from "@/lib/public.functions";
import { cn } from "@/lib/utils";

/** Status-driven copy. Only shows a real date when an admin has entered and published one. */
export function getMarketMessage(s: PublicSettings) {
  const hasEvent = s.event_published && !!s.event_date;
  const dateLabel = hasEvent
    ? new Date(s.event_date! + "T00:00:00").toLocaleDateString("en-ZA", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  switch (s.market_status) {
    case "announced":
      return {
        pill: hasEvent ? `The next edit · ${dateLabel}` : "The next edit has been announced",
        title: s.announcement_title || s.event_name || "The next edit is coming",
        body: s.announcement_body || "Save the date and stay tuned for all the details.",
        hasEvent,
        dateLabel,
      };
    case "applications_open":
      return {
        pill: "Vendor applications are open",
        title: s.announcement_title || "Vendor applications are open",
        body: s.announcement_body || "Got a brand worth sharing? Apply for a spot at a future edition.",
        hasEvent,
        dateLabel,
      };
    case "applications_closed":
      return {
        pill: "Vendor applications are closed",
        title: s.announcement_title || "Applications are closed for now",
        body: s.announcement_body || "Thank you to everyone who applied. Stay in the loop for what's next.",
        hasEvent,
        dateLabel,
      };
    case "completed":
      return {
        pill: "Thank you for an incredible edit",
        title: s.announcement_title || "That's a wrap!",
        body: s.announcement_body || "Thank you for showing up. We're already dreaming up what's next.",
        hasEvent: false,
        dateLabel: null,
      };
    default:
      return {
        pill: "The next edit is in the making",
        title: s.announcement_title || "The next edit",
        body:
          s.announcement_body ||
          "We're working behind the scenes on what's next. Join our mailing list or follow us on Instagram to be the first to know.",
        hasEvent: false,
        dateLabel: null,
      };
  }
}

export function NextEditCard({ settings, className }: { settings: PublicSettings; className?: string }) {
  const m = getMarketMessage(settings);
  return (
    <div className={cn("relative overflow-hidden rounded-4xl bg-ink p-8 text-ink-foreground shadow-float sm:p-12", className)}>
      <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-pink/40 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full bg-ink-foreground/10 px-3.5 py-1.5 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-pink" /> {m.pill}
        </span>
        <h3 className="mt-6 text-4xl font-semibold uppercase tracking-tight sm:text-6xl">{m.title}</h3>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-foreground/75 sm:text-lg">{m.body}</p>

        {m.hasEvent && (
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-ink-foreground/10 px-4 py-2">
              <CalendarDays className="h-4 w-4 text-pink" /> {m.dateLabel}
              {settings.event_time ? ` · ${settings.event_time}` : ""}
            </span>
            {settings.event_venue && (
              <span className="inline-flex items-center gap-2 rounded-full bg-ink-foreground/10 px-4 py-2">
                <MapPin className="h-4 w-4 text-pink" /> {settings.event_venue}
              </span>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/" hash="stay-in-the-loop">Join the mailing list</Link>
          </Button>
          <Button asChild variant="glass">
            <a href={settings.instagram_url} target="_blank" rel="noreferrer">
              <Instagram /> Follow on Instagram
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
