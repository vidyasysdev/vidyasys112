"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Search, LogIn } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

type Indicator = { left: number; width: number; opacity: number };

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [indicator, setIndicator] = useState<Indicator>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const moveTo = (href: string) => {
    const container = navRef.current;
    const item = itemRefs.current[href];
    if (!container || !item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    setIndicator({
      left: itemRect.left - containerRect.left,
      width: itemRect.width,
      opacity: 1,
    });
  };

  const activeHref =
    NAV_LINKS.find((link) =>
      link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
    )?.href ?? "/";

  // Keep the sliding highlight glued to the current page.
  useLayoutEffect(() => {
    moveTo(activeHref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHref, pathname]);

  useEffect(() => {
    const onResize = () => moveTo(activeHref);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHref]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Escape closes it, and the page behind should not scroll while it is open.
  useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <header
      className={`sticky top-0 z-50 glass transition-all duration-300 ${
        scrolled
          ? "border-b border-hairline shadow-lg shadow-brand-950/10"
          : "border-b border-transparent"
      }`}
    >
      {/* shimmering gradient edge */}
      <div className="absolute inset-x-0 top-0 h-[2px] gradient-frame opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* ------------------------------ Brand ------------------------------ */}
        <Link href="/" className="group flex items-center gap-2.5 shrink-0">
          <span className="relative">
            <span className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-royal via-violet-500 to-fuchsia-500 opacity-45 blur-md transition-all duration-300 group-hover:opacity-100 group-hover:blur-lg" />
            <span className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-royal via-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-40 blur animate-pulse-dot" />
            <Image
              src="/images/logo.jpeg"
              alt="Vidyasys"
              width={40}
              height={40}
              className="relative h-9 w-auto rounded-xl ring-1 ring-white/20"
              priority
            />
          </span>
          <span className="hidden sm:flex items-baseline">
            <span className="text-lg font-black tracking-tight text-ink">Vidya</span>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-royal via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              sys
            </span>
          </span>
        </Link>

        {/* --------------------------- Sliding nav --------------------------- */}
        <nav
          ref={navRef}
          aria-label="Main"
          onMouseLeave={() => moveTo(activeHref)}
          className="hidden lg:flex relative items-center gap-1 p-1 rounded-full border border-hairline bg-panel-2/60 backdrop-blur-sm"
        >
          <span
            aria-hidden="true"
            className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-royal/15 to-violet-500/15 border border-royal/30 shadow-sm shadow-royal/10 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.opacity,
            }}
          />

          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => {
                  itemRefs.current[link.href] = el;
                }}
                onMouseEnter={() => moveTo(link.href)}
                onFocus={() => moveTo(link.href)}
                className={`relative z-10 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  isActive ? "text-royal" : "text-ink-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ----------------------------- Actions ----------------------------- */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={openSearch}
            aria-label="Search (⌘K)"
            className="group hidden sm:flex items-center gap-2 pl-3 pr-2 py-2 rounded-full border border-hairline text-xs font-semibold text-ink-muted hover:text-ink hover:border-royal/45 hover:bg-royal/5 transition"
          >
            <Search className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            <span>Search</span>
            <kbd className="text-[10px] border border-hairline rounded px-1.5 py-0.5 bg-panel-2">
              ⌘K
            </kbd>
          </button>

          <ThemeSwitcher />

          <Link
            href="/login"
            className="group inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-royal to-violet-600 hover:from-violet-600 hover:to-royal text-white text-xs sm:text-sm font-bold transition-all duration-300 shadow-lg shadow-royal/30 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5 btn-shine"
          >
            <LogIn className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
            Sign In
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-ink-muted hover:bg-panel-2 hover:text-ink transition"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* --------------------------- Mobile drawer --------------------------- */}
      {mobileOpen && (
        <div className="lg:hidden menu-in border-t border-hairline px-4 py-4 space-y-3 bg-panel/95 backdrop-blur-xl max-h-[calc(100dvh_-_4rem)] overflow-y-auto overscroll-contain">
          <button
            onClick={() => {
              setMobileOpen(false);
              openSearch();
            }}
            className="menu-item w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border border-hairline text-sm font-semibold text-ink-muted hover:border-royal/40 transition"
            style={{ animationDelay: "40ms" }}
          >
            <Search className="w-4 h-4" />
            Search
            <kbd className="ml-auto text-[10px] border border-hairline rounded px-1">⌘K</kbd>
          </button>

          <nav className="space-y-1">
            {NAV_LINKS.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{ animationDelay: `${70 + index * 40}ms` }}
                  className={`menu-item flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "text-white bg-gradient-to-r from-royal to-violet-600 shadow-md shadow-royal/25"
                      : "text-ink-muted hover:bg-panel-2"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div
            className="menu-item pt-3 border-t border-hairline flex items-center gap-3"
            style={{ animationDelay: `${70 + NAV_LINKS.length * 40}ms` }}
          >
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center px-4 py-2.5 rounded-xl border border-hairline text-sm font-bold text-ink hover:border-royal/40 transition"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-royal to-violet-600 text-white text-sm font-bold transition shadow-md shadow-royal/25"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
