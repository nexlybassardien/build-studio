import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brandImages, INSTAGRAM_URL } from "@/lib/brand-media";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/experience", label: "The Experience" },
  { to: "/past-markets", label: "Past Markets" },
  { to: "/become-a-vendor", label: "Become a Vendor" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          aria-label="Main"
          className={cn(
            "mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full px-2.5 py-2 transition-all duration-500 ease-ios lg:flex lg:justify-between",
            scrolled || open ? "glass shadow-float" : "glass-dark",
          )}
        >
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="The Faisa Edit home">
            <img
              src={brandImages.logo}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-[0.8rem] shadow-soft"
            />
            <span
              className={cn(
                "truncate font-display text-[1.05rem] font-semibold tracking-tight transition-colors",
                scrolled || open ? "text-foreground" : "text-ink-foreground",
              )}
            >
              The Faisa Edit
            </span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.slice(0, 5).map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[0.82rem] font-semibold transition-colors",
                    scrolled
                      ? "text-foreground/75 hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
                      : "text-ink-foreground/85 hover:bg-ink-foreground/15 hover:text-ink-foreground data-[status=active]:bg-ink-foreground/20 data-[status=active]:text-ink-foreground",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/become-a-vendor">Apply to be a Vendor</Link>
            </Button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full transition-colors lg:hidden",
                scrolled || open ? "bg-secondary text-foreground" : "bg-ink-foreground/20 text-ink-foreground",
              )}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-gradient-blush transition-all duration-500 ease-ios lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col px-6 pb-10 pt-28">
          <ul className="space-y-1">
            {links.map((l, i) => (
              <li
                key={l.to}
                className={cn("transition-all duration-500 ease-ios", open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}
                style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              >
                <Link
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  className="block py-2 font-display text-4xl font-medium text-foreground data-[status=active]:italic data-[status=active]:text-pink-deep"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link to="/become-a-vendor">Apply to be a Vendor</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                <Instagram /> Follow @thefaisaeditx
              </a>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
