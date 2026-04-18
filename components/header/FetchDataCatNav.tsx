import { getDataCategory } from '@/actions/category/Actions'
import React from 'react'
import Navbar from './HeaderTop'
import HeaderTop from './HeaderTop'

export default async function FetchDataCatNav() {
    const response = await getDataCategory()
    const resultCat = response?.data || []
  return (
   
      <HeaderTop response = {resultCat} />
    
  )
}
