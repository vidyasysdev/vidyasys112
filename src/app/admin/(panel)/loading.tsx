/** Instant feedback while an admin route loads (or compiles in dev). */
export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-7 w-44 rounded-lg bg-hairline" />
          <div className="h-4 w-64 rounded bg-hairline" />
        </div>
        <div className="h-4 w-28 rounded bg-hairline" />
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-28 rounded-lg bg-hairline" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {[0, 1].map((group) => (
            <div key={group} className="space-y-3">
              <div className="h-3 w-20 rounded bg-hairline" />
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-xl bg-hairline" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-10 rounded-xl bg-hairline" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-hairline" />
          ))}
        </div>
      </div>
    </div>
  );
}
