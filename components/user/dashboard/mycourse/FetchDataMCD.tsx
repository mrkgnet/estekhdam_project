import { fetchDataMDAction } from '@/actions/user/dashboard/mycourse/Fetch/Actionst'
import React from 'react'
import ShowDataMCD from './ShowDataMCD'

export default async function FetchDataMCD() {
    const response = await fetchDataMDAction()
  return (
    <div>
      <ShowDataMCD response = {response } />
    </div>
  )
}
