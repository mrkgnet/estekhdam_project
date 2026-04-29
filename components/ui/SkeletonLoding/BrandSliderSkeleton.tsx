export function BrandSliderSkeleton({ title }: { title?: string }) {
  return (
    <div className="relative overflow-hidden py-4">
      {title && (
        <div className="flex items-center gap-2.5 mb-6 px-2">
          <div className="w-1.5 h-5 bg-green-500 rounded-full" aria-hidden="true" />
          <h2 className="font-bold text-slate-800">{title}</h2>
        </div>
      )}

      <div className="flex gap-4 px-2 pb-6 w-full overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-[75px] sm:w-[85px] md:w-[90px] shrink-0 flex flex-col items-center gap-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200 animate-pulse" />
            <div className="w-14 h-2.5 rounded-full bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}