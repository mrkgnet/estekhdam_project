import { fetchDataResource } from '@/actions/user/resources/course/fetchData/Actions'
import React from 'react'
import ExamDetailsPage from './ShowDataCou'

export default async function FetchDataCou({ slugValue }: { slugValue: string }) {
  // واکشی داده‌ها در سرور
  const fetchDataR = await fetchDataResource(slugValue);
  
  return (
    <div>
      <ExamDetailsPage initialResponse={fetchDataR} slugValue={slugValue} />
    </div>
  )
}
