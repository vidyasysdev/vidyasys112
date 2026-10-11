import { PublicShell } from "@/components/layout/PublicShell";

/**
 * Branded route-level loading state so navigation never feels blank.
 */
export default function RootLoading() {
  return (
    <PublicShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-10">
        <div className="text-center space-y-4">
          <div className="mx-auto h-6 w-40 rounded-full shimmer" />
          <div className="mx-auto h-12 w-2/3 max-w-xl rounded-2xl shimmer" />
          <div className="mx-auto h-5 w-1/2 max-w-lg rounded-xl shimmer" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="glass rounded-3xl p-6 space-y-3"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="w-12 h-12 rounded-2xl shimmer" />
              <div className="h-4 w-2/3 rounded-lg shimmer" />
              <div className="h-3 w-full rounded-lg shimmer" />
              <div className="h-3 w-4/5 rounded-lg shimmer" />
            </div>
          ))}
        </div>

        <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-royal">
          Loading Vidyasys…
        </p>
      </div>
    </PublicShell>
  );
}
