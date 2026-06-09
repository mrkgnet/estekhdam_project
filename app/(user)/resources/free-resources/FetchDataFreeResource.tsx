import React, { Suspense } from 'react';
import ShowDataFreeResource from './ShowDataFreeResource';
import { getDataCategory } from '@/actions/category/Actions';
import { fetchFreeResources } from '@/actions/user/resources/free-resources/fetch/Actions';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function FetchDataFreeResource({ searchParams }: Props) {
  const categoryParam = searchParams.category;
  const pageParam = searchParams.page;

  // 🟢 استخراج شماره صفحه از URL (پیش‌فرض: ۱)
  const currentPage = typeof pageParam === 'string' && !isNaN(Number(pageParam)) 
    ? Math.max(1, Number(pageParam)) 
    : 1;

  // 🟢 دیکد کردن اسلاگ‌های دسته‌بندی
  const activeSlugs = (
    Array.isArray(categoryParam) 
      ? categoryParam 
      : typeof categoryParam === 'string' && categoryParam.trim() !== ''
      ? [categoryParam] 
      : []
  ).map((slug) => decodeURIComponent(slug));

  const itemsPerPage = 12;

  // 🟢 دریافت موازی دسته‌بندی‌ها و محصولات (با شماره صفحه)
  const [categoryResponse, productsResponse] = await Promise.all([
    getDataCategory("FREE_RESOURCE"),
    fetchFreeResources(activeSlugs, currentPage, itemsPerPage)
  ]);

  const categories = categoryResponse.success ? categoryResponse.data : [];
  const products = productsResponse.success ? productsResponse.data : [];
  const totalCount = productsResponse.success ? productsResponse.totalCount : 0;

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px] text-gray-500 font-bold">
        در حال بارگذاری منابع...
      </div>
    }>
      <ShowDataFreeResource 
        initialCategories={categories} 
        initialProducts={products}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        itemsPerPage={itemsPerPage}
      /> 
    </Suspense>
  );
}
