import { z } from "zod";

export const VENDOR_CATEGORIES = [
  "Fashion and Clothing",
  "Beauty and Skincare",
  "Accessories and Jewellery",
  "Food and Snacks",
  "Drinks and Beverages",
  "Desserts and Baked Goods",
  "Food Truck",
  "Lifestyle and Homeware",
  "Art and Handmade Products",
  "Children's Products",
  "Services",
  "Other",
] as const;

export const SPACE_TYPES = [
  "Standard vendor stall",
  "Premium / larger stall",
  "Food truck space",
  "Outdoor activation",
  "Brand activation / experience",
  "Other / Not sure yet",
] as const;

export const APPLICATION_STATUSES = [
  { value: "received", label: "Received" },
  { value: "under_review", label: "Under Review" },
  { value: "approved", label: "Approved" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "declined", label: "Declined" },
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]["value"];

export const MARKET_STATUSES = [
  { value: "no_date", label: "No upcoming date announced" },
  { value: "announced", label: "Upcoming market announced" },
  { value: "applications_open", label: "Applications open" },
  { value: "applications_closed", label: "Applications closed" },
  { value: "completed", label: "Event completed" },
] as const;
export type MarketStatus = (typeof MARKET_STATUSES)[number]["value"];

export const ENQUIRY_TYPES = [
  "General enquiry",
  "Vendor enquiry",
  "Collaboration",
  "Brand partnership",
] as const;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const newsletterSchema = z.object({
  firstName: z.string().trim().min(1, "Please tell us your first name").max(80),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address").max(255),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please tell us your name").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  enquiryType: z.enum(ENQUIRY_TYPES),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(3000),
});

const storagePath = z
  .string()
  .max(500)
  .regex(/^applications\/[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+$/, "Invalid file reference");

export const vendorStep1 = z.object({
  businessName: z.string().trim().min(1, "Business / brand name is required").max(150),
  contactPerson: z.string().trim().min(1, "Contact person is required").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid contact number")
    .max(30)
    .regex(/^[+()\d\s-]+$/, "Numbers, spaces, + and - only"),
  instagram: z.string().trim().min(2, "Instagram handle is required").max(100),
  website: z
    .string()
    .trim()
    .max(255)
    .optional()
    .refine((v) => !v || /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(v), "Please enter a valid website"),
  city: z.string().trim().min(1, "City / location is required").max(120),
  description: z.string().trim().min(20, "Tell us a bit more (20+ characters)").max(1500),
});

export const vendorStep2 = z.object({
  categories: z.array(z.enum(VENDOR_CATEGORIES)).min(1, "Choose at least one category"),
  otherCategory: optionalText(150),
});

export const vendorStep3 = z.object({
  spaceType: z.enum(SPACE_TYPES, { errorMap: () => ({ message: "Choose a space type" }) }),
  stallSize: optionalText(100),
  needsElectricity: z.boolean(),
  needsWater: z.boolean(),
  specialSetup: optionalText(1000),
  equipment: optionalText(1000),
  specialRequirements: optionalText(1500),
});

export const vendorStep4 = z.object({
  logoPath: storagePath.optional(),
  productPaths: z.array(storagePath).max(10),
  documentPaths: z.array(storagePath).max(5),
});

export const vendorStep5 = z.object({
  participatedBefore: z.boolean(),
  uniqueness: z.string().trim().min(10, "Tell us what makes you unique (10+ characters)").max(1500),
  motivation: z.string().trim().min(10, "Tell us why you'd like to join (10+ characters)").max(1500),
  additionalInfo: optionalText(1500),
  agreedTerms: z.literal(true, { errorMap: () => ({ message: "Please accept the terms and privacy policy" }) }),
});

export const vendorApplicationSchema = vendorStep1
  .merge(vendorStep2)
  .merge(vendorStep3)
  .merge(vendorStep4)
  .merge(vendorStep5);

export type VendorApplicationInput = z.input<typeof vendorApplicationSchema>;
