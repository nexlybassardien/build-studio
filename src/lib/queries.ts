import { queryOptions } from "@tanstack/react-query";
import { getFaqs, getMedia, getSiteSettings, getSpotlights } from "./public.functions";

export const settingsQuery = queryOptions({
  queryKey: ["public", "settings"],
  queryFn: () => getSiteSettings(),
  staleTime: 60_000,
});

export const mediaQuery = queryOptions({
  queryKey: ["public", "media"],
  queryFn: () => getMedia(),
  staleTime: 60_000,
});

export const spotlightsQuery = queryOptions({
  queryKey: ["public", "spotlights"],
  queryFn: () => getSpotlights(),
  staleTime: 60_000,
});

export const faqsQuery = queryOptions({
  queryKey: ["public", "faqs"],
  queryFn: () => getFaqs(),
  staleTime: 60_000,
});
