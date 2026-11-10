import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader, Panel } from "@/components/admin/AdminUI";
import { statusStyles } from "@/lib/admin";
import { APPLICATION_STATUSES, MARKET_STATUSES } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

async function count(table: "vendor_applications" | "newsletter_subscribers" | "media_items" | "contact_messages", status?: string) {
  let q = supabase.from(table).select("id", { count: "exact", head: true });
  if (status) q = (q as ReturnType<typeof supabase.from<"vendor_applications">>["select"] extends never ? never : typeof q).eq("status" as never, status as never);
  const { count: c, error } = await q;
  if (error) throw error;
  return c ?? 0;
}

function Overview() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const [total, received, review, approved, waitlisted, subs, media, unread, settings, recent] = await Promise.all([
        count("vendor_applications"),
        count("vendor_applications", "received"),
        count("vendor_applications", "under_review"),
        count("vendor_applications", "approved"),
        count("vendor_applications", "waitlisted"),
        count("newsletter_subscribers"),
        count("media_items"),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false).then((r) => r.count ?? 0),
        supabase.from("site_settings").select("market_status").eq("id", 1).maybeSingle().then((r) => r.data?.market_status ?? "no_date"),
        supabase
          .from("vendor_applications")
          .select("id, reference, business_name, status, created_at, categories")
          .order("created_at", { ascending: false })
          .limit(6)
          .then((r) => r.data ?? []),
      ]);
      return { total, received, review, approved, waitlisted, subs, media, unread, settings, recent };
    },
  });

  if (isLoading || !data) return <Loader2 className="mx-auto mt-20 h-8 w-8 animate-spin text-pink-deep" />;

  const stats = [
    { label: "Total applications", value: data.total, to: "/admin/applications" },
    { label: "New (received)", value: data.received, to: "/admin/applications" },
    { label: "Under review", value: data.review, to: "/admin/applications" },
    { label: "Approved vendors", value: data.approved, to: "/admin/applications" },
    { label: "Waitlisted", value: data.waitlisted, to: "/admin/applications" },
    { label: "Newsletter subscribers", value: data.subs, to: "/admin/inbox" },
    { label: "Gallery items", value: data.media, to: "/admin/media" },
    { label: "Unread messages", value: data.unread, to: "/admin/inbox" },
  ] as const;

  const marketLabel = MARKET_STATUSES.find((m) => m.value === data.settings)?.label;

  return (
    <>
      <AdminHeader title="Hello, team ♡" subtitle="Here's what's happening across The Faisa Edit." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Link key={s.label} to={s.to} className={cn("rounded-3xl p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-float", i === 0 ? "bg-primary" : "bg-card")}>
            <p className="text-sm font-semibold text-foreground/70">{s.label}</p>
            <p className="mt-2 font-display text-5xl font-semibold">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Latest applications</h2>
            <Link to="/admin/applications" className="inline-flex items-center gap-1 text-sm font-bold text-pink-deep">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {data.recent.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No applications yet. They&apos;ll appear here as vendors apply.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {data.recent.map((a) => (
                <li key={a.id}>
                  <Link to="/admin/applications/$id" params={{ id: a.id }} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3 hover:opacity-80">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{a.business_name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {a.reference} · {new Date(a.created_at).toLocaleDateString("en-ZA")} · {a.categories.join(", ")}
                      </p>
                    </div>
                    <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-bold", statusStyles[a.status])}>
                      {APPLICATION_STATUSES.find((s) => s.value === a.status)?.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel className="bg-ink text-ink-foreground">
          <p className="eyebrow text-pink">Market status</p>
          <p className="mt-3 font-display text-3xl font-semibold">{marketLabel}</p>
          <p className="mt-2 text-sm text-ink-foreground/70">This controls the announcement messaging across the website.</p>
          <Link to="/admin/content" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-pink">
            Update status <ArrowRight className="h-4 w-4" />
          </Link>
        </Panel>
      </div>
    </>
  );
}
