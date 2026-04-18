import { getDataCategory } from '@/actions/category/Actions'
import React from 'react'
import ShowDataCat from './ShowDataCat'
import { getDataMenuClient } from '@/actions/admin/manage-menu/Actions'

export default async function FetchDataCat() {
    const getDataCat = await getDataMenuClient()
    
  return (
    <div>
    <ShowDataCat getDataCat={getDataCat}  />  
    </div>
  )
}
