import React, { Suspense } from 'react'
import TabHomePage, { CategorySkeleton } from './TabHomePage'
import { GetCategoriDataAction } from '@/actions/category/Actions'

type Props = {
  searchParams: Promise<{ category?: string }>
}

async function DataFetcher({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const category = resolvedParams.category || 'BuyDeposit'

  // فراخوانی اکشن سروری
  const data = await GetCategoriDataAction(category)

  return <TabHomePage initialData={data} />
}

export default function TabHomeFetchData(props: Props) {
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
      <DataFetcher {...props} />
    </Suspense>
  )
}