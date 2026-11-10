import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ClipboardList, ExternalLink, Image, Inbox, LayoutDashboard, Loader2, LogOut, Menu, Settings2, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { brandImages } from "@/lib/brand-media";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Dashboard — The Faisa Edit" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/applications", label: "Applications", icon: ClipboardList },
  { to: "/admin/media", label: "Media Manager", icon: Image },
  { to: "/admin/spotlights", label: "Vendor Spotlights", icon: Star },
  { to: "/admin/content", label: "Website Content", icon: Settings2 },
  { to: "/admin/inbox", label: "Messages & Subscribers", icon: Inbox },
] as const;

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["admin", "is-admin", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (error) throw error;
      return !!data;
    },
  });

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-blush">
        <Loader2 className="h-8 w-8 animate-spin text-pink-deep" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-blush px-5">
        <div className="max-w-md rounded-4xl bg-card p-10 text-center shadow-float">
          <h1 className="text-4xl font-semibold">No access yet</h1>
          <p className="mt-3 text-muted-foreground">
            You&apos;re signed in as {user.email}, but this account isn&apos;t an administrator. Ask the site owner to grant access.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/">Back to site</Link>
            </Button>
            <Button onClick={signOut}>Sign out</Button>
          </div>
        </div>
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link to="/admin" className="flex items-center gap-3 px-2">
        <img src={brandImages.logo} alt="" className="h-10 w-10 rounded-xl" />
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold">The Faisa Edit</p>
          <p className="text-xs text-muted-foreground">Team dashboard</p>
        </div>
      </Link>
      <nav className="mt-8 space-y-1">
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: "exact" in n && n.exact }}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
          >
            <n.icon className="h-4 w-4" /> {n.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto space-y-1 pt-8">
        <Link to="/" target="_blank" className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-foreground/70 hover:bg-secondary">
          <ExternalLink className="h-4 w-4" /> View website
        </Link>
        <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-foreground/70 hover:bg-secondary">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
        <p className="truncate px-3 pt-2 text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sidebar">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-sidebar-border bg-card p-5 lg:block">{sidebar}</aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2">
          <img src={brandImages.logo} alt="" className="h-9 w-9 rounded-xl" />
          <span className="font-display font-semibold">Dashboard</span>
        </div>
        <button type="button" aria-label="Open menu" onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-full bg-secondary">
          <Menu className="h-5 w-5" />
        </button>
      </header>
      <div className={cn("fixed inset-0 z-40 lg:hidden", open ? "visible" : "invisible")}>
        <div className={cn("absolute inset-0 bg-ink/40 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <div className={cn("absolute inset-y-0 left-0 w-72 bg-card p-5 shadow-float transition-transform duration-500 ease-ios", open ? "translate-x-0" : "-translate-x-full")}>
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-secondary">
            <X className="h-4 w-4" />
          </button>
          {sidebar}
        </div>
      </div>

      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
