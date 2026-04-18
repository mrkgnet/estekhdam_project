import { getDataSearchMany } from '@/actions/search/Actions'
import React from 'react'
import ShowDataSearch from './ShowDataSearch'

export default async function FetchDataSearch({ query }: { query: string }) {
  const response = await getDataSearchMany(query);

  return (
    <>
      {/* پاس دادن دیتا و کلمه سرچ شده به کامپوننت کلاینت */}
      <ShowDataSearch response={response} query={query} /> 
    </>
  )
}
