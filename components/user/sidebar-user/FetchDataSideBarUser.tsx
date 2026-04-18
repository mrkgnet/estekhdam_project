import { getDataMenuClient } from '@/actions/admin/manage-menu/Actions'
import React from 'react'
import ShowDataSideBarUser from './ShowDataSideBarUser'

export default async function FetchDataSideBarUser() {
const response = await getDataMenuClient()
  return (
    <ShowDataSideBarUser response = {response} />
  )
}
