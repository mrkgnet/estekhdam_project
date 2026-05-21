export const dynamic = "force-dynamic"; // 👈 این خط را اضافه کنید

import { getAllNotifications } from '@/actions/notification/getAllNotif/Actions'
import React from 'react'
import NotificationsPage from './ShowDataNotification'

export default async function FetchDataNotification() {
    // گرفتن اطلاعات در سمت سرور
    const response = await getAllNotifications();
    
    // ارسال اطلاعات به سمت کلاینت
    return (
        <NotificationsPage response={response} />
    )
}
