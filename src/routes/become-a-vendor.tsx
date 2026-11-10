import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ClipboardList, Eye, MailCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero, SectionIntro } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { VendorApplicationForm } from "@/components/vendor/VendorApplicationForm";
import { brandImages } from "@/lib/brand-media";
import { faqsQuery, settingsQuery } from "@/lib/queries";

export const Route = createFileRoute("/become-a-vendor")({
  head: () => ({
    meta: [
      { title: "Become a Vendor — Apply for a stall at The Faisa Edit" },
      {
        name: "description",
        content:
          "Vendor applications for The Faisa Edit pop-up market: fashion, beauty, food trucks, creatives and small businesses in South Africa can apply for future editions.",
      },
      { property: "og:title", content: "Your brand deserves a spot — The Faisa Edit" },
      { property: "og:description", content: "Apply for a stall, food truck space or activation at a future Faisa Edit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(faqsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]),
  component: BecomeVendor,
});

const howItWorks = [
  { icon: ClipboardList, title: "Apply", body: "Complete the five-step application. It takes about 10 minutes." },
  { icon: Sparkles, title: "Get your reference", body: "You'll receive a unique application reference straight away." },
  { icon: Eye, title: "We review", body: "Our team reviews every application for future editions." },
  { icon: MailCheck, title: "Hear from us", body: "Shortlisted or approved vendors will be contacted with next steps." },
];

function BecomeVendor() {
  const { data: faqs } = useSuspenseQuery(faqsQuery);
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const closed = settings.market_status === "applications_closed";

  return (
    <>
      <PageHero
        eyebrow="Vendor applications"
        title="Your brand deserves"
        italic="a spot."
        intro="Got something worth sharing? We'd love to hear about it. The Faisa Edit welcomes exciting businesses, entrepreneurs, creatives and food concepts interested in being part of future market editions."
        image={brandImages.vendorStall}
      >
        <Button asChild size="lg">
          <a href="#apply">Let&apos;s get you started</a>
        </Button>
      </PageHero>

      <section id="how-it-works" className="scroll-mt-24 mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <Reveal>
          <SectionIntro eyebrow="How it works" title="Four little steps to" italic="your spot." />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((h, i) => (
            <Reveal key={h.title} delay={i * 80}>
              <div className="h-full rounded-3xl bg-gradient-blush p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-card text-pink-deep shadow-soft">
                    <h.icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-4xl italic text-primary">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold">{h.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{h.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="apply" className="scroll-mt-24 bg-gradient-blush py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <div className="mb-8 text-center">
            <p className="eyebrow text-pink-deep">The application</p>
            <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">
              Let&apos;s get you <span className="font-italic-serif text-pink-deep">started.</span>
            </h2>
          </div>
          {closed ? (
            <div className="rounded-4xl bg-card p-10 text-center shadow-float">
              <h3 className="text-3xl font-semibold">Applications are closed for now</h3>
              <p className="mt-3 text-muted-foreground">
                {settings.announcement_body || "Follow us on Instagram or join the mailing list to hear when applications reopen."}
              </p>
            </div>
          ) : (
            <VendorApplicationForm />
          )}
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <Reveal>
          <SectionIntro eyebrow="Vendor FAQs" title="Good" italic="questions." align="center" />
        </Reveal>
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((f) => (
            <AccordionItem key={f.id} value={f.id} className="rounded-3xl border-none bg-card px-6 shadow-soft">
              <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">{f.question}</AccordionTrigger>
              <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
