// app/(user)/resources/questions/page.tsx

import LinearLoader from '@/components/LinearLoader'
import React, { Suspense } from 'react'
import FetchDataQues from './FetchDataQues'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{
    pid?: string
    pname?: string
    step?: string
    chapterId?: string
    questionType?: string
  }>
}) {

  const { pid, pname, step, chapterId, questionType } = await searchParams

  if (!pid) {
    return (
      <div className="min-h-[70vh] max-w-5xl mx-auto flex flex-col items-center justify-center bg-slate-50 text-slate-500 space-y-4 px-4 text-center">
        <AlertCircle className="w-16 h-16 text-slate-300 mb-2" />
        <p className="text-lg font-medium text-slate-700">شناسه محصول نامعتبر است</p>
        <p className="text-sm text-slate-500 max-w-md">لطفاً از طریق صفحه منابع اقدام به ورود به این بخش کنید.</p>
        <Link href={`/resources/course/${pname}`} className="mt-6 px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors shadow-sm font-medium">
          بازگشت به  منابع
        </Link>
      </div>
    );
  }

 function SkeletonQuesPage() {
  return (
    <div className="min-h-screen max-w-6xl text-bodyall m-auto text-right pb-24 lg:pb-8" dir="rtl">
      {/* Breadcrumb */}
      <div className="mt-4">
        <div className="h-10 w-56 bg-slate-200 rounded-xl animate-pulse" />
      </div>

      <div className="mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Sidebar Skeleton */}
        <aside className="w-full lg:w-[300px] xl:w-[320px] lg:sticky lg:top-6 flex flex-col gap-3 shrink-0 z-20">
          <div className="flex text-10 gap-2">
            <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse" />
            <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse" />
          </div>

          <div className="hidden lg:flex z-20 items-center justify-between w-full px-2 py-3 bg-slate-100 rounded-xl">
            <div className="h-5 w-28 bg-slate-200 rounded animate-pulse" />
          </div>

          <div className="bg-white rounded shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
            {/* Section 1 */}
            <div className="p-4 border-b border-slate-200/60">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="p-3 space-y-2 bg-slate-50/50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-9 w-full bg-slate-200 rounded-lg animate-pulse" />
              ))}
            </div>

            {/* Section 2 */}
            <div className="p-4 border-t border-slate-200/60">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="p-3 space-y-2 bg-slate-50/50">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </aside>

        {/* Main Skeleton */}
        <main className="w-full flex-1 flex flex-col min-w-0 pb-10">
          {/* Header */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200/60 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-2xl animate-pulse" />
                <div>
                  <div className="h-4 w-32 bg-slate-200 rounded mb-2 animate-pulse" />
                  <div className="h-3 w-48 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="w-14 h-14 bg-slate-200 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 sm:p-8">
            <div className="h-4 w-3/4 bg-slate-200 rounded mb-6 animate-pulse" />

            <div className="space-y-3.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 w-full bg-slate-200 rounded-xl animate-pulse"
                />
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="h-4 w-32 bg-slate-200 rounded mb-3 animate-pulse" />
              <div className="h-20 w-full bg-slate-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4 items-center justify-between w-full max-w-lg mx-auto lg:max-w-none">
            <div className="h-12 flex-1 bg-slate-200 rounded-xl animate-pulse" />
            <div className="h-12 flex-1 bg-slate-200 rounded-xl animate-pulse" />
          </div>

          {/* Comments Box */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 sm:p-8 mt-6 mb-16 lg:mb-0">
            <div className="h-4 w-24 bg-slate-200 rounded mb-4 animate-pulse" />
            <div className="h-24 w-full bg-slate-200 rounded animate-pulse" />
          </div>
        </main>
      </div>
    </div>
  );
}
  const currentStep = Number(step) || 1

  return (
    <div>
      <Suspense fallback={<SkeletonQuesPage />}>
        <FetchDataQues
          pid={pid}
          pname={pname}
          currentStep={currentStep}
          chapterId={chapterId}
          questionType={questionType}
        />
      </Suspense>
    </div>
  )
}
