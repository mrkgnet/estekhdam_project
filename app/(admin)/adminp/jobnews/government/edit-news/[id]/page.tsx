import LinearLoader from '@/components/LinearLoader'
import React, { Suspense } from 'react'
import FetchDataEdit from './FetchDataEdit'
import SpinerLoader from '@/components/SpinerLoader'

export default async function page({params} :{params:Promise<{id:string}>}) {
    const {id} = await params
  return (
    <div>
      <Suspense fallback={<SpinerLoader />}>
            <FetchDataEdit id= {id} />
        </Suspense>
    </div>
  )
}
