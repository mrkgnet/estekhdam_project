import React, { Suspense } from 'react'
import ApiHandler from './FetchData'
import LinearLoader from '@/components/LinearLoader'
import FetchDataJobNews from './FetchData'
import SpinerLoader from '@/components/SpinerLoader'

export default function EditNewsPage() {
  return (


 
        <Suspense fallback={<SpinerLoader />}>
            <FetchDataJobNews />
        </Suspense>

  )
}
