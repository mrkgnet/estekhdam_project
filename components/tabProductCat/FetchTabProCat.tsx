import React from 'react';
import { productByCatAction } from '@/actions/user/home/productAndCategories/fetchProductByCat/Actions';
import { unstable_noStore as noStore } from 'next/cache';
import CategoriesSliderContainer from './CategoriesSliderReactQueryContainer';

export default async function FetchTabProCat() {
  // غیرفعال کردن کش Next.js برای این کامپوننت
  noStore();
  
  const response = await productByCatAction();

  // اگر دیتایی نبود یا آرایه خالی بود
  if (!response?.success || !response?.data || response.data.length === 0) {
    return <div className="text-center p-4 text-slate-500 font-medium">هیچ دسته‌بندی یافت نشد.</div>;
  }

  return (
    // دیتای اولیه رو به کلاینت کامپوننت جدیدمون می‌دیم
    <CategoriesSliderContainer initialData={response.data} />
  );
}