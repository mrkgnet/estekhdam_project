import LinearLoader from '@/components/LinearLoader'
import React, { Suspense } from 'react'
import FetchData from './FetchData'

export default async function page({params} :{params:Promise<{id:string}>}) {
    const {id} = await params
  
  return (
    <div>
      
        <Suspense fallback={<LinearLoader />}>
            <FetchData id= {id} />
        </Suspense>
    </div>
  )
}
