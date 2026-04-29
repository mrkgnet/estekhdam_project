
function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 text-center animate-pulse">
      <div className="w-20 aspect-square rounded-3xl bg-slate-200" />
      <div className="h-3 w-14 rounded bg-slate-200" />
    </div>
  );
}

 export function CategoryGridSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* header skeleton */}
      <div className="flex items-center justify-between mb-8 bg-slate-100 px-3 py-2 rounded-md animate-pulse">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="h-4 w-10 rounded bg-slate-200" />
      </div>

      {/* grid skeleton */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-6 md:gap-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
