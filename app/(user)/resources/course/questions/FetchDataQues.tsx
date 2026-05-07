import { fetchDataQues } from '@/actions/user/resources/course/DataQues/Actions'
import React from 'react'
import Link from 'next/link'
import { FileQuestion, Home } from 'lucide-react'
import ExamPage from './ShowDataQues'

export default async function FetchDataQues({
  pid,
  pname,
  currentStep,
  chapterId,
  questionType
}: {
  pid: string
  pname?: string
  currentStep: number
  chapterId?: string,
  questionType?: string
}) {

  // واکشی داده‌های اولیه از سرور
  const response = await fetchDataQues(pid, currentStep, chapterId , questionType)

  if (!response?.data && !response?.success) {
    return (
      <div className="flex flex-col max-w-5xl mx-auto items-center justify-center gap-4 text-center p-12 bg-white border border-slate-200/80 rounded shadow-sm my-6">
        <div className="p-4 bg-slate-100 rounded-full">
          <FileQuestion className="w-12 h-12 text-slate-400" />
        </div>

        <h3 className="text-xl font-bold text-slate-600 mt-2">
          {response?.message || "سوالی یافت نشد"}
        </h3>

        <Link
          href={`/resources/course/${pname}`} 
          className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-slate-700 transition-colors shadow-lg shadow-slate-800/20 text-sm"
        >
          <Home className="w-4 h-4" />
          <span>بازگشت به صفحه دوره</span>
        </Link>
      </div>
    )
  }

  return (
    <ExamPage
      initialResponse={response} // کل دیتای سرور
      courseId={pid}
      currentStep={currentStep}
      chapterId={chapterId}
      questionType={questionType}
      pname={pname || ""}
    />
  )
}
