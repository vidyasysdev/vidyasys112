import Link from "next/link";
import { Bell, PlusCircle, Search } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

interface AppTopbarProps {
  user: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
  };
}

export function AppTopbar({ user }: AppTopbarProps) {
  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";

  return (
    <header className="sticky top-0 z-30 glass border-b border-hairline h-16 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative hidden sm:block flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Search notes, projects, tutors..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-panel-2 border border-hairline text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/app/create-listing"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Create Listing</span>
        </Link>

        <Link
          href="/app/notifications"
          className="relative p-2 rounded-lg text-ink-muted hover:bg-panel-2 transition"
        >
          <Bell className="w-5 h-5" />
        </Link>

        <ThemeSwitcher />

        <Link href="/app/profile" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
            {getInitials(displayName)}
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-ink">{displayName}</span>
        </Link>
      </div>
    </header>
  );
}
