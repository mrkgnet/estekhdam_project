import React, { Suspense } from 'react'
import FetchDataContact from './FetchDataContact'
import LinearLoader from '@/components/LinearLoader'
import SpinerLoader from '@/components/SpinerLoader'

export default function page() {
  return (

          <div>
            <Suspense fallback={<SpinerLoader />}>
              <FetchDataContact />
            </Suspense>
          </div>
   
  )
}
