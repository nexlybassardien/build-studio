import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, TextInput } from "@/components/vendor/fields";
import { supabase } from "@/integrations/supabase/client";
import { brandImages } from "@/lib/brand-media";

type Search = { redirect?: string };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" && s.redirect.startsWith("/") && !s.redirect.startsWith("//") ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Team login — The Faisa Edit" },
      { name: "description", content: "Sign in to The Faisa Edit team dashboard." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Team login — The Faisa Edit" },
      { property: "og:description", content: "Private dashboard for The Faisa Edit team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const goNext = () => {
    if (redirect) navigate({ href: redirect, replace: true });
    else navigate({ to: "/admin", replace: true });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) goNext();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    if (mode === "signin") {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (err) return setError(err.message === "Invalid login credentials" ? "Incorrect email or password." : err.message);
      goNext();
    } else {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      setLoading(false);
      if (err) return setError(err.message);
      if (data.session) goNext();
      else setInfo("Check your inbox to confirm your email, then sign in.");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={brandImages.experience} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-scrim" />
        <p className="absolute bottom-12 left-12 max-w-md font-italic-serif text-5xl leading-tight text-ink-foreground">
          Behind every edit is a little bit of magic.
        </p>
      </div>
      <div className="flex items-center justify-center bg-gradient-blush px-5 py-16">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
          <div className="rounded-4xl bg-card p-8 shadow-float">
            <img src={brandImages.logo} alt="The Faisa Edit" className="h-14 w-14 rounded-2xl" />
            <h1 className="mt-5 text-4xl font-semibold">{mode === "signin" ? "Team login" : "Create team account"}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Private access for The Faisa Edit team."
                : "The very first account becomes the site administrator. Additional accounts have no access until granted."}
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              <Field label="Email" htmlFor="a-email">
                <TextInput id="a-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field label="Password" htmlFor="a-pass">
                <TextInput
                  id="a-pass"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
              {info && <p role="status" className="rounded-2xl bg-secondary p-3 text-sm font-medium">{info}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                {mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setInfo(null);
              }}
              className="mt-5 w-full text-center text-sm font-semibold text-pink-deep"
            >
              {mode === "signin" ? "Setting up for the first time? Create an account" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
