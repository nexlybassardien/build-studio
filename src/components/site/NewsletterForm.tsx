import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/lib/forms.functions";
import { newsletterSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const submit = useServerFn(subscribeNewsletter);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Partial<Record<"firstName" | "email", string>>>({});
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = newsletterSchema.safeParse({ firstName, email });
    if (!parsed.success) {
      const errs: Partial<Record<"firstName" | "email", string>> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0]) as "firstName" | "email"] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("loading");
    try {
      const res = await submit({ data: parsed.data });
      if (res.ok) {
        setState("done");
        setMessage(
          res.already
            ? `You're already on the list, ${parsed.data.firstName}. We'll be in touch!`
            : `You're in, ${parsed.data.firstName}! We'll let you know when the next edit drops.`,
        );
      } else {
        setState("error");
        setMessage(res.error);
      }
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  const field = cn(
    "h-13 w-full rounded-2xl border px-5 text-[0.95rem] outline-none transition-all focus:ring-2 focus:ring-ring",
    tone === "dark"
      ? "border-ink-foreground/15 bg-ink-foreground/10 text-ink-foreground placeholder:text-ink-foreground/50"
      : "border-input bg-card text-foreground placeholder:text-muted-foreground",
  );

  if (state === "done") {
    return (
      <div
        role="status"
        className={cn(
          "flex animate-rise items-center gap-4 rounded-3xl p-5",
          tone === "dark" ? "bg-ink-foreground/10 text-ink-foreground" : "bg-card shadow-soft",
        )}
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-5 w-5" />
        </span>
        <p className="font-medium">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr]">
        <div>
          <label htmlFor="nl-first" className="sr-only">First name</label>
          <input
            id="nl-first"
            className={field}
            placeholder="First name"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            aria-invalid={!!errors.firstName}
          />
          {errors.firstName && <p className="mt-1.5 px-2 text-xs font-medium text-destructive">{errors.firstName}</p>}
        </div>
        <div>
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <input
            id="nl-email"
            type="email"
            className={field}
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="mt-1.5 px-2 text-xs font-medium text-destructive">{errors.email}</p>}
        </div>
      </div>
      <Button type="submit" size="lg" disabled={state === "loading"} className="w-full sm:w-auto">
        {state === "loading" && <Loader2 className="animate-spin" />}
        Keep me in the loop
      </Button>
      {state === "error" && <p role="alert" className="text-sm font-medium text-destructive">{message}</p>}
    </form>
  );
}
