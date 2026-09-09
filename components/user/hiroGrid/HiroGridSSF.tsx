import React from 'react'
import HiroGrid from './HiroGrid'
import { getRootCategoriesWithChildrenAction } from '@/actions/category/Actions'

export default async function HiroGridSSF() {
  const response = await getRootCategoriesWithChildrenAction()

  if (!response.success || !response.data || response.data.length === 0) {
    return (
      <div className="w-full text-center py-10 text-slate-500 text-sm">
        دسته‌بندی اصلی یافت نشد.
      </div>
    )
  }

  return (
    <main>
      <HiroGrid data={response.data} />
    </main>
  )
}