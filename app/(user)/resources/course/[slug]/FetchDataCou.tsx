import { fetchDataResource } from '@/actions/user/resources/course/fetchData/Actions'
import React from 'react'
import ExamDetailsPage from './ShowDataCou'

export default async  function FetchDataCou({slugValue} :{slugValue:string}) {
  const fetchDataR = await fetchDataResource(slugValue)
  return (
    <div>
      <ExamDetailsPage  fetchDataR = {fetchDataR}  />
    </div>
  )
}
