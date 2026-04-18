import { getDataCategory } from '@/actions/category/Actions'
import React from 'react'
import CreateProductPage from './ShowData'

export default async function FetchData() {
    const dataCategory = await getDataCategory()
  
  return (
    <div>
      <CreateProductPage  dataCategory = {dataCategory}  />
    </div>
  )
}
