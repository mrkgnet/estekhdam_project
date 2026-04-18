import LinearLoader from '@/components/LinearLoader'
import React, { Suspense } from 'react'
import FetchData from './FetchData'
import FetchDataChapter from './FetchDataChapter'
import SpinerLoader from '@/components/SpinerLoader'

export default async function page({params} :{params:Promise<{id:string}>}) {
    const {id} = await params
  
  return (
    <div>
      
        <Suspense fallback={<SpinerLoader />}>
            <FetchDataChapter id= {id} />
        </Suspense>
    </div>
  )
}
