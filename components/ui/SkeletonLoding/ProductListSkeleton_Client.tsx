function ProductSkeletonCard() {
    return (
        <div className="relative flex shadow flex-row bg-white rounded-xl border border-slate-300 p-3 sm:p-4 gap-3 sm:gap-6 animate-pulse">
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-200 rounded-full border-2 border-white" />
            <div className="relative w-[110px] sm:w-[200px] shrink-0 aspect-square sm:aspect-[4/3] flex items-center justify-center p-1 sm:p-2 border-l border-gray-200 sm:border-gray-300">
                <div className="w-full h-full bg-slate-200 rounded-lg" />
            </div>

            <div className="flex flex-col flex-grow justify-between py-1 sm:py-2 min-w-0 w-full">
                <div>
                    <div className="h-4 w-2/3 bg-slate-200 rounded mb-3" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded mb-2" />
                    <div className="h-3 w-1/3 bg-slate-100 rounded" />
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                    <div className="h-6 w-20 bg-slate-200 rounded" />
                    <div className="h-8 w-28 bg-slate-200 rounded" />
                </div>
            </div>
        </div>
    );
}

export function ProductListSkeleton_Client() {
    return (
        <div className="text-xs md:text-sm mx-auto p-4 max-w-7xl" dir="rtl">
            <div className="flex flex-col gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <ProductSkeletonCard key={i} />
                ))}
            </div>
        </div>
    );
}