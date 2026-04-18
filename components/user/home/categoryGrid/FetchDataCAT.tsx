import React from 'react'
import ShowDataCAT from './ShowDataCAT'
import { getDataCategory } from '@/actions/category/Actions'

export default async function FetchDataCAT() {
  
    const response = await getDataCategory()
  
    return (
    <div>
      <ShowDataCAT response = {response} />
    </div>
  )
}
