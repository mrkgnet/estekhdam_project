import { getDataCategory } from '@/actions/category/Actions'
import React from 'react'
import ShowDataCat from './ShowDataCat'

export default async function FetchDataCat() {
  const getDataCat = await getDataCategory()

  return (
    <div>
      <ShowDataCat getDataCat={getDataCat} />
    </div>
  )
}
