import React from 'react'

import ShowDataResources from './ShowDataResources'
import { fetchAllProductDataAction } from '@/actions/user/productsCat/Actions';

type Props = {
  currentPage: number;
  searchQuery: string;
  categoryQuery: string; // <--- اضافه شد
  limit: number;
}

export default async function FetchDataUser({ currentPage, searchQuery, categoryQuery, limit }: Props) {
  const response = await fetchAllProductDataAction(currentPage, limit, searchQuery, categoryQuery);


  if (!response?.success || !response?.data) {
    return (
      <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
        {response?.message || "خطایی در دریافت اطلاعات رخ داد."}
      </div>
    )
  }

  return (
    <div>
      <ShowDataResources
        response={response.data}
        totalPages={response.totalPages || 1}
        currentPage={currentPage}
        title ={categoryQuery}
      />
    </div>
  )
}
