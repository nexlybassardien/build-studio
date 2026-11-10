import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:flex sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-3xl bg-card p-5 shadow-soft sm:p-6", className)}>{children}</div>;
}

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-border bg-card/60 p-10 text-center">
      <p className="font-display text-2xl font-semibold">{title}</p>
      {body && <p className="mt-2 text-sm text-muted-foreground">{body}</p>}
    </div>
  );
}

export const selectClass =
  "h-11 rounded-2xl border border-input bg-card px-3 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-ring/40";
