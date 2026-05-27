import { getDataGlobalNotificationUserAction } from '@/actions/notification/global-notification/user/fetch/Actions'
import React from 'react'
import NotificationBell from './NotificationBell'

export default async function FetchData() {
    const response = await getDataGlobalNotificationUserAction()
    return (
        <NotificationBell />
    )
}
