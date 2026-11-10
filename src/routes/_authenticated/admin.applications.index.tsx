import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Download, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminHeader, EmptyState, Panel, selectClass } from "@/components/admin/AdminUI";
import { supabase } from "@/integrations/supabase/client";
import { downloadCsv, statusStyles } from "@/lib/admin";
import { APPLICATION_STATUSES, VENDOR_CATEGORIES } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/applications/")({
  component: Applications,
});

function Applications() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const { data = [], isLoading, error } = useQuery({
    queryKey: ["admin", "applications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vendor_applications").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(
    () =>
      data.filter(
        (a) =>
          (!search || a.business_name.toLowerCase().includes(search.toLowerCase()) || a.reference.toLowerCase().includes(search.toLowerCase())) &&
          (!category || a.categories.includes(category)) &&
          (!status || a.status === status),
      ),
    [data, search, category, status],
  );

  const exportCsv = () =>
    downloadCsv(
      `faisa-edit-applications-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((a) => ({
        reference: a.reference,
        submitted: a.created_at,
        status: a.status,
        business_name: a.business_name,
        contact_person: a.contact_person,
        email: a.email,
        phone: a.phone,
        instagram: a.instagram,
        website: a.website,
        city: a.city,
        categories: a.categories,
        space_type: a.space_type,
        stall_size: a.stall_size,
        needs_electricity: a.needs_electricity ? "Yes" : "No",
        needs_water: a.needs_water ? "Yes" : "No",
        participated_before: a.participated_before ? "Yes" : "No",
        description: a.description,
        uniqueness: a.uniqueness,
        motivation: a.motivation,
        internal_notes: a.internal_notes,
      })),
    );

  return (
    <>
      <AdminHeader
        title="Applications"
        subtitle={`${data.length} total · ${filtered.length} showing`}
        actions={
          <Button variant="outline" onClick={exportCsv} disabled={!filtered.length}>
            <Download /> Export CSV
          </Button>
        }
      />
      <Panel className="mb-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <span className="sr-only">Search by business name</span>
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search business name or reference"
              className={cn(selectClass, "w-full pl-10")}
            />
          </label>
          <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
            <option value="">All categories</option>
            {VENDOR_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </Panel>

      {isLoading ? (
        <Loader2 className="mx-auto mt-12 h-8 w-8 animate-spin text-pink-deep" />
      ) : error ? (
        <EmptyState title="Couldn't load applications" body="Please refresh the page." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No applications found" body={data.length ? "Try changing your filters." : "Applications will appear here as vendors apply."} />
      ) : (
        <div className="overflow-hidden rounded-3xl bg-card shadow-soft">
          <ul className="divide-y divide-border">
            {filtered.map((a) => (
              <li key={a.id}>
                <Link
                  to="/admin/applications/$id"
                  params={{ id: a.id }}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{a.business_name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {a.reference} · {a.contact_person} · {a.city} · {new Date(a.created_at).toLocaleDateString("en-ZA")}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{a.categories.join(" · ")}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-bold", statusStyles[a.status])}>
                    {APPLICATION_STATUSES.find((s) => s.value === a.status)?.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
