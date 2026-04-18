import LinearLoader from '@/components/LinearLoader'
import React, { Suspense } from 'react'
import FetchData from './FetchData'
import SpinerLoader from '@/components/SpinerLoader';

export default async function page({ 
  searchParams 
}: { 
  searchParams: Promise<{ query?: string; page?: string; unread?: string }> 
}) {
  // در Next.js 15+ آبجکت searchParams باید await شود
  const resolvedParams = await searchParams;
  
  const query = resolvedParams?.query || "";
  const currentPage = Number(resolvedParams?.page) || 1;
  const unreadOnly = resolvedParams?.unread === "true";
  const limit = 10;

  return (
    <div>
      <Suspense fallback={<SpinerLoader />}>
        <FetchData 
           currentPage={currentPage} 
           query={query} 
           limit={limit} 
           unreadOnly={unreadOnly} 
        />
      </Suspense>
    </div>
  )
}
