import React, { Suspense } from 'react'
import TabHomePage, { CategorySkeleton } from './TabHomePage'
import { GetCategoriDataAction } from '@/actions/category/Actions'

type Props = {
  category: string
}

async function DataFetcher({ category }: Props) {
  // فراخوانی اکشن سروری جهت واکشی اطلاعات
  const data = await GetCategoriDataAction(category)

  return <TabHomePage initialData={data} />
}

export default function TabHomeFetchData({ category }: Props) {
  return (
    <Suspense
      fallback={
        <div dir="rtl" className="w-full max-w-6xl mx-auto p-4 font-sans">
          <div className="bg-[#FCE3E8] border border-[#AF0F12] p-4 sm:p-6 rounded-xl">
            <CategorySkeleton />
          </div>
        </div>
      }
    >
      <DataFetcher category={category} />
    </Suspense>
  )
}