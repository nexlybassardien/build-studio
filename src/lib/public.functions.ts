import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export type PublicSettings = {
  market_status: string;
  announcement_title: string | null;
  announcement_body: string | null;
  event_name: string | null;
  event_date: string | null;
  event_time: string | null;
  event_venue: string | null;
  event_published: boolean;
  contact_email: string | null;
  whatsapp: string | null;
  instagram_url: string;
  newsletter_note: string | null;
};

const DEFAULT_SETTINGS: PublicSettings = {
  market_status: "no_date",
  announcement_title: null,
  announcement_body: null,
  event_name: null,
  event_date: null,
  event_time: null,
  event_venue: null,
  event_published: false,
  contact_email: null,
  whatsapp: null,
  instagram_url: "https://www.instagram.com/thefaisaeditx/",
  newsletter_note: null,
};

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async (): Promise<PublicSettings> => {
  try {
    const { data, error } = await publicClient()
      .from("site_settings")
      .select(
        "market_status, announcement_title, announcement_body, event_name, event_date, event_time, event_venue, event_published, contact_email, whatsapp, instagram_url, newsletter_note",
      )
      .eq("id", 1)
      .maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    return data;
  } catch (e) {
    console.error("getSiteSettings failed", e);
    return DEFAULT_SETTINGS;
  }
});

export type PublicMedia = {
  id: string;
  media_type: "image" | "video";
  url: string;
  poster_url: string | null;
  caption: string | null;
  category: string | null;
  featured: boolean;
};

export const getMedia = createServerFn({ method: "GET" }).handler(async (): Promise<PublicMedia[]> => {
  try {
    const { data, error } = await publicClient()
      .from("media_items")
      .select("id, media_type, url, poster_url, caption, category, featured")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as PublicMedia[];
  } catch (e) {
    console.error("getMedia failed", e);
    return [];
  }
});

export type PublicSpotlight = {
  id: string;
  brand_name: string;
  description: string | null;
  instagram: string | null;
  logo_url: string | null;
  image_url: string | null;
};

export const getSpotlights = createServerFn({ method: "GET" }).handler(async (): Promise<PublicSpotlight[]> => {
  try {
    const { data, error } = await publicClient()
      .from("vendor_spotlights")
      .select("id, brand_name, description, instagram, logo_url, image_url")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data;
  } catch (e) {
    console.error("getSpotlights failed", e);
    return [];
  }
});

export type PublicFaq = { id: string; question: string; answer: string };

export const getFaqs = createServerFn({ method: "GET" }).handler(async (): Promise<PublicFaq[]> => {
  try {
    const { data, error } = await publicClient()
      .from("faqs")
      .select("id, question, answer")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data;
  } catch (e) {
    console.error("getFaqs failed", e);
    return [];
  }
});
