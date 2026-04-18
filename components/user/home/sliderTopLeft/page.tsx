import React, { Suspense } from 'react';
import FetchDataSLTL from './FetchDataSLTL';

// 1. طراحی کامپوننت لودر اسکلتونی هماهنگ با ظاهر اسلایدر
const SliderSkeleton = () => {
  // یک آرایه ۳ تایی برای پر کردن عرض صفحه در حالت موبایل
  const skeletonCards = [1, 2, 3];

  return (
    // کانتینر اصلی مشابه کانتینر اسلایدر با overflow-hidden
    <div className="w-full mx-auto relative px-2 h-full pt-4 overflow-hidden flex gap-[10px] md:gap-[16px]" dir="rtl">
      
      {skeletonCards.map((item) => (
        <div
          key={item}
          // در موبایل عرض حدود 42% (برای نمایش ~2.3 آیتم) و در دسکتاپ عرض کامل (1 آیتم)
          className="w-[42%] sm:w-[33%] md:w-full flex-shrink-0 border border-gray-200 rounded overflow-hidden flex flex-col bg-white animate-pulse"
        >
          {/* اسکلتون بخش تصویر (با همان ارتفاع‌های تنظیم شده در کارت اصلی) */}
          <div className="w-full h-[150px] md:h-[180px] xl:h-[200px] bg-slate-200/70 flex-shrink-0"></div>

          {/* اسکلتون بخش متن و دکمه */}
          <div className="flex flex-col flex-1 p-3 md:p-4 justify-between gap-4">
            {/* خطوط متن */}
            <div className="space-y-2.5 mt-1">
              <div className="h-3.5 bg-slate-200/70 rounded-md w-full"></div>
              <div className="h-3.5 bg-slate-200/70 rounded-md w-2/3"></div>
            </div>
            
            {/* دکمه پایین کارت */}
            <div className="mt-auto pt-3">
              <div className="w-full h-9 md:h-10 bg-slate-200/70 rounded-xl"></div>
            </div>
          </div>
        </div>
      ))}
      
    </div>
  );
};

// 2. کامپوننت اصلی
export default function SliderTopLeftComponent() {
  return (
    <div className="h-full">
      {/* استفاده از اسکلتون ساخته شده در بخش fallback */}
      <Suspense fallback={<SliderSkeleton />}>
        <FetchDataSLTL />
      </Suspense>
    </div>
  );
}
