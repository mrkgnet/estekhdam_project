import React, { Suspense } from 'react';
import FetchDataMCD from './FetchDataMCD';

// ۱. ساخت کامپوننت اسکلتون برای لیست دوره‌ها
function MyCoursesSkeleton() {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
      {/* هدر اسکلتون */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <div className="h-5 w-40 bg-slate-200 rounded mb-2"></div>
          <div className="h-3 w-48 bg-slate-200 rounded"></div>
        </div>
        <div className="h-4 w-20 bg-slate-200 rounded"></div>
      </div>

      {/* لیست دوره‌های اسکلتون (مثلا ۳ تا آیتم فیک برای نمایش لودینگ) */}
      <div className="p-5 space-y-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 w-full">
                {/* عنوان دوره */}
                <div className="h-4 w-3/4 sm:w-1/2 bg-slate-200 rounded mb-2"></div>
                {/* تاریخ */}
                <div className="h-3 w-32 bg-slate-200 rounded"></div>
              </div>

              {/* دکمه ادامه */}
              <div className="shrink-0 h-10 w-24 rounded-2xl bg-slate-200"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ۲. استفاده از Suspense در کامپوننت اصلی
export default function MyCourses() {
  return (
    <div>
      {/* کامپوننت FetchDataMCD تا زمان دریافت اطلاعات، جای خود را به MyCoursesSkeleton می‌دهد */}
      <Suspense fallback={<MyCoursesSkeleton />}>
        <FetchDataMCD />
      </Suspense>
    </div>
  );
}
