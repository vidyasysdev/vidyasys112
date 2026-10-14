import Link from "next/link";
import Image from "next/image";
import { ArrowUp, Github, Instagram, Linkedin, Mail, MapPin, Twitter } from "lucide-react";

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

const SOCIALS = [
  { href: "https://instagram.com", label: "Instagram", icon: <Instagram className="w-4 h-4" /> },
  { href: "https://linkedin.com", label: "LinkedIn", icon: <Linkedin className="w-4 h-4" /> },
  { href: "https://twitter.com", label: "Twitter", icon: <Twitter className="w-4 h-4" /> },
  { href: "https://github.com", label: "GitHub", icon: <Github className="w-4 h-4" /> },
];

export function Footer() {
  return (
    <footer className="relative border-t border-hairline bg-panel text-ink-muted text-sm overflow-hidden">
      {/* top accent + glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-royal/60 to-transparent" />
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-royal/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 right-0 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-4">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="relative">
                <span className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-royal via-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                <Image
                  src="/images/logo.jpeg"
                  alt="Vidyasys"
                  width={36}
                  height={36}
                  className="relative h-7 w-auto rounded-md"
                />
              </span>
              <span className="flex items-baseline">
                <span className="font-black tracking-tight text-ink">Vidya</span>
                <span className="font-black tracking-tight bg-gradient-to-r from-royal to-violet-500 bg-clip-text text-transparent">
                  sys
                </span>
              </span>
            </Link>
            <p className="text-xs text-ink-muted leading-relaxed max-w-xs">
              Your polytechnic, your resources, your ecosystem. Academic resources,
              projects, peer learning and student services in one platform.
            </p>

            <div className="space-y-2 text-xs">
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-royal" />
                Vidyalankar Polytechnic, Mumbai
              </span>
              <br />
              <a
                href="mailto:hello@vidyasys.in"
                className="inline-flex items-center gap-2 py-1.5 hover:text-royal transition"
              >
                <Mail className="w-3.5 h-3.5 text-royal" />
                hello@vidyasys.in
              </a>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl border border-hairline flex items-center justify-center text-ink-muted hover:text-white hover:bg-royal hover:border-royal hover:-translate-y-0.5 hover:shadow-lg hover:shadow-royal/25 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col, i) => (
            <div key={col.title}>
              <h3 className="inline-block relative font-semibold text-ink text-xs uppercase tracking-wider mb-4">
                {col.title}
                <span
                  className="absolute left-0 -bottom-1.5 h-0.5 w-8 rounded-full bg-gradient-to-r from-royal to-violet-500"
                  style={{ opacity: 1 - i * 0.2 }}
                />
              </h3>
              <ul className="space-y-0.5 text-xs">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 py-1.5 hover:text-royal transition"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-royal transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <span>
            &copy; {new Date().getFullYear()} Vidyasys. All rights reserved.
          </span>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href="https://arssystem.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-1.5 font-semibold hover:text-royal transition"
            >
              Designed &amp; Developed by Aryan Sonsurkar
            </a>
            <a
              href="#top"
              aria-label="Back to top"
              className="w-8 h-8 rounded-lg border border-hairline flex items-center justify-center hover:bg-royal hover:text-white hover:border-royal transition"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
