import React, { Suspense } from 'react'
import FetchTabProCat from './FetchTabProCat'
import DotsLoader from '../ui/Loading/DotsLoader'

export default function TabProductCat() {
  return (
    <div>
      <Suspense  fallback={<DotsLoader />}>
        <FetchTabProCat />
      </Suspense>
    </div>
  )
}
