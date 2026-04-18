import React, { Suspense } from 'react'
import FetchDataCart from './FetchDataCart'
import SpinerLoader from '@/components/SpinerLoader'

export default async function page({ params }: { params: Promise<{ id: string }>, }) {
  const { id } = await params
  return (
    <div>
    
      <Suspense fallback={<SpinerLoader />}>
         <FetchDataCart pid={id} />
      </Suspense>
    </div>
  )
}
