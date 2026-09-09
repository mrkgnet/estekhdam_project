import React, { Suspense } from 'react'
import HiroGrid from './HiroGrid'
import { getRootCategoriesWithChildrenAction } from '@/actions/category/Actions'

async function CategoryFetcher() {
  const response = await getRootCategoriesWithChildrenAction()

  if (!response.success || !response.data || response.data.length === 0) {
    return (
      <div className="w-full text-center py-10 text-slate-500 text-sm">
        دسته‌بندی اصلی یافت نشد.
      </div>
    )
  }

  return <HiroGrid data={response.data} />
}

export function HiroGridSkeleton() {
  return (
    <section aria-label="در حال بارگذاری دسته‌بندی‌ها" className="w-full mx-auto px-2 py-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-start">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-xs animate-pulse"
          >
            <div className="aspect-[4/3] max-h-28 sm:max-h-36 w-full p-2 flex items-center justify-center">
              <div className="w-full h-full bg-slate-200 rounded" />
            </div>

            <div className="px-2 py-1.5 my-1 flex flex-col items-center gap-1.5">
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
              <div className="h-3 w-1/2 bg-slate-100 rounded" />
            </div>

            <div className="w-full py-1.5 px-2 flex items-center justify-between bg-slate-50 border-t border-slate-100">
              <div className="h-4 w-20 bg-slate-200 rounded-full" />
              <div className="h-3.5 w-3.5 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function HiroGridSSF() {
  return (
    <main className="w-full">
      <Suspense fallback={<HiroGridSkeleton />}>
        <CategoryFetcher />
      </Suspense>
    </main>
  )
}