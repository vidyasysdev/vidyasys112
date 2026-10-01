import Link from "next/link";
import Image from "next/image";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { href: "/notes", label: "Notes" },
      { href: "/projects", label: "Projects & Hardware" },
      { href: "/tutors", label: "Peer Tutors" },
      { href: "/partnerships", label: "Partnerships" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Vidyasys" },
      { href: "/trust-safety", label: "Trust & Safety" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { href: "/signup", label: "Create Account" },
      { href: "/login", label: "Sign In" },
      { href: "/explore", label: "Explore Marketplace" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-panel text-ink-muted text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt="Vidyasys"
                width={36}
                height={36}
                className="h-7 w-auto"
              />
              <span className="flex items-baseline">
                <span className="font-black tracking-tight text-ink">Vidya</span>
                <span className="font-black tracking-tight text-royal">sys</span>
              </span>
            </Link>
            <p className="text-xs text-ink-muted leading-relaxed">
              Your polytechnic, your resources, your ecosystem. Academic resources,
              projects, peer learning and student services in one platform.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-ink text-xs uppercase tracking-wider mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2 text-xs">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-royal transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
          <span>&copy; {new Date().getFullYear()} Vidyasys. All rights reserved.</span>
          <a
            href="https://arssystem.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-royal transition"
          >
            Designed &amp; Developed by Aryan Sonsurkar
          </a>
        </div>
      </div>
    </footer>
  );
}
