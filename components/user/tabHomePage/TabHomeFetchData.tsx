import React, { Suspense } from 'react'
import TabHomePage from './TabHomePage'
import { GetCategoriDataAction } from '@/actions/category/Actions'

type Props = {
  category: string
}

function TabHomeSkeleton() {
  const tabs = [
    { label: 'بانک سوالات', sub: '(درسنامه/تست)' },
    { label: 'دفترچه‌های استخدامی', sub: '(درسنامه/تست)' },
    { label: 'منابع رایگان', sub: '' },
  ]

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto p-2.5 sm:p-4 font-sans">
      <div className="flex flex-wrap items-stretch justify-start gap-1.5 sm:gap-2 relative z-10 -mb-[1px]">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`flex-1 sm:flex-none min-w-0 basis-[30%] sm:basis-auto px-2 sm:px-5 py-2 sm:py-3 rounded-t border text-[11px] xs:text-xs sm:text-sm font-semibold truncate ${
              index === 0
                ? 'bg-[#FCE3E8] text-rose-950 border-[#AF0F12] border-b-[#FCE3E8] relative z-20'
                : 'bg-white/80 text-gray-800 border-[#BEBABA] border-b-[#AF0F12]'
            }`}
          >
            <span className="whitespace-nowrap">{tab.label}</span>
            {tab.sub && <span className="hidden sm:inline"> {tab.sub}</span>}
          </div>
        ))}
      </div>

      <div className="bg-[#FCE3E8] border border-[#AF0F12] p-3 sm:p-6 shadow-sm rounded-b-xl">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`flex flex-col items-center justify-between p-3 sm:p-4 h-36 sm:h-40 md:h-44 bg-white/80 rounded-xl border border-rose-200/60 shadow-sm relative overflow-hidden ${
                index >= 3 ? 'hidden md:flex' : 'flex'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-shimmer" />

              <div className="w-full flex-1 bg-rose-100/50 rounded-lg mb-1.5 sm:mb-2 flex items-center justify-center animate-pulse">
                <div className="w-12 h-12 bg-rose-200/60 rounded-lg" />
              </div>

              <div className="w-full flex flex-col items-center gap-1 mt-0.5 animate-pulse">
                <div className="w-4/5 h-2.5 sm:h-3 bg-rose-200/70 rounded-full" />
                <div className="w-1/2 h-2 sm:h-2.5 bg-rose-200/50 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

async function DataFetcher({ category }: Props) {
  const result = await GetCategoriDataAction(category)
  return <TabHomePage initialData={result?.data || []} />
}

export default function TabHomeFetchData({ category }: Props) {
  return (
    <Suspense fallback={<TabHomeSkeleton />}>
      <DataFetcher category={category} />
    </Suspense>
  )
}

export { TabHomeSkeleton }