import type { ReactNode } from "react";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-gradient-blush px-5 pb-24 pt-32 sm:px-8">
      <article className="mx-auto max-w-3xl rounded-4xl bg-card p-7 shadow-soft sm:p-12">
        <p className="eyebrow text-pink-deep">The Faisa Edit</p>
        <h1 className="mt-3 text-5xl font-semibold">{title}</h1>
        <div className="mt-8 space-y-5 text-[0.98rem] leading-relaxed text-muted-foreground [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc">
          {children}
        </div>
      </article>
    </section>
  );
}
