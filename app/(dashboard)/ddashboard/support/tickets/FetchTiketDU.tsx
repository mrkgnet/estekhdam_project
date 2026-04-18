// FetchTiketDU.tsx
import { fetchTicketUserAction } from '@/actions/user/dashboard/support/fetch/Actions'
import React from 'react'
import TicketsListPage from './ShowDataDU' // یا هر اسمی که فایل نمایشی دارد

export default async function FetchTiketDU() {
  const response = await fetchTicketUserAction()
  
  return (
    <div>
      <TicketsListPage response={response} />
    </div>
  )
}
