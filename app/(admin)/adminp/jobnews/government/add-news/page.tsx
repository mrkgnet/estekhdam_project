import React, { Suspense } from 'react'
import FetchDataAddProduct from './FetchDataAddProduct'
import LinearLoader from '@/components/LinearLoader'
import SpinerLoader from '@/components/SpinerLoader'

export default function page() {
  return (
    <div>
      <Suspense fallback={<SpinerLoader />}>
        <FetchDataAddProduct />
      </Suspense>
    </div>
  )
}
