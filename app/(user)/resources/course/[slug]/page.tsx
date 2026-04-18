
import React, { Suspense } from 'react'
import FetchDataQues from './FetchDataCou'


 function ExamDetailsSkeleton() {
  return (
    // Wrapper اصلی دقیقاً مطابق با ExamDetailsPage
    <div className="min-h-screen bg-slate-50/50 py-6 sm:py-10 px-3 sm:px-6 lg:px-8 pb-28 lg:pb-10 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 sm:mb-8 bg-white w-48 h-9 sm:h-10 rounded-xl border border-slate-200/60 shadow-sm animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ==================== ستون سمت راست (سایدبار اطلاعات) ==================== */}
          <div className="lg:col-span-4 w-full space-y-6">
            <div className="bg-white rounded-3xl sm:rounded-[2rem] p-4 sm:p-6 shadow-sm border border-slate-200/60 overflow-hidden relative">
              {/* پس‌زمینه گرادیانت هدر */}
              <div className="absolute top-0 right-0 w-full h-32 sm:h-40 bg-gradient-to-br from-slate-100 via-white to-white -z-10 animate-pulse" />

              {/* عکس محصول */}
              <div className="w-full aspect-video sm:aspect-[4/3] rounded-2xl bg-slate-200 mb-5 sm:mb-6 border border-slate-100 shadow-sm animate-pulse" />

              {/* عنوان */}
              <div className="space-y-2 mb-4">
                <div className="h-5 bg-slate-200 rounded-md w-full animate-pulse" />
                <div className="h-5 bg-slate-200 rounded-md w-2/3 animate-pulse" />
              </div>

              {/* دسته‌بندی‌ها */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5">
                <div className="w-16 h-7 bg-slate-200 rounded-lg animate-pulse" />
                <div className="w-20 h-7 bg-slate-200 rounded-lg animate-pulse" />
              </div>

              {/* اطلاعات کلیدی (باکس طوسی) */}
              <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center pb-2.5 sm:pb-3 border-b border-slate-200/60 border-dashed last:border-0 last:pb-0">
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                    <div className="h-5 w-16 bg-slate-200 rounded-md animate-pulse" />
                  </div>
                ))}
              </div>

              {/* دکمه‌های دسکتاپ (فقط در سایز بزرگ نمایش داده میشن) */}
              <div className="hidden lg:flex flex-col space-y-3">
                <div className="w-full h-14 bg-slate-200 rounded-2xl animate-pulse" />
                <div className="w-full h-14 bg-slate-200 rounded-2xl animate-pulse" />
              </div>
            </div>
          </div>

          {/* ==================== ستون سمت چپ (محتوا و نظرات) ==================== */}
          <div className="lg:col-span-8 w-full flex flex-col gap-6 lg:gap-8">
            
            {/* باکس تب‌ها و توضیحات */}
            <div className="bg-white rounded-3xl sm:rounded-[2rem] shadow-sm border border-slate-200/60 overflow-hidden min-h-[400px]">
              {/* هدر تب‌ها */}
              <div className="flex gap-2 border-b border-slate-100 bg-slate-50/50 p-1.5 sm:p-2">
                <div className="h-11 sm:h-12 w-28 sm:w-32 bg-slate-200 rounded-2xl animate-pulse" />
                <div className="h-11 sm:h-12 w-24 sm:w-28 bg-slate-200 rounded-2xl animate-pulse" />
                <div className="h-11 sm:h-12 w-32 sm:w-36 bg-slate-200 rounded-2xl animate-pulse" />
              </div>

              {/* محتوای تب */}
              <div className="p-4 sm:p-6 md:p-8 space-y-4">
                <div className="h-6 w-40 bg-slate-200 rounded-md animate-pulse mb-6" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-11/12 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* باکس نظرات */}
            <div className="bg-white rounded-3xl sm:rounded-[2rem] shadow-sm border border-slate-200/60 p-4 sm:p-6 md:p-8 h-64 flex flex-col gap-4">
               <div className="h-6 w-32 bg-slate-200 rounded-md animate-pulse" />
               <div className="h-24 w-full bg-slate-100 rounded-xl animate-pulse mt-2" />
               <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse mr-auto" />
            </div>

          </div>
        </div>
      </div>

      {/* ==================== نوار دکمه‌های چسبان مخصوص موبایل ==================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 sm:p-4 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex gap-3">
        {/* دکمه خرید */}
        <div className="flex-1 h-12 sm:h-14 bg-slate-200 rounded-xl sm:rounded-2xl animate-pulse" />
        {/* دکمه شروع آزمون */}
        <div className="flex-[2] h-12 sm:h-14 bg-slate-200 rounded-xl sm:rounded-2xl animate-pulse" />
      </div>

    </div>
  );
}




export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  return (
    <div>
      <Suspense fallback={<ExamDetailsSkeleton />}>
        <FetchDataQues slugValue={slug} />
      </Suspense>
    </div>
  )
}
