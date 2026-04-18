import { fetchDataKPIC } from '@/actions/user/dashboard/kpicard/Actions'
import React from 'react'
import ShowDataKPIC from './ShowDataKPIC'

export default async function FetchDataKPIC() {
    const kpiData = await fetchDataKPIC()
  return (
    <div>
      <ShowDataKPIC kpiData = {kpiData} />
    </div>
  )
}
