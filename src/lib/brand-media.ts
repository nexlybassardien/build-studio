import hero from "@/assets/hero-market.jpg";
import shop from "@/assets/shop.jpg";
import eat from "@/assets/eat.jpg";
import discover from "@/assets/discover.jpg";
import connect from "@/assets/connect.jpg";
import experience from "@/assets/experience.jpg";
import vendorStall from "@/assets/vendor-stall.jpg";
import beauty from "@/assets/beauty.jpg";
import desserts from "@/assets/desserts.jpg";
import crowdNight from "@/assets/crowd-night.jpg";
import logo from "@/assets/faisa-edit-logo.png.asset.json";

export const brandImages = {
  hero,
  shop,
  eat,
  discover,
  connect,
  experience,
  vendorStall,
  beauty,
  desserts,
  crowdNight,
  logo: logo.url,
};

export const INSTAGRAM_URL = "https://www.instagram.com/thefaisaeditx/";
export const INSTAGRAM_HANDLE = "@thefaisaeditx";

export type GalleryItem = {
  id: string;
  media_type: "image" | "video";
  url: string;
  poster_url: string | null;
  caption: string | null;
  category: string | null;
};

/** Mood imagery shown until the team uploads real market media in the admin Media Manager. */
export const fallbackGallery: GalleryItem[] = [
  { id: "f1", media_type: "image", url: hero, poster_url: null, caption: null, category: "Atmosphere" },
  { id: "f2", media_type: "image", url: shop, poster_url: null, caption: null, category: "Fashion" },
  { id: "f3", media_type: "image", url: desserts, poster_url: null, caption: null, category: "Food" },
  { id: "f4", media_type: "image", url: experience, poster_url: null, caption: null, category: "Installations" },
  { id: "f5", media_type: "image", url: vendorStall, poster_url: null, caption: null, category: "Vendors" },
  { id: "f6", media_type: "image", url: beauty, poster_url: null, caption: null, category: "Beauty" },
  { id: "f7", media_type: "image", url: eat, poster_url: null, caption: null, category: "Food trucks" },
  { id: "f8", media_type: "image", url: connect, poster_url: null, caption: null, category: "Community" },
  { id: "f9", media_type: "image", url: discover, poster_url: null, caption: null, category: "Finds" },
  { id: "f10", media_type: "image", url: crowdNight, poster_url: null, caption: null, category: "Crowd" },
];
