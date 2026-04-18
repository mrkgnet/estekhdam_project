import { fetchDataROUAction } from '@/actions/user/dashboard/recentorder/Fetch/Actions'
import React from 'react'
import ShowDataROD from './ShowDataROD'

export default async function FetchDataROD() {
    const response = await fetchDataROUAction()
  return (
    <div>
      <ShowDataROD response = {response} />
    </div>
  )
}
