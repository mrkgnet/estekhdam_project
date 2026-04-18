
import { fetchDataNewsGovAction } from '@/actions/admin/jobnews/government/Actions'
import React from 'react'
import ShowData from './ShowData'

export default async function FetchDataJobNews() {
  const jobNewsData = await fetchDataNewsGovAction()
  return (
    <div>
      <ShowData jobNewsData={jobNewsData} />
    </div>
  )
}
