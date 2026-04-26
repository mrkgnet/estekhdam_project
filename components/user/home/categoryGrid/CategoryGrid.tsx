import React, { Suspense } from 'react'
import FetchDataCAT from './FetchDataCAT'
import { CategorySkeleton } from '@/components/ui/CategorySkeleton'



export default function CategoryGrid() {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <FetchDataCAT />
    </Suspense>
  )
}
