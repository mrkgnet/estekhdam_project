export function ShowDataResourcesSkeleton() {
  // آرایه‌ای برای تکرار تعداد دسته‌بندی‌های فرضی (مثلا 2 دسته‌بندی)
  const categorySkeletons = [1, 2];
  // آرایه‌ای برای تکرار تعداد کارت‌های فرضی در هر اسلایدر (مثلا 4 کارت)
  const cardSkeletons = [1, 2, 3, 4];

  return (
    <section className="w-full min-h-screen bg-slate-50 py-10 overflow-hidden" dir="rtl">
      <div className="px-4 sm:px-6 lg:px-8 space-y-12">
        {categorySkeletons.map((catKey) => (
          <div
            key={catKey}
            className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 lg:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.02)] w-full"
          >
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {/* خط سبز کنار تایتل */}
                <div className="w-2 h-6 bg-slate-200 rounded-full animate-pulse"></div>
                {/* تایتل دسته‌بندی */}
                <div className="h-5 bg-slate-200 rounded-md w-32 sm:w-48 animate-pulse"></div>
              </div>

              {/* دکمه مشاهده همه */}
              <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse"></div>
            </div>

            {/* Slider Wrapper Skeleton */}
            <div className="w-full relative overflow-hidden pb-14 pt-2 px-2">
              <div className="flex gap-4 sm:gap-5 md:gap-6">
                {cardSkeletons.map((cardKey) => (
                  <article
                    key={cardKey}
                    className="flex-shrink-0 w-[220px] sm:w-[240px] flex flex-col h-[380px] rounded-2xl border border-slate-100 bg-white overflow-hidden"
                  >
                    {/* Image Skeleton */}
                    <div className="relative w-full aspect-[3/4] bg-slate-100 animate-pulse"></div>

                    {/* Content Skeleton */}
                    <div className="p-4 flex flex-col flex-grow justify-between gap-4">
                      {/* Title Lines */}
                      <div className="space-y-2.5">
                        <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse"></div>
                      </div>

                      <div className="space-y-3 mt-auto">
                        {/* Price Box Skeleton */}
                        <div className="flex flex-col items-end pt-3 border-t border-slate-100 border-dashed space-y-1.5">
                          <div className="h-2.5 bg-slate-200 rounded w-16 animate-pulse"></div>
                          <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
                        </div>

                        {/* Buttons Skeleton */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-9 rounded-xl bg-slate-100 animate-pulse"></div>
                          <div className="h-9 rounded-xl bg-slate-200 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}