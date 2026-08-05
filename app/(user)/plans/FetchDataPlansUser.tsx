import { GetDataPlansUser } from '@/actions/admin/plans/Actions'
import React from 'react'
import ShowDataPlansUser from './ShowDataPlansUser'

export default async function FetchDataPlansUser() {
    const response = await GetDataPlansUser()
  return (
   <ShowDataPlansUser initials = {response } /> 
  )
}
