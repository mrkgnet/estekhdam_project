import React from 'react'
import ShowDataUTA from './ShowDataUTA'
import { fetchDataUTAAction } from '@/actions/admin/support/fetchUnique/Actions'

// تغییر ticketID به ticketId
export default async function FetchDataUTA({ ticketId }: { ticketId: string }) {
    
  // واکشی دیتای تیکت
  const response = await fetchDataUTAAction(ticketId);

  return (
    <div className="w-full">
      <ShowDataUTA response={response} />
    </div>
  )
}
