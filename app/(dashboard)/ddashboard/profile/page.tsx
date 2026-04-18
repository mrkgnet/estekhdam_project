import React, { Suspense } from 'react';
import FetchDataPU from './FetchDataPU';

// ۱. ساخت کامپوننت اسکلتون مخصوص پروفایل
function SkeletonProfileLoader() {
  return (
    // استفاده از animate-pulse برای افکت چشمک‌زن لودینگ
    <div className="space-y-6 animate-pulse">
      
      {/* اسکلتون بردکرامب */}
      <div className="flex items-center gap-2">
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
        <div className="w-4 h-4 bg-gray-200 rounded"></div>
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
      </div>

      {/* اسکلتون باکس اصلی فرم */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* اسکلتون هدر و آواتار */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center gap-6">
          {/* آواتار */}
          <div className="w-24 h-24 rounded-full bg-gray-200"></div>
          {/* نام و نقش */}
          <div>
            <div className="w-32 h-5 bg-gray-200 rounded mb-3"></div>
            <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* اسکلتون فیلدهای فرم */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* حلقه برای تولید ۶ فیلد ورودی (نام، نام خانوادگی، موبایل، کدملی، ایمیل، جنسیت) */}
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-2">
                {/* لیبل */}
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                {/* اینپوت */}
                <div className="w-full h-[42px] bg-gray-100 rounded-xl"></div>
              </div>
            ))}
          </div>

          {/* اسکلتون دکمه ذخیره */}
          <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
            <div className="w-36 h-[42px] bg-gray-200 rounded-xl"></div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div>
      {/* ۲. احاطه کردن کامپوننت Fetch با Suspense و پاس دادن اسکلتون به fallback */}
      <Suspense fallback={<SkeletonProfileLoader />}>
        <FetchDataPU />
      </Suspense>
    </div>
  );
}
