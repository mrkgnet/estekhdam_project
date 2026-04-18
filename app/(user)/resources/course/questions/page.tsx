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
  console.log(pname)

  if (!pid) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 text-slate-500 space-y-4 px-4 text-center">
        <AlertCircle className="w-16 h-16 text-slate-300 mb-2" />
        <p className="text-lg font-medium text-slate-700">شناسه محصول نامعتبر است</p>
        <p className="text-sm text-slate-500 max-w-md">لطفاً از طریق صفحه منابع اقدام به ورود به این بخش کنید.</p>
        <Link href="/resources" className="mt-6 px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors shadow-sm font-medium">
          بازگشت به لیست منابع
        </Link>
      </div>
    );
  }

  const currentStep = Number(step) || 1

  return (
    <div>
      <Suspense fallback={<LinearLoader />}>
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
