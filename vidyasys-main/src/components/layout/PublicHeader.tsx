"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="Vidyasys"
            width={40}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <Link href="/explore" className="hover:text-brand-600 transition">
            Explore
          </Link>
          <Link href="/tutors" className="hover:text-brand-600 transition">
            Tutors
          </Link>
          <Link href="/about" className="hover:text-brand-600 transition">
            About
          </Link>
          <Link href="/how-it-works" className="hover:text-brand-600 transition">
            How It Works
          </Link>
          <Link href="/contact" className="hover:text-brand-600 transition">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold transition"
          >
            Sign Up
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <nav className="space-y-2">
            {[
              { href: "/explore", label: "Explore" },
              { href: "/tutors", label: "Tutors" },
              { href: "/about", label: "About" },
              { href: "/how-it-works", label: "How It Works" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <Link
              href="/login"
              className="flex-1 text-center px-4 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-700"
              onClick={() => setMobileOpen(false)}
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="flex-1 text-center px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-bold"
              onClick={() => setMobileOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
