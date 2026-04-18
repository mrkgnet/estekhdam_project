// کامپوننت والد
import { fetchUniqTicketUserAction } from '@/actions/user/dashboard/support/fetch/[id]/Actions'
import React from 'react'
import ShowDataT from './ShowDataT'

export default async function FetchDataT({ ticketID }: { ticketID: string }) {
  // ارسال آیدی تیکت به سرور اکشن
  const response = await fetchUniqTicketUserAction(ticketID);
  
  return (
    <div>
      <ShowDataT response={response} /> 
    </div>
  )
}
