import React, { Suspense } from 'react'
import FetchData from './FetchData'
import LinearLoader from '@/components/LinearLoader'



function SkeletonNewsList() {
  return (
    <div className="w-full max-w-7xl mx-auto  sm:px-6 lg:px-8 animate-pulse">
      <div className="grid grid-cols-12 gap-4 p-7">

        {/* Skeleton Sidebar (بخش سایدبار فیلترها) */}
        <div className="col-span-12 lg:col-span-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 min-h-[500px]">
            <div className="h-6 w-1/2 bg-slate-200 rounded-lg mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
              <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
              <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
              <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Skeleton Main Content (بخش اصلی اخبار) */}
        <div className="col-span-12 lg:col-span-9">

          {/* Skeleton Header (نوار بالای لیست) */}
          <div className="rounded-2xl border flex justify-between border-slate-100 bg-white p-4 mb-4 items-center">
            <div className="h-5 w-32 bg-slate-200 rounded-md"></div>
            <div className="h-5 w-20 bg-slate-200 rounded-md"></div>
          </div>

          {/* Skeleton Cards (تولید ۳ کارت به صورت تستی) */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl border border-slate-100 bg-white p-5">

                {/* بخش بالا: لوگو، تایتل و تایمر */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 w-full">
                    {/* باکس لوگو */}
                    <div className="h-12 w-12 rounded-2xl bg-slate-200 shrink-0"></div>
                    {/* باکس عنوان و زیرعنوان */}
                    <div className="w-full space-y-3 pt-1">
                      <div className="h-5 bg-slate-200 rounded-md w-3/4 sm:w-1/2"></div>
                      <div className="h-4 bg-slate-200 rounded-md w-1/2 sm:w-1/3"></div>
                    </div>
                  </div>
                  {/* باکس تایمر */}
                  <div className="w-full lg:w-64 h-12 bg-slate-200 rounded-xl shrink-0"></div>
                </div>

                {/* ۴ باکس اطلاعات (Info Chips) */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((chip) => (
                    <div key={chip} className="h-[68px] rounded-2xl bg-slate-50 border border-slate-100 p-3 flex flex-col justify-center gap-2">
                      <div className="h-3 w-1/2 bg-slate-200 rounded-md"></div>
                      <div className="h-4 w-3/4 bg-slate-200 rounded-md"></div>
                    </div>
                  ))}
                </div>

                {/* تگ‌های شغلی */}
                <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                  <div className="h-8 w-20 bg-slate-200 rounded-xl"></div>
                  <div className="h-8 w-24 bg-slate-200 rounded-xl"></div>
                  <div className="h-8 w-16 bg-slate-200 rounded-xl"></div>
                </div>

                {/* دکمه مشاهده جزئیات */}
                <div className="mt-5 flex justify-end">
                  <div className="h-11 w-full sm:w-56 bg-slate-200 rounded-xl"></div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}





export default async function page({ searchParams }: { searchParams: Promise<{ page?: string; query?: string }> }) {

  const params = await searchParams
  const currentPage = Number(params?.page) || 1;
  const searchQuery = params?.query || "";
  const limit = 10;


  return (
    <Suspense fallback={<SkeletonNewsList />}>
      <FetchData currentPage={currentPage} searchQuery={searchQuery} limit={limit}  />
    </Suspense>
  )
}
