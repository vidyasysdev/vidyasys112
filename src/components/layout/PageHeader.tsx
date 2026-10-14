import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Small pill shown above the title. */
  eyebrow?: React.ReactNode;
  breadcrumb?: string;
};

/**
 * Shared hero for the public pages — keeps every route visually consistent
 * while giving each one a clear breadcrumb trail.
 */
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-hairline">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute -top-32 -right-16 w-96 h-96 bg-royal/15 rounded-full blur-3xl pointer-events-none animate-aurora-a" />
      <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none animate-aurora-b" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center space-y-5">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-semibold text-ink-muted">
            <li>
              <Link
                href="/"
                className="inline-flex items-center gap-1 py-1.5 hover:text-royal transition"
              >
                <Home className="w-3.5 h-3.5" />
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </li>
            <li className="text-royal" aria-current="page">
              {breadcrumb ?? title}
            </li>
          </ol>
        </nav>

        {eyebrow && <div className="flex justify-center">{eyebrow}</div>}

        <h1 className="text-3xl sm:text-5xl font-black text-ink tracking-tight leading-[1.1]">
          {title}
        </h1>

        {subtitle && (
          <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
