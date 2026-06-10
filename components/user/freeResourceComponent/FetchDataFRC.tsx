import React from 'react'
import { getFreeResourceCategoriesAction } from '@/actions/user/home/freeRresourceCat/Actions'
import FreeResourceComponent from './FreeResourceComponent'

export default async function FetchDataFRC() {
  const response = await getFreeResourceCategoriesAction();

  // اگر دریافت اطلاعات با مشکل مواجه شد یا دیتایی نبود، چیزی رندر نمی‌کنیم
  if (!response?.success || !response.data) {
    return null; 
  }

  return (
    // پاس دادن دیتای واقعی دیتابیس به کامپوننت
    <FreeResourceComponent categories={response.data} />
  )
}