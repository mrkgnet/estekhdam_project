function BreakingNewsCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 animate-pulse">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
        <div className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl bg-slate-200" />
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-4 w-44 rounded bg-slate-200" />
            <div className="h-5 w-16 rounded-full bg-slate-200" />
          </div>
          <div className="h-3 w-36 rounded bg-slate-200" />
        </div>
      </div>

      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0 w-full sm:w-auto">
        <div className="h-8 w-28 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

export function BreakingNewsListSkeleton() {
  return (
    <div className="flex max-h-[400px] flex-col gap-3 md:gap-4 overflow-y-auto pr-1 md:pr-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <BreakingNewsCardSkeleton key={i} />
      ))}
    </div>
  );
}