function CardSkeleton() {
  return (
    <div className="relative flex flex-row sm:flex-col h-full w-full border border-gray-200 sm:border-gray-300 rounded sm:rounded bg-white p-2.5 sm:p-0 gap-3 sm:gap-0 animate-pulse">
      <div className="absolute -top-3 -right-3 z-20 w-7 h-7 sm:w-8 sm:h-8 bg-slate-100 rounded-full border-2 border-white" />
      <div className="relative w-[130px] shrink-0 aspect-[4/3] sm:w-full sm:aspect-[4/5] sm:bg-gradient-to-b sm:from-slate-50/50 sm:to-slate-100/50 p-2 sm:p-4 md:p-5 border-l border-gray-300 overflow-hidden rounded-r sm:rounded-none sm:rounded-t">
        <div className="w-full h-full bg-slate-100 rounded" />
      </div>

      <div className="px-3 md:px-4 hidden sm:block">
        <div className="flex items-center gap-3 py-2">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200" />
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      </div>

      <div className="flex flex-col flex-1 sm:p-3 md:p-4 z-10 py-0.5 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-100 rounded w-5/6" />

        <div className="space-y-2">
          <div className="h-5 bg-slate-100 rounded w-11/12" />
          <div className="h-5 bg-slate-100 rounded w-8/12" />
        </div>

        <div className="mt-auto pt-3 md:pt-4">
          <div className="hidden sm:flex w-full h-9 md:h-10 rounded-xl bg-slate-200" />
          <div className="sm:hidden h-4 w-20 bg-slate-200 rounded mt-2" />
          <div className="sm:hidden h-4 w-24 bg-slate-100 rounded mt-2" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="relative w-full mt-6">
      <div className="w-full sm:bg-white sm:rounded sm:border sm:border-gray-100 sm:p-6 sm:shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 mt-4 sm:mt-0">
          {Array.from({ length: 10 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
