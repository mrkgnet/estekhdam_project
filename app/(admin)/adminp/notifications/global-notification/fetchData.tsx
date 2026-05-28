import React from 'react'
import ShowDataGloabalNotification from './showData'
import { getDataGlobalNotificationAction } from '@/actions/notification/global-notification/admin/fetch/Actions'

export const dynamic = "force-dynamic"
export default async function FetchDataGlobalNotification() {
    // واکشی دیتای اولیه از سمت سرور
    const response = await getDataGlobalNotificationAction();
    
    // در صورت موفقیت آمیز بودن، دیتا را استخراج می‌کنیم؛ در غیر این صورت آرایه خالی می‌فرستیم
    const initialNotifications = response.success ? response.data : [];

    return (
        <ShowDataGloabalNotification initialNotifications={initialNotifications} />
    )
}