import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Download, Loader2, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminHeader, EmptyState, Panel } from "@/components/admin/AdminUI";
import { supabase } from "@/integrations/supabase/client";
import { downloadCsv } from "@/lib/admin";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/inbox")({
  component: Inbox,
});

function Inbox() {
  const [tab, setTab] = useState<"messages" | "subscribers">("messages");
  return (
    <>
      <AdminHeader title="Messages & Subscribers" subtitle="Contact form enquiries and your mailing list." />
      <div className="mb-6 inline-flex rounded-full bg-card p-1 shadow-soft" role="tablist">
        {(["messages", "subscribers"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn("h-10 rounded-full px-5 text-sm font-semibold capitalize", tab === t ? "bg-ink text-ink-foreground" : "text-muted-foreground")}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "messages" ? <Messages /> : <Subscribers />}
    </>
  );
}

function Messages() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin"] });

  if (isLoading) return <Loader2 className="mx-auto mt-12 h-8 w-8 animate-spin text-pink-deep" />;
  if (!data.length) return <EmptyState title="No messages yet" body="Messages from the Contact page will appear here." />;

  return (
    <div className="space-y-3">
      {data.map((m) => (
        <Panel key={m.id} className={cn(!m.is_read && "ring-2 ring-primary")}>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold">
                {m.name} <span className="font-normal text-muted-foreground">· {m.enquiry_type}</span>
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {m.email} · {new Date(m.created_at).toLocaleString("en-ZA")}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button size="sm" variant="ghost" asChild>
                <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.enquiry_type)}`}><Mail /> Reply</a>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  await supabase.from("contact_messages").update({ is_read: !m.is_read }).eq("id", m.id);
                  refresh();
                }}
              >
                {m.is_read ? "Mark unread" : "Mark read"}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                aria-label="Delete"
                onClick={async () => {
                  if (!confirm("Delete this message?")) return;
                  await supabase.from("contact_messages").delete().eq("id", m.id);
                  toast.success("Deleted");
                  refresh();
                }}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{m.message}</p>
        </Panel>
      ))}
    </div>
  );
}

function Subscribers() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <Loader2 className="mx-auto mt-12 h-8 w-8 animate-spin text-pink-deep" />;

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold">{data.length} subscribers</p>
        <Button
          variant="outline"
          disabled={!data.length}
          onClick={() =>
            downloadCsv(
              `faisa-edit-subscribers-${new Date().toISOString().slice(0, 10)}.csv`,
              data.map((s) => ({ first_name: s.first_name, email: s.email, subscribed: s.created_at })),
            )
          }
        >
          <Download /> Export CSV
        </Button>
      </div>
      {!data.length ? (
        <EmptyState title="No subscribers yet" body="People who join the mailing list will appear here." />
      ) : (
        <div className="overflow-hidden rounded-3xl bg-card shadow-soft">
          <ul className="divide-y divide-border">
            {data.map((s) => (
              <li key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{s.first_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.email} · {new Date(s.created_at).toLocaleDateString("en-ZA")}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive"
                  aria-label={`Remove ${s.email}`}
                  onClick={async () => {
                    if (!confirm(`Remove ${s.email} from the list?`)) return;
                    await supabase.from("newsletter_subscribers").delete().eq("id", s.id);
                    qc.invalidateQueries({ queryKey: ["admin"] });
                  }}
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
