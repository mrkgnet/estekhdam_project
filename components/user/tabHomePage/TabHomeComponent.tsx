import React, { Suspense } from 'react'
import TabHomeFetchData from './TabHomeFetchData'
import DataFetcher from './TabHomeFetchData'


type Props = {
  searchParams?: Promise<{ category?: string }>
}
function TabHomeSkeleton() {
  const tabs = [
    { label: 'بانک سوالات', sub: '(درسنامه/تست)' },
    { label: 'دفترچه‌های استخدامی', sub: '(درسنامه/تست)' },
    { label: 'منابع رایگان', sub: '' },
  ]

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-2.5 sm:p-4 font-sans animate-pulse">
      {/* Tab Bar Skeleton */}
      <div className="flex flex-wrap items-stretch justify-start gap-1.5 sm:gap-2 relative z-10 -mb-[1.4px]">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`flex-1 sm:flex-none min-w-0 basis-[30%] sm:basis-auto min-h-[56px] sm:min-h-[34px] flex flex-col items-center justify-center px-4 sm:px-6 py-4 sm:py-3 text-xs sm:text-sm font-semibold rounded-t border-2 truncate ${
              index === 0
                ? 'bg-[#FCE3E8] border-[#AF0F12] !border-b-[#FCE3E8] relative z-20'
                : 'bg-white/80 border-[#BEBABA] border-b-[#AF0F12]'
            }`}
          >
            <div className="h-3.5 bg-rose-200/70 rounded w-16 sm:w-20 mb-1" />
            {tab.sub && <div className="hidden sm:block h-2  rounded w-12" />}
          </div>
        ))}
      </div>

      {/* Tab Content Box Skeleton */}
      <div className="bg-[#FCE3E8] border-[#AF0F12] border-2 p-3 sm:p-6 shadow-sm rounded-b-xl relative z-0 overflow-hidden">
        <div className="relative min-h-[110px]">
          {/* Mobile Grid Skeleton (2 columns) */}
          <div className="grid grid-cols-2 gap-2 md:hidden w-full">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="relative w-full flex flex-col items-center justify-between p-2 h-28 bg-white rounded-xl border border-[#AF0F12]/30"
              >
                {/* Ribbon Skeleton */}
                <div className="absolute top-1.5 left-1.5 w-12 h-3  rounded-bl" />
                {/* Image Placeholder */}
                <div className="flex-1 w-full my-1 rounded-lg  flex items-center justify-center p-1.5">
                  <div className="w-8 h-8 rounded-full " />
                </div>
                {/* Title Skeleton */}
                <div className="w-3/4 h-2.5 bg-gray-200 rounded" />
              </div>
            ))}
          </div>

          {/* Desktop Grid Skeleton (6 columns) */}
          <div className="hidden md:grid grid-cols-6 gap-3 w-full">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="relative w-full flex flex-col items-center justify-between p-3 h-36 bg-white rounded-xl border border-[#AF0F12]/30"
              >
                {/* Ribbon Skeleton */}
                <div className="absolute top-1.5 left-1.5 w-14 h-3.5  rounded-bl" />
                {/* Image Placeholder */}
                <div className="flex-1 w-full my-1 rounded-lg flex items-center justify-center p-1.5">
                  <div className="w-10 h-10 rounded-full " />
                </div>
                {/* Title Skeleton */}
                <div className="w-4/5 h-3 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}




export default async function TabHomeComponent({ searchParams }: Props) {
  const resolvedParams = searchParams ? await searchParams : {}
  const category = resolvedParams.category

return (
    // قرار دادن key باعث می‌شود با تغییر category، ریکت متوجه تغییر شود و اسکلتون را دوباره نشان دهد
    <Suspense key={category} fallback={<TabHomeSkeleton />}>
      <DataFetcher category={category} />
    </Suspense>
  )
}