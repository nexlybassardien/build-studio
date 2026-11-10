import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { Check, Handshake, Instagram, Loader2, Mail, MessageCircle, Sparkles, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, TextArea, TextInput, ChoiceChip } from "@/components/vendor/fields";
import { Reveal } from "@/components/site/Reveal";
import { submitContact } from "@/lib/forms.functions";
import { contactSchema, ENQUIRY_TYPES } from "@/lib/schemas";
import { settingsQuery } from "@/lib/queries";
import { brandImages } from "@/lib/brand-media";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact The Faisa Edit — Enquiries, vendors & partnerships" },
      {
        name: "description",
        content: "Get in touch with The Faisa Edit for general enquiries, vendor questions, collaborations and brand partnerships.",
      },
      { property: "og:title", content: "Contact The Faisa Edit" },
      { property: "og:description", content: "Say hello: enquiries, vendors, collaborations and brand partnerships." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: Contact,
});

const icons = [Sparkles, Store, Handshake, MessageCircle];
type ContactKey = "name" | "email" | "enquiryType" | "message";

function Contact() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const send = useServerFn(submitContact);
  const [form, setForm] = useState({ name: "", email: "", enquiryType: "General enquiry" as (typeof ENQUIRY_TYPES)[number], message: "" });
  const [errors, setErrors] = useState<Partial<Record<ContactKey, string>>>({});
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<ContactKey, string>> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0]) as ContactKey] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("loading");
    try {
      const res = await send({ data: parsed.data });
      if (res.ok) setState("done");
      else {
        setState("error");
        setErrMsg(res.error);
      }
    } catch {
      setState("error");
      setErrMsg("Your message didn't send. Please try again.");
    }
  };

  const whatsappHref = settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^\d]/g, "")}` : null;

  return (
    <section className="relative bg-gradient-blush px-5 pb-24 pt-32 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.15fr]">
        <Reveal>
          <p className="eyebrow text-pink-deep">Contact</p>
          <h1 className="mt-3 text-6xl font-semibold leading-[0.95] sm:text-7xl">
            Say <span className="font-italic-serif text-pink-deep">hello.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">
            Questions, ideas, collaborations or just want to share some love? We&apos;d love to hear from you.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {ENQUIRY_TYPES.map((t, i) => {
              const Icon = icons[i] ?? Sparkles;
              return (
                <div key={t} className="rounded-3xl bg-card p-5 shadow-soft">
                  <Icon className="h-5 w-5 text-pink-deep" />
                  <p className="mt-3 text-sm font-semibold">{t}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 space-y-3">
            <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft transition-colors hover:bg-secondary">
              <Instagram className="h-5 w-5 shrink-0 text-pink-deep" />
              <span className="font-semibold">@thefaisaeditx</span>
            </a>
            {settings.contact_email && (
              <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft transition-colors hover:bg-secondary">
                <Mail className="h-5 w-5 shrink-0 text-pink-deep" />
                <span className="min-w-0 truncate font-semibold">{settings.contact_email}</span>
              </a>
            )}
            {whatsappHref && (
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-soft transition-colors hover:bg-secondary">
                <MessageCircle className="h-5 w-5 shrink-0 text-pink-deep" />
                <span className="font-semibold">WhatsApp us</span>
              </a>
            )}
          </div>
          <img src={brandImages.connect} alt="" loading="lazy" className="mt-8 hidden aspect-[16/10] w-full rounded-4xl object-cover shadow-float lg:block" />
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-4xl bg-card p-6 shadow-float sm:p-10">
            {state === "done" ? (
              <div role="status" className="animate-rise py-10 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-6 w-6" />
                </span>
                <h2 className="mt-5 text-4xl font-semibold">Message received!</h2>
                <p className="mt-3 text-muted-foreground">Thanks, {form.name}. Our team will get back to you soon.</p>
                <Button
                  className="mt-6"
                  variant="outline"
                  onClick={() => {
                    setForm({ name: "", email: "", enquiryType: "General enquiry", message: "" });
                    setState("idle");
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <h2 className="text-3xl font-semibold">Send us a message</h2>
                <div>
                  <p className="mb-2 text-sm font-semibold">What&apos;s it about?</p>
                  <div className="grid gap-2 sm:grid-cols-2" role="radiogroup">
                    {ENQUIRY_TYPES.map((t) => (
                      <ChoiceChip key={t} role="radio" selected={form.enquiryType === t} onClick={() => setForm((f) => ({ ...f, enquiryType: t }))}>
                        {t}
                      </ChoiceChip>
                    ))}
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your name" error={errors.name} htmlFor="c-name">
                    <TextInput id="c-name" autoComplete="name" value={form.name} invalid={!!errors.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  </Field>
                  <Field label="Email address" error={errors.email} htmlFor="c-email">
                    <TextInput id="c-email" type="email" autoComplete="email" value={form.email} invalid={!!errors.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                  </Field>
                </div>
                <Field label="Message" error={errors.message} htmlFor="c-message">
                  <TextArea id="c-message" className="min-h-40" value={form.message} invalid={!!errors.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
                </Field>
                <Button type="submit" size="lg" disabled={state === "loading"} className="w-full sm:w-auto">
                  {state === "loading" && <Loader2 className="animate-spin" />} Send message
                </Button>
                {state === "error" && <p role="alert" className="text-sm font-medium text-destructive">{errMsg}</p>}
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
