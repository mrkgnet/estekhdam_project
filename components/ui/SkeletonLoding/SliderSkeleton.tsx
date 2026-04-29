import React from 'react';

export const SliderSkeleton = () => {
  // یک آرایه برای نمایش چند کارت اسکلتی
  const skeletonItems = Array.from({ length: 4 });

  return (
    <div className="w-full mx-auto relative px-2 h-full" dir="rtl">
      <div className="relative group h-full pt-2 animate-pulse">
        {/* نوار پیشرفت اسکلتی */}
        <div className="h-[3px] bg-gray-200 absolute top-0 left-0 right-0 z-20 rounded-t-md"></div>
        
        {/* کانتینر کارت‌ها با flex برای شبیه‌سازی چیدمان اسلایدر */}
        <div className="flex overflow-hidden py-2 mt-2 gap-2.5 md:gap-4">
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              // این عرض‌ها برای شبیه‌سازی slidesPerView={2} است
              // flex-shrink-0 از فشرده شدن کارت‌ها جلوگیری می‌کند
              className="w-[48%] md:w-[49%] flex-shrink-0"
            >
              <div className="flex flex-col h-full w-full border border-gray-200 rounded overflow-hidden bg-white">
                {/* بخش تصویر */}
                <div className="w-full h-[130px] md:h-[150px] xl:h-[170px] bg-slate-200"></div>

                {/* بخش محتوا */}
                <div className="flex flex-col flex-1 p-4 md:p-5 z-10 justify-between">
                  {/* عنوان */}
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                  </div>
                  
                  {/* لیست ویژگی‌ها */}
                  <div className="mt-8 space-y-2.5">
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
