import LinearLoader from '@/components/LinearLoader'
import React, { Suspense } from 'react'
import FetchData from './FetchData'
import SpinerLoader from '@/components/SpinerLoader'

export default function page() {
  return (
    <div>
      <Suspense fallback={<SpinerLoader />}>
        <FetchData />
      </Suspense>
    </div>
  )
}
