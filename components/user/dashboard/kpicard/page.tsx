import React, { Suspense } from 'react';
import FetchDataKPIC from './FetchDataKPIC';

// ۱. ساخت کامپوننت اسکلتون (طراحی مشابه کارت‌های اصلی با انیمیشن چشمک‌زن)
function KpiSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="w-full">
          {/* عنوان */}
          <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
          {/* مقدار */}
          <div className="h-8 w-12 bg-slate-200 rounded mb-3"></div>
          {/* متن راهنما */}
          <div className="h-3 w-24 bg-slate-200 rounded"></div>
        </div>

        {/* آیکون */}
        <div className="w-11 h-11 rounded-2xl bg-slate-200 flex-shrink-0"></div>
      </div>

      {/* نوار پیشرفت پایین کارت */}
      <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full w-2/3 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
}

// ۲. ساخت گرید برای نمایش چند اسکلتون کنار هم (مشابه گرید اصلی)
function SkeletonGrid() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiSkeleton />
      <KpiSkeleton />
    </section>
  );
}

// ۳. استفاده از Suspense در کامپوننت اصلی
export default function KpiGrid() {
  return (
    <div>
      {/* تا زمانی که دیتای FetchDataKPIC لود شود، SkeletonGrid نمایش داده می‌شود */}
      <Suspense fallback={<SkeletonGrid />}>
        <FetchDataKPIC />
      </Suspense>
    </div>
  );
}
