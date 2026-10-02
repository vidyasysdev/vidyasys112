"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Search, LogIn } from "lucide-react";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { openSearch } from "@/components/search/CommandPalette";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/projects", label: "Projects" },
  { href: "/tutors", label: "Tutors" },
  { href: "/partnerships", label: "Partnerships" },
  { href: "/about", label: "About" },
  { href: "/trust-safety", label: "Trust & Safety" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 glass border-b border-hairline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/images/logo.jpeg"
            alt="Vidyasys"
            width={40}
            height={40}
            className="h-8 w-auto"
            priority
          />
          <span className="hidden sm:flex items-baseline">
            <span className="text-lg font-black tracking-tight text-ink">Vidya</span>
            <span className="text-lg font-black tracking-tight text-royal">sys</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-ink-muted">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "text-royal bg-royal/10"
                    : "hover:text-ink hover:bg-panel-2"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            onClick={openSearch}
            aria-label="Search (Ctrl+K)"
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-hairline text-xs font-semibold text-ink-muted hover:text-ink hover:border-royal/40 transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
            <kbd className="text-[10px] border border-hairline rounded px-1">⌘K</kbd>
          </button>

          <ThemeSwitcher />

          <Link
            href="/login"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-royal hover:bg-royal-strong text-white text-sm font-bold transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-ink-muted hover:bg-panel-2 transition"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-hairline px-4 py-4 space-y-3">
          <button
            onClick={() => {
              setMobileOpen(false);
              openSearch();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-hairline text-sm font-semibold text-ink-muted"
          >
            <Search className="w-4 h-4" />
            Search
            <kbd className="ml-auto text-[10px] border border-hairline rounded px-1">⌘K</kbd>
          </button>
          <nav className="space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "text-royal bg-royal/10"
                      : "text-ink-muted hover:bg-panel-2"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-3 border-t border-hairline flex items-center gap-3">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center px-4 py-2.5 rounded-xl border border-hairline text-sm font-bold text-ink"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center px-4 py-2.5 rounded-xl bg-royal text-white text-sm font-bold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
