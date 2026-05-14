function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full w-full border border-gray-200 rounded overflow-hidden bg-white animate-pulse">
      {/* تصویر */}
      <div className="relative w-full h-[130px] md:h-[150px] xl:h-[155px] flex-shrink-0 p-4 md:p-5">
        <div className="w-full h-full rounded bg-slate-200" />
      </div>

      {/* متن */}
      <div className="flex flex-col flex-1 p-4 md:p-5 justify-between">
        <div className="space-y-2">
          <div className="h-4 w-11/12 bg-slate-200 rounded" />
          <div className="h-4 w-8/12 bg-slate-200 rounded" />
        </div>

     
      </div>
    </div>
  );
}

/** اسکلتون کل اسلایدر */
export function SliderSkeletonTopLeft() {
  return (
    <div className="w-full mx-auto relative px-2 h-full" dir="rtl">
      <div className="relative h-full pt-2">
        {/* نوار بالایی */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-200 rounded" />

        {/* کارت‌ها */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
         
        
          <div className="hidden md:block">
            <ProductCardSkeleton />
          </div>
          <div className="hidden xl:block">
            <ProductCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}