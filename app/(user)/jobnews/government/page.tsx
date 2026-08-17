import React, { Suspense } from 'react';
// 👈 نام درست فایل ایمپورت شد
import { SkeletonNewsList } from '@/components/ui/SkeletonNewsList';
import PageHeader from '@/components/ui/PageHeader';
import SearchInPage from '@/components/searchInPage/SearchInPage';
import FetchNewsData from './FetchData';

export default async function page({ 
  searchParams 
}: { 
  searchParams: Promise<{ page?: string; query?: string; regions?: string; statuses?: string }> 
}) {

  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const searchQuery = params?.query || "";
  const regionsQuery = params?.regions || "";
  const statusesQuery = params?.statuses || "";
  const limit = 10;

  // 🟢 کلید ساسپنس: باعث می‌شود با هر تغییر در URL، اسکلتون دوباره رندر شود
  const suspenseKey = `${searchQuery}-${currentPage}-${regionsQuery}-${statusesQuery}`;

  // 🟢 تنظیمات بردکرامب
  const breadcrumbItems = [
    { label: "اخبار استخدامی دولتی", href: "/jobnews/government" },
  ];

  return (
    <main className="w-full min-h-screen py-2 overflow-hidden font-sans bg-gray-50/30" dir="rtl">
      
      {/* 🟢 هدر یکپارچه مشابه صفحه منابع */}
      <PageHeader
        title="اخبار استخدامی دولتی"
       
        breadcrumbItems={breadcrumbItems}
      >
        <SearchInPage />
      </PageHeader>

      {/* 🟢 استفاده از Suspense با key مشخص */}
      <Suspense key={suspenseKey} fallback={<div className="w-full max-w-7xl mx-auto px-4"><SkeletonNewsList /></div>}>
        <FetchNewsData 
          currentPage={currentPage} 
          searchQuery={searchQuery} 
          limit={limit}  
        />
      </Suspense>
    </main>
  );
}
