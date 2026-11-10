import { describe, expect, it } from "vitest";
import { getMarketMessage } from "@/components/site/NextEditCard";
import type { PublicSettings } from "@/lib/public.functions";
import { vendorStep5 } from "@/lib/schemas";

const base: PublicSettings = {
  market_status: "no_date",
  announcement_title: null,
  announcement_body: null,
  event_name: null,
  event_date: "2027-03-14",
  event_time: null,
  event_venue: "Somewhere",
  event_published: false,
  contact_email: null,
  whatsapp: null,
  instagram_url: "https://www.instagram.com/thefaisaeditx/",
  newsletter_note: null,
};

describe("market status messaging", () => {
  it("shows coming-soon messaging when no upcoming date is announced", () => {
    const m = getMarketMessage(base);
    expect(m.pill).toBe("The next edit is in the making");
    expect(m.hasEvent).toBe(false);
  });

  it("never shows an event date unless an admin has published it", () => {
    expect(getMarketMessage({ ...base, market_status: "announced" }).hasEvent).toBe(false);
    expect(getMarketMessage({ ...base, market_status: "announced", event_published: true }).hasEvent).toBe(true);
  });
});

describe("vendor application", () => {
  it("requires agreeing to the terms and privacy policy", () => {
    const answers = { participatedBefore: false, uniqueness: "Handmade in small batches", motivation: "Love the community" };
    expect(vendorStep5.safeParse({ ...answers, agreedTerms: false }).success).toBe(false);
    expect(vendorStep5.safeParse({ ...answers, agreedTerms: true }).success).toBe(true);
  });
});
