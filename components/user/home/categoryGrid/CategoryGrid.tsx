import React, { Suspense } from 'react'
import FetchDataCAT from './FetchDataCAT'





function CategorySkeleton() {
  // یک آرایه با 8 عضو خالی برای نمایش 8 باکس لودینگ ایجاد می‌کنیم
  const skeletonItems = Array(8).fill(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8" dir="rtl">
      {/* بخش هدر اسکلتون */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-6 md:h-8 bg-slate-200 rounded-md w-48 md:w-80 animate-pulse"></div>
        <div className="h-5 bg-slate-200 rounded-md w-24 animate-pulse"></div>
      </div>

      {/* بخش گرید اسکلتون */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 md:gap-8">
        {skeletonItems.map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-3 w-full">
            {/* باکس آیکون اسکلتون */}
            <div className="w-full aspect-square bg-slate-200 rounded-3xl animate-pulse"></div>

            {/* عنوان اسکلتون */}
            <div className="h-4 md:h-5 bg-slate-200 rounded-md w-2/3 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}





export default function CategoryGrid() {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <FetchDataCAT />
    </Suspense>
  )
}
