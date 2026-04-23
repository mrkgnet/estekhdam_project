import React, { Suspense } from 'react'
import FetchDataByCat from './FetchDataByCat'
import LinearLoader from '@/components/LinearLoader'
import PageHeader from "@/components/ui/PageHeader";
import SearchInPage from "@/components/searchInPage/SearchInPage";

export default async function page({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ query?: string, page?: string }> 
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  // دریافت پارامترهای سرچ و پجینیشن
  const paramsData = await searchParams;
  const currentPage = Number(paramsData?.page) || 1;
  const searchQuery = paramsData?.query || "";
  const limit = 10;

  // کلید برای رفرش شدن Suspense هنگام تغییر سرچ یا صفحه
  const suspenseKey = `${decodedSlug}-${searchQuery}-${currentPage}`;

  // تنظیمات بردکرامب و هدر
  const breadcrumbItems = [
    { label: "دسته بندی ها", href:  `` }, // مسیر پایه محصولات (در صورت نیاز تغییر دهید)
    { label: decodedSlug, href: `` }
  ];

  return (
    <main className="w-full min-h-screen py-2 overflow-hidden font-sans bg-gray-50/30" dir="rtl">
      
      {/* هدر ثابت شامل بردکرامب، تایتل و سرچ */}
      <PageHeader
        title={`محصولات ${decodedSlug}`}
        subtitle="مشاهده و جستجو در محصولات این دسته‌بندی"
        breadcrumbItems={breadcrumbItems}
      >
        <SearchInPage placeholder="جستجوی محصول در این دسته..." />
      </PageHeader>

      <Suspense key={suspenseKey} fallback={<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8"><LinearLoader /></div>}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FetchDataByCat 
             slug={decodedSlug} 
             searchQuery={searchQuery}
             currentPage={currentPage}
             limit={limit}
          />
        </div>
      </Suspense>

    </main>
  )
}
