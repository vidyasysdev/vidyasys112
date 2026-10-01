"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, FolderKanban, GraduationCap, Search } from "lucide-react";
import { openSearch } from "@/components/search/CommandPalette";

const ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/notes", label: "Notes", icon: BookOpen },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/tutors", label: "Tutors", icon: GraduationCap },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-hairline pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-1.5">
        {ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition min-w-[56px] ${
                isActive ? "text-royal" : "text-ink-muted"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-royal" : ""}`} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={openSearch}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-ink-muted min-w-[56px]"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
          Search
        </button>
      </div>
    </nav>
  );
}
