import LinearLoader from '@/components/LinearLoader'
import React, { Suspense } from 'react'
import FetchData from './FetchData'
import DotsLoader from '@/components/ui/Loading/DotsLoader'

export default async function page({params} :{params:Promise<{id:string}>}) {
    const {id} = await params
  
  return (
    <div>
      
        <Suspense fallback={<DotsLoader />}>
            <FetchData id= {id} />
        </Suspense>
    </div>
  )
}
