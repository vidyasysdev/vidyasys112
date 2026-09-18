export default function AppLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse" aria-label="Loading">
      <div className="space-y-2">
        <div className="h-8 w-56 rounded-lg bg-slate-200" />
        <div className="h-4 w-72 rounded bg-slate-100" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-slate-200" />
            <div className="h-6 w-12 rounded bg-slate-200" />
            <div className="h-3 w-24 rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-200" />
            <div className="h-4 w-3/4 rounded bg-slate-200" />
            <div className="h-3 w-full rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
