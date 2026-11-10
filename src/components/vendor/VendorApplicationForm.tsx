import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { ZodSchema } from "zod";
import { Button } from "@/components/ui/button";
import { submitVendorApplication } from "@/lib/forms.functions";
import {
  SPACE_TYPES,
  VENDOR_CATEGORIES,
  vendorApplicationSchema,
  vendorStep1,
  vendorStep2,
  vendorStep3,
  vendorStep4,
  vendorStep5,
} from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { ChoiceChip, Field, TextArea, TextInput, YesNo } from "./fields";
import { FileDrop, type UploadedFile } from "./FileDrop";

const STEPS = ["Business details", "Vendor category", "Space requirements", "Brand showcase", "Final details"];

type FormState = {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  instagram: string;
  website: string;
  city: string;
  description: string;
  categories: string[];
  otherCategory: string;
  spaceType: string;
  stallSize: string;
  needsElectricity: boolean;
  needsWater: boolean;
  specialSetup: string;
  equipment: string;
  specialRequirements: string;
  participatedBefore: boolean;
  uniqueness: string;
  motivation: string;
  additionalInfo: string;
  agreedTerms: boolean;
};

type Errors = Partial<Record<keyof FormState, string>>;

const initial: FormState = {
  businessName: "",
  contactPerson: "",
  email: "",
  phone: "",
  instagram: "",
  website: "",
  city: "",
  description: "",
  categories: [],
  otherCategory: "",
  spaceType: "",
  stallSize: "",
  needsElectricity: false,
  needsWater: false,
  specialSetup: "",
  equipment: "",
  specialRequirements: "",
  participatedBefore: false,
  uniqueness: "",
  motivation: "",
  additionalInfo: "",
  agreedTerms: false,
};

export function VendorApplicationForm() {
  const navigate = useNavigate();
  const submit = useServerFn(submitVendorApplication);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [draftId, setDraftId] = useState("");
  const [logo, setLogo] = useState<UploadedFile[]>([]);
  const [products, setProducts] = useState<UploadedFile[]>([]);
  const [docs, setDocs] = useState<UploadedFile[]>([]);

  useEffect(() => setDraftId(crypto.randomUUID()), []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const payload = () => ({
    ...form,
    website: form.website || undefined,
    logoPath: logo[0]?.path,
    productPaths: products.map((p) => p.path),
    documentPaths: docs.map((d) => d.path),
  });

  const validate = (schema: ZodSchema) => {
    const res = schema.safeParse(payload());
    if (res.success) {
      setErrors({});
      return true;
    }
    const errs: Errors = {};
    res.error.issues.forEach((i) => {
      const k = String(i.path[0]) as keyof FormState;
      if (!errs[k]) errs[k] = i.message;
    });
    setErrors(errs);
    return false;
  };

  const stepSchemas = [vendorStep1, vendorStep2, vendorStep3, vendorStep4, vendorStep5];

  const scrollTop = () => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const next = () => {
    const schema = stepSchemas[step];
    if (schema && !validate(schema)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    scrollTop();
  };
  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
    scrollTop();
  };

  const onSubmit = async () => {
    if (!validate(vendorStep5)) return;
    const full = vendorApplicationSchema.safeParse(payload());
    if (!full.success) {
      toast.error("A few details are missing. Please check the earlier steps.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await submit({ data: full.data });
      if (res.ok) {
        navigate({ to: "/application-received", search: { ref: res.reference, name: form.businessName } });
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("We couldn't submit your application. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCategory = (c: string) =>
    set("categories", form.categories.includes(c) ? form.categories.filter((x) => x !== c) : [...form.categories, c]);

  return (
    <div className="rounded-4xl bg-card p-5 shadow-float sm:p-10">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-pink-deep">
            Step {step + 1} of {STEPS.length}
          </p>
          <p className="text-sm font-semibold">{STEPS[step]}</p>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s} className={cn("h-1.5 rounded-full transition-colors duration-500", i <= step ? "bg-primary" : "bg-muted")} />
          ))}
        </div>
      </div>

      <div key={step} className="animate-rise">
        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Business / brand name" error={errors.businessName} htmlFor="businessName">
              <TextInput id="businessName" value={form.businessName} invalid={!!errors.businessName} onChange={(e) => set("businessName", e.target.value)} autoComplete="organization" />
            </Field>
            <Field label="Contact person" error={errors.contactPerson} htmlFor="contactPerson">
              <TextInput id="contactPerson" value={form.contactPerson} invalid={!!errors.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} autoComplete="name" />
            </Field>
            <Field label="Email address" error={errors.email} htmlFor="email">
              <TextInput id="email" type="email" value={form.email} invalid={!!errors.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
            </Field>
            <Field label="WhatsApp / contact number" error={errors.phone} htmlFor="phone">
              <TextInput id="phone" type="tel" inputMode="tel" value={form.phone} invalid={!!errors.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="+27 …" />
            </Field>
            <Field label="Instagram handle" error={errors.instagram} htmlFor="instagram">
              <TextInput id="instagram" value={form.instagram} invalid={!!errors.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@yourbrand" />
            </Field>
            <Field label="Website" optional error={errors.website} htmlFor="website">
              <TextInput id="website" value={form.website} invalid={!!errors.website} onChange={(e) => set("website", e.target.value)} placeholder="yourbrand.co.za" inputMode="url" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="City / location" error={errors.city} htmlFor="city">
                <TextInput id="city" value={form.city} invalid={!!errors.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Cape Town" autoComplete="address-level2" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Short description of your business" error={errors.description} htmlFor="description">
                <TextArea id="description" value={form.description} invalid={!!errors.description} onChange={(e) => set("description", e.target.value)} placeholder="What do you sell or offer? Who is it for?" />
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="mb-4 text-muted-foreground">Select every category that fits your brand.</p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {VENDOR_CATEGORIES.map((c) => (
                <ChoiceChip key={c} selected={form.categories.includes(c)} onClick={() => toggleCategory(c)}>
                  {c}
                </ChoiceChip>
              ))}
            </div>
            {errors.categories && <p className="mt-3 text-xs font-medium text-destructive">{errors.categories}</p>}
            {form.categories.includes("Other") && (
              <div className="mt-5">
                <Field label="Tell us more about your category" optional htmlFor="otherCategory">
                  <TextInput id="otherCategory" value={form.otherCategory} onChange={(e) => set("otherCategory", e.target.value)} />
                </Field>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-7">
            <div>
              <p className="mb-3 font-display text-2xl font-semibold">What kind of space are you interested in?</p>
              <div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup">
                {SPACE_TYPES.map((s) => (
                  <ChoiceChip key={s} role="radio" selected={form.spaceType === s} onClick={() => set("spaceType", s)}>
                    {s}
                  </ChoiceChip>
                ))}
              </div>
              {errors.spaceType && <p className="mt-3 text-xs font-medium text-destructive">{errors.spaceType}</p>}
            </div>
            <Field label="Preferred stall size" optional htmlFor="stallSize">
              <TextInput id="stallSize" value={form.stallSize} onChange={(e) => set("stallSize", e.target.value)} placeholder="e.g. 3m x 3m, if known" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <YesNo label="Will you need electricity?" value={form.needsElectricity} onChange={(v) => set("needsElectricity", v)} />
              <YesNo label="Will you need access to water?" value={form.needsWater} onChange={(v) => set("needsWater", v)} />
            </div>
            <Field label="Do you require any special setup?" optional htmlFor="specialSetup">
              <TextArea id="specialSetup" value={form.specialSetup} onChange={(e) => set("specialSetup", e.target.value)} className="min-h-20" />
            </Field>
            <Field label="What equipment will you bring?" optional htmlFor="equipment">
              <TextArea id="equipment" value={form.equipment} onChange={(e) => set("equipment", e.target.value)} className="min-h-20" placeholder="Gazebo, tables, rails, generator…" />
            </Field>
            <Field label="Any special requirements?" optional htmlFor="specialRequirements">
              <TextArea id="specialRequirements" value={form.specialRequirements} onChange={(e) => set("specialRequirements", e.target.value)} className="min-h-20" />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <p className="text-muted-foreground">
              Help our team get a feel for your brand. Your Instagram{form.website ? " and website" : ""} will also be reviewed.
            </p>
            {draftId && (
              <>
                <FileDrop label="Business logo" hint="PNG, JPG or SVG" draftId={draftId} accept="image/*" max={1} files={logo} onChange={setLogo} imagesOnly />
                <FileDrop label="Product photographs" hint="Up to 10 images of your products or stall" draftId={draftId} accept="image/*" multiple max={10} files={products} onChange={setProducts} imagesOnly />
                <FileDrop
                  label="Brand catalogue, portfolio or supporting documents (optional)"
                  hint="PDF, images or documents, up to 5 files"
                  draftId={draftId}
                  accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
                  multiple
                  max={5}
                  files={docs}
                  onChange={setDocs}
                />
              </>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <YesNo label="Have you participated in a Faisa Edit market before?" value={form.participatedBefore} onChange={(v) => set("participatedBefore", v)} />
            <Field label="What makes your business unique?" error={errors.uniqueness} htmlFor="uniqueness">
              <TextArea id="uniqueness" value={form.uniqueness} invalid={!!errors.uniqueness} onChange={(e) => set("uniqueness", e.target.value)} />
            </Field>
            <Field label="Why would you like to participate?" error={errors.motivation} htmlFor="motivation">
              <TextArea id="motivation" value={form.motivation} invalid={!!errors.motivation} onChange={(e) => set("motivation", e.target.value)} />
            </Field>
            <Field label="Any additional information?" optional htmlFor="additionalInfo">
              <TextArea id="additionalInfo" value={form.additionalInfo} onChange={(e) => set("additionalInfo", e.target.value)} className="min-h-20" />
            </Field>
            <div className="rounded-3xl bg-secondary/70 p-5 text-sm leading-relaxed">
              Applications are subject to review and availability. Submitting an application does not guarantee a stall
              and is not tied to a specific event date. Applications are being collected for future editions.
            </div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.agreedTerms}
                onChange={(e) => set("agreedTerms", e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--pink)]"
                aria-invalid={!!errors.agreedTerms}
              />
              <span className="text-sm">
                I agree to the{" "}
                <Link to="/terms" target="_blank" className="font-semibold text-pink-deep underline">vendor application terms</Link>{" "}
                and{" "}
                <Link to="/privacy" target="_blank" className="font-semibold text-pink-deep underline">privacy policy</Link>.
              </span>
            </label>
            {errors.agreedTerms && <p className="text-xs font-medium text-destructive">{errors.agreedTerms}</p>}
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between gap-3 border-t border-border pt-6">
        <Button type="button" variant="ghost" onClick={back} disabled={step === 0 || submitting}>
          <ArrowLeft /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={next}>
            Continue <ArrowRight />
          </Button>
        ) : (
          <Button type="button" onClick={onSubmit} disabled={submitting} variant="ink" size="lg">
            {submitting && <Loader2 className="animate-spin" />} Submit my application
          </Button>
        )}
      </div>
    </div>
  );
}
