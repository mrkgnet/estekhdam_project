import DotsLoader from '@/components/ui/Loading/DotsLoader'
import React, { Suspense } from 'react'
import FetchData from './FetchData'

export default function page() {
  return (
    <Suspense fallback={<DotsLoader />}>
      <FetchData  />
    </Suspense>
  )
}
