import React from 'react';
import ShowDataFreeResource from './ShowDataFreeResource';
import { getDataCategory } from '@/actions/category/Actions';

export default async function FetchDataFreeResource() {
  // ارسال نوع دسته بندی به تابع
  const response = await getDataCategory("FREE_RESOURCE");
  
  // استخراج داده‌ها (اگر خطایی بود یک آرایه خالی پاس می‌دهیم تا صفحه نشکند)
  const categories = response.success ? response.data : [];

  return (
    <ShowDataFreeResource initialCategories={categories} /> 
  );
}