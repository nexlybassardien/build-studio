import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import logo from "@/assets/FaisaEditXlogo.png";
import { INSTAGRAM_URL } from "@/lib/brand-media";

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="" width={52} height={52} className="h-13 w-13 rounded-2xl" loading="lazy" />
              <p className="font-display text-2xl">The Faisa Edit</p>
            </div>
            <p className="mt-5 max-w-sm font-italic-serif text-3xl leading-tight text-ink-foreground/90">
              Not just a market. It&apos;s an entire experience.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink-foreground/20 px-4 py-2 text-sm font-semibold transition-colors hover:bg-ink-foreground/10"
            >
              <Instagram className="h-4 w-4" /> @thefaisaeditx
            </a>
          </div>
          <div>
            <p className="eyebrow text-ink-muted">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-pink">About</Link></li>
              <li><Link to="/experience" className="hover:text-pink">The Experience</Link></li>
              <li><Link to="/past-markets" className="hover:text-pink">Past Markets</Link></li>
              <li><Link to="/contact" className="hover:text-pink">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-ink-muted">Vendors</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/become-a-vendor" className="hover:text-pink">Apply for a stall</Link></li>
              <li><Link to="/become-a-vendor" hash="faq" className="hover:text-pink">Vendor FAQs</Link></li>
              <li><Link to="/terms" className="hover:text-pink">Terms &amp; conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-pink">Privacy policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-ink-foreground/10 pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} The Faisa Edit. A curated pop-up experience, South Africa.</p>
          <Link to="/auth" className="hover:text-ink-foreground">Team login</Link>
        </div>
      </div>
    </footer>
  );
}
