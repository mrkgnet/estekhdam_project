// مسیر فرضی: (admin-dashboard)/support/page.tsx
import { fetchDataTicketADAction } from '@/actions/admin/support/fetchAll/Actions'
import React from 'react'
import ShowDataTA from './ShowDataTA'

export default async function FetchDataTA() {
  const response = await fetchDataTicketADAction()
  
  return (
    <div>
      {/* پاس دادن دیتای دریافت شده به کامپوننت نمایش */}
      <ShowDataTA response={response} />
    </div>
  )
}
