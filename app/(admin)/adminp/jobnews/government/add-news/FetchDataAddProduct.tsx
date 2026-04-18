import { fetchDataProduct } from '@/actions/admin/products/government/Actions'
import React from 'react'
import CreateNews from './ShowDataAddProduct'

export default async function FetchDataAddProduct() {
    const data = await  fetchDataProduct()
    const products = data?.products || []
    
  return (
    <div>
      <CreateNews getDataProduct = {products} />
    </div>
  )
}
