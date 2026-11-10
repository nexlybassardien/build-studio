import { createServerFn } from "@tanstack/react-start";
import { contactSchema, newsletterSchema, vendorApplicationSchema } from "./schemas";

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => newsletterSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({ first_name: data.firstName, email: data.email });
    if (error) {
      if (error.code === "23505") return { ok: true as const, already: true };
      console.error("newsletter insert failed", error);
      return { ok: false as const, error: "We couldn't add you right now. Please try again." };
    }
    return { ok: true as const, already: false };
  });

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      enquiry_type: data.enquiryType,
      message: data.message,
    });
    if (error) {
      console.error("contact insert failed", error);
      return { ok: false as const, error: "Your message didn't send. Please try again." };
    }
    return { ok: true as const };
  });

export const submitVendorApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => vendorApplicationSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const row = {
      business_name: data.businessName,
      contact_person: data.contactPerson,
      email: data.email,
      phone: data.phone,
      instagram: data.instagram,
      website: data.website || null,
      city: data.city,
      description: data.description,
      categories: data.categories,
      other_category: data.otherCategory ?? null,
      space_type: data.spaceType,
      stall_size: data.stallSize ?? null,
      needs_electricity: data.needsElectricity,
      needs_water: data.needsWater,
      special_setup: data.specialSetup ?? null,
      equipment: data.equipment ?? null,
      special_requirements: data.specialRequirements ?? null,
      logo_path: data.logoPath ?? null,
      product_paths: data.productPaths,
      document_paths: data.documentPaths,
      participated_before: data.participatedBefore,
      uniqueness: data.uniqueness,
      motivation: data.motivation,
      additional_info: data.additionalInfo ?? null,
      agreed_terms: data.agreedTerms,
    };
    // Retry once on the rare reference collision.
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data: inserted, error } = await supabaseAdmin
        .from("vendor_applications")
        .insert(row)
        .select("reference")
        .single();
      if (!error && inserted) return { ok: true as const, reference: inserted.reference };
      if (error?.code !== "23505") {
        console.error("vendor application insert failed", error);
        break;
      }
    }
    return { ok: false as const, error: "We couldn't submit your application. Please try again." };
  });
