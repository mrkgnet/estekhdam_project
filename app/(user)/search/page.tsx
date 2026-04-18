import React from 'react'
import FetchDataSearch from './FetchDataSearch'

export default async function page({searchParams} :{searchParams:Promise<{[key:string] :string | string [] | undefined}>}) {
   const resolvedSearchParams  = await searchParams  
     const q = resolvedSearchParams.q;
  return (
    <div>
       
        <FetchDataSearch query = {q} /> 
    </div>
  )
}
