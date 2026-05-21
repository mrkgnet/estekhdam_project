import LinearLoader from '@/components/LinearLoader'
import React, { Suspense } from 'react'
import FetchData from './FetchData'
import DotsLoader from '@/components/ui/Loading/DotsLoader'

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { id } = await params;
  const { page, search } = await searchParams;

  return (
    <div>
      <Suspense fallback={<DotsLoader />}>
        <FetchData id={id} page={page} search={search} />
      </Suspense>
    </div>
  );
}
