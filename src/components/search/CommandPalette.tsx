"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, FolderKanban, GraduationCap, Building2, BookOpen, ArrowRight, Inbox } from "lucide-react";

export function openSearch() {
  window.dispatchEvent(new CustomEvent("vidyasys:search"));
}

type SearchResult = {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  category: string;
};

const ROUTE_RESULTS: SearchResult[] = [
  { title: "Home", subtitle: "Vidyasys overview", href: "/", icon: <Search className="w-4 h-4" />, category: "Pages" },
  { title: "Notes", subtitle: "Vidyalankar Polytechnic notes", href: "/notes", icon: <BookOpen className="w-4 h-4" />, category: "Resources" },
  { title: "Projects", subtitle: "Academic projects & hardware", href: "/projects", icon: <FolderKanban className="w-4 h-4" />, category: "Resources" },
  { title: "Tutors", subtitle: "Peer tutoring sessions", href: "/tutors", icon: <GraduationCap className="w-4 h-4" />, category: "Resources" },
  { title: "Marketplace", subtitle: "Explore campus marketplace", href: "/explore", icon: <Search className="w-4 h-4" />, category: "Pages" },
  { title: "About", subtitle: "About Vidyasys", href: "/about", icon: <Building2 className="w-4 h-4" />, category: "Pages" },
  { title: "How It Works", subtitle: "Platform guide", href: "/how-it-works", icon: <FileText className="w-4 h-4" />, category: "Pages" },
  { title: "Partnerships", subtitle: "College partnerships", href: "/partnerships", icon: <Building2 className="w-4 h-4" />, category: "Pages" },
  { title: "Trust & Safety", subtitle: "Verification & safety", href: "/trust-safety", icon: <FileText className="w-4 h-4" />, category: "Pages" },
  { title: "Contact", subtitle: "Get in touch", href: "/contact", icon: <FileText className="w-4 h-4" />, category: "Pages" },
];

const EMPTY_MESSAGE = "No resources available yet.";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen((v) => !v);
    window.addEventListener("keydown", onKey);
    window.addEventListener("vidyasys:search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("vidyasys:search", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ROUTE_RESULTS;
    return ROUTE_RESULTS.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    results.forEach((r) => {
      const list = map.get(r.category) ?? [];
      list.push(r);
      map.set(r.category, list);
    });
    return Array.from(map.entries());
  }, [results]);

  const flat = useMemo(() => grouped.flatMap(([, items]) => items), [grouped]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flat[active]) {
      e.preventDefault();
      go(flat[active].href);
    }
  };

  if (!open) return null;

  let idx = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl glass rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-hairline">
          <Search className="w-4 h-4 text-ink-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search notes, projects, tutors, colleges..."
            className="w-full py-4 bg-transparent text-sm text-ink placeholder:text-ink-muted outline-none"
          />
          <kbd className="hidden sm:block text-[10px] font-semibold text-ink-muted border border-hairline rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {flat.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Inbox className="w-8 h-8 mx-auto text-ink-muted/60" />
              <p className="text-sm font-semibold text-ink">{EMPTY_MESSAGE}</p>
              <p className="text-xs text-ink-muted">
                Try a different search — real content will appear here at launch.
              </p>
            </div>
          ) : (
            grouped.map(([category, items]) => (
              <div key={category} className="mb-1.5">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  {category}
                </div>
                {items.map((item) => {
                  idx += 1;
                  const isActive = idx === active;
                  return (
                    <button
                      key={item.href}
                      onClick={() => go(item.href)}
                      onMouseEnter={() => setActive(flat.indexOf(item))}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                        isActive ? "bg-royal/10 text-ink" : "text-ink-muted hover:bg-panel-2"
                      }`}
                    >
                      <span className={isActive ? "text-royal" : "text-ink-muted"}>
                        {item.icon}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold truncate">
                          {item.title}
                        </span>
                        <span className="block text-xs text-ink-muted truncate">
                          {item.subtitle}
                        </span>
                      </span>
                      {isActive && <ArrowRight className="w-3.5 h-3.5 text-royal" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-hairline flex items-center gap-4 text-[11px] text-ink-muted">
          <span>
            <kbd className="font-semibold">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="font-semibold">↵</kbd> open
          </span>
          <span className="ml-auto">
            <kbd className="font-semibold">⌘K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
}
