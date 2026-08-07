import LinearLoader from '@/components/LinearLoader'
import React, { Suspense } from 'react'
import FetchData from './FetchData'
import SpinerLoader from '@/components/SpinerLoader';

export default async function page({ searchParams }: { searchParams: Promise<{ page?: string; query?: string }> }) {
  const params = await searchParams
  const currentPage = Number(params?.page) || 1;
  const searchQuery = params?.query || "";
  const limit = 10;


  return (
    <div>
      
        <FetchData currentPage={currentPage} searchQuery={searchQuery} limit={limit} />
      
    </div>
  )
}
