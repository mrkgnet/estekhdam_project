import React, { Suspense } from 'react';
import FetchDataBreakingNews from './FetchDataBreakingNews';

// 1. طراحی اسکلت لودینگ مدرن (Skeleton)
const BreakingNewsSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm max-w-2xl mx-auto w-full animate-pulse">
      
      {/* اسکلت هدر و تب‌ها */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-50">
        {/* دکمه قبلی */}
        <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0"></div>
        
        {/* تب‌ها */}
        <div className="flex-1 flex gap-3 overflow-hidden">
          <div className="w-28 h-9 rounded-full bg-slate-200"></div>
          <div className="w-28 h-9 rounded-full bg-slate-200"></div>
          <div className="w-28 h-9 rounded-full bg-slate-100 hidden sm:block"></div>
        </div>

        {/* دکمه بعدی */}
        <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0"></div>
      </div>

      {/* اسکلت لیست اخبار (نمایش 3 آیتم فرضی در حال لود) */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex gap-4 items-start p-3 rounded-xl">
            {/* اسکلت تصویر */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-slate-200 shrink-0"></div>

            {/* اسکلت متن‌ها */}
            <div className="flex flex-col flex-1 py-2 justify-between h-full w-full">
              <div className="space-y-3 w-full">
                {/* عنوان (دو خط) */}
                <div className="h-4 bg-slate-200 rounded-md w-full"></div>
                <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
              </div>
              
              {/* تاریخ / متادیتا */}
              <div className="flex items-center gap-2 mt-4">
                <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. کامپوننت اصلی با استفاده از Suspense
export default function BreakingNewsComponent() {
  return (
    <div>
      <Suspense fallback={<BreakingNewsSkeleton />}>
        <FetchDataBreakingNews />
      </Suspense>
    </div>
  );
}
