import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminHeader, Panel } from "@/components/admin/AdminUI";
import { ChoiceChip, Field, TextArea, TextInput } from "@/components/vendor/fields";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { MARKET_STATUSES } from "@/lib/schemas";

type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: Content,
});

function Content() {
  const qc = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (error) throw error;
      return data;
    },
  });
  const [s, setS] = useState<Settings | null>(null);
  useEffect(() => {
    if (settings) setS(settings);
  }, [settings]);

  const save = useMutation({
    mutationFn: async (values: Settings) => {
      const { id: _id, updated_at: _u, ...rest } = values;
      const { error } = await supabase.from("site_settings").update(rest).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Website content updated");
      qc.invalidateQueries({ queryKey: ["admin"] });
      qc.invalidateQueries({ queryKey: ["public"] });
    },
    onError: () => toast.error("Couldn't save"),
  });

  if (!s) return <Loader2 className="mx-auto mt-20 h-8 w-8 animate-spin text-pink-deep" />;
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS({ ...s, [k]: v });
  const str = (v: string) => (v.trim() ? v : null);

  return (
    <>
      <AdminHeader
        title="Website Content"
        subtitle="Market status, announcements, event details and contact information."
        actions={
          <Button onClick={() => save.mutate(s)} disabled={save.isPending}>
            {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save changes
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="lg:col-span-2">
          <h2 className="text-xl font-semibold">Market status</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            &ldquo;No upcoming date announced&rdquo; shows coming-soon messaging everywhere. Event dates only appear once you enter them and switch on &ldquo;Publish event details&rdquo;.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5" role="radiogroup">
            {MARKET_STATUSES.map((m) => (
              <ChoiceChip key={m.value} role="radio" selected={s.market_status === m.value} onClick={() => set("market_status", m.value)}>
                {m.label}
              </ChoiceChip>
            ))}
          </div>
        </Panel>

        <Panel>
          <h2 className="text-xl font-semibold">Homepage announcement</h2>
          <p className="mt-1 text-sm text-muted-foreground">Leave blank to use the default wording for the selected status.</p>
          <div className="mt-4 space-y-4">
            <Field label="Announcement title" optional htmlFor="ann-t">
              <TextInput id="ann-t" value={s.announcement_title ?? ""} onChange={(e) => set("announcement_title", str(e.target.value))} />
            </Field>
            <Field label="Announcement text" optional htmlFor="ann-b">
              <TextArea id="ann-b" value={s.announcement_body ?? ""} onChange={(e) => set("announcement_body", str(e.target.value))} />
            </Field>
            <Field label="Newsletter section message" optional htmlFor="nl-n">
              <TextArea id="nl-n" value={s.newsletter_note ?? ""} onChange={(e) => set("newsletter_note", str(e.target.value))} />
            </Field>
          </div>
        </Panel>

        <Panel>
          <h2 className="text-xl font-semibold">Upcoming event</h2>
          <div className="mt-4 space-y-4">
            <Field label="Event name" optional htmlFor="ev-n">
              <TextInput id="ev-n" value={s.event_name ?? ""} onChange={(e) => set("event_name", str(e.target.value))} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date" optional htmlFor="ev-d">
                <TextInput id="ev-d" type="date" value={s.event_date ?? ""} onChange={(e) => set("event_date", e.target.value || null)} />
              </Field>
              <Field label="Time" optional htmlFor="ev-t">
                <TextInput id="ev-t" value={s.event_time ?? ""} placeholder="10:00 – 17:00" onChange={(e) => set("event_time", str(e.target.value))} />
              </Field>
            </div>
            <Field label="Venue" optional htmlFor="ev-v">
              <TextInput id="ev-v" value={s.event_venue ?? ""} onChange={(e) => set("event_venue", str(e.target.value))} />
            </Field>
            <label className="flex items-center gap-3 rounded-2xl bg-secondary p-4 text-sm font-semibold">
              <input type="checkbox" checked={s.event_published} onChange={(e) => set("event_published", e.target.checked)} className="h-5 w-5 accent-[var(--pink)]" />
              Publish event details on the website
            </label>
          </div>
        </Panel>

        <Panel className="lg:col-span-2">
          <h2 className="text-xl font-semibold">Contact details</h2>
          <p className="mt-1 text-sm text-muted-foreground">These only appear on the Contact page once filled in.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field label="Email address" optional htmlFor="c-e">
              <TextInput id="c-e" type="email" value={s.contact_email ?? ""} onChange={(e) => set("contact_email", str(e.target.value))} />
            </Field>
            <Field label="WhatsApp number" optional htmlFor="c-w">
              <TextInput id="c-w" value={s.whatsapp ?? ""} placeholder="+27 …" onChange={(e) => set("whatsapp", str(e.target.value))} />
            </Field>
            <Field label="Instagram URL" htmlFor="c-i">
              <TextInput id="c-i" value={s.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} />
            </Field>
          </div>
        </Panel>
      </div>

      <FaqManager />
    </>
  );
}

function FaqManager() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
    qc.invalidateQueries({ queryKey: ["public"] });
  };
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  const add = async () => {
    if (!q.trim() || !a.trim()) return toast.error("Add both a question and an answer");
    const { error } = await supabase.from("faqs").insert({ question: q.trim(), answer: a.trim(), sort_order: data.length + 1 });
    if (error) return toast.error("Couldn't add FAQ");
    setQ("");
    setA("");
    toast.success("FAQ added");
    refresh();
  };

  const update = async (id: string, values: { question?: string; answer?: string; sort_order?: number }) => {
    const { error } = await supabase.from("faqs").update(values).eq("id", id);
    if (error) toast.error("Couldn't save FAQ");
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    await supabase.from("faqs").delete().eq("id", id);
    refresh();
  };

  const move = async (i: number, d: -1 | 1) => {
    const x = data[i];
    const y = data[i + d];
    if (!x || !y) return;
    await Promise.all([update(x.id, { sort_order: i + d + 1 }), update(y.id, { sort_order: i + 1 })]);
  };

  return (
    <Panel className="mt-4">
      <h2 className="text-xl font-semibold">Vendor FAQs</h2>
      <p className="mt-1 text-sm text-muted-foreground">Shown on the Become a Vendor page. Edits save when you click away.</p>
      <div className="mt-4 space-y-3">
        {data.map((f, i) => (
          <div key={f.id} className="rounded-2xl border border-border p-4">
            <div className="flex gap-2">
              <input
                defaultValue={f.question}
                onBlur={(e) => e.target.value !== f.question && update(f.id, { question: e.target.value })}
                className="h-10 min-w-0 flex-1 rounded-xl border border-input bg-card px-3 text-sm font-semibold outline-none focus:border-primary"
                aria-label="Question"
              />
              <Button size="icon" variant="ghost" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp /></Button>
              <Button size="icon" variant="ghost" disabled={i === data.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown /></Button>
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(f.id)} aria-label="Delete"><Trash2 /></Button>
            </div>
            <textarea
              defaultValue={f.answer}
              onBlur={(e) => e.target.value !== f.answer && update(f.id, { answer: e.target.value })}
              className="mt-2 min-h-20 w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:border-primary"
              aria-label="Answer"
            />
          </div>
        ))}
        <div className="rounded-2xl bg-secondary/60 p-4">
          <p className="text-sm font-semibold">Add a new FAQ</p>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Question" className="mt-2 h-10 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:border-primary" />
          <textarea value={a} onChange={(e) => setA(e.target.value)} placeholder="Answer" className="mt-2 min-h-20 w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:border-primary" />
          <Button size="sm" className="mt-2" onClick={add}><Plus /> Add FAQ</Button>
        </div>
      </div>
    </Panel>
  );
}
