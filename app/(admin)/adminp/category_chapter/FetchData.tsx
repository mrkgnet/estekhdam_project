import { fetchCategoryChapter } from '@/actions/admin/category_chapter/fetch/Action'
import React from 'react'
import ShowData from './ShowData'

export default async function FetchData() {
  const response = await fetchCategoryChapter()
  
  if (!response.success) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 text-red-800 border border-red-200 p-4 rounded-lg">
            {response.message}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <ShowData initialCategories={response.data} />
    </div>
  )
}
