import React, { Suspense } from "react";
import FetchDataUser from "./FetchDataUser";
import { ShowDataResourcesSkeleton } from "@/components/ui/ShowDataResourcesSkeleton";
import SearchInPage from "@/components/searchInPage/SearchInPage";
import PageHeader from "@/components/ui/PageHeader";

export default async function page({ searchParams }: { searchParams: Promise<{ query?: string, category?: string, page?: string }> }) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const searchQuery = params?.query || "";
  const categoryQuery = params?.category || "";
  const limit = 10;

  const suspenseKey = `${searchQuery}-${currentPage}-${categoryQuery}`;

  const breadcrumbItems = [
    { label: "منابع آموزشی", href: "/resources" },
     { label: categoryQuery, href: `` }
  ];

  const headerTitle = categoryQuery ? `منابع ${categoryQuery}` : "جدیدترین منابع";

  return (
    <main className="w-full min-h-screen py-2 overflow-hidden font-sans bg-gray-50/30" dir="rtl">

      {/* هدر ثابت شامل بردکرامب، تایتل و سرچ */}
      <PageHeader
        title={headerTitle}
        subtitle="مشاهده تمامی دوره‌ها و منابع آموزشی در یک نگاه"
        breadcrumbItems={breadcrumbItems}
      >
        <SearchInPage />
      </PageHeader>

      {/* محتوای لیست داده‌ها داخل Suspense */}
      <Suspense key={suspenseKey} fallback={<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><ShowDataResourcesSkeleton /></div>}>
        <FetchDataUser
          currentPage={currentPage}
          searchQuery={searchQuery}
          categoryQuery={categoryQuery}
          limit={limit}
        />
      </Suspense>
    </main>
  );
}
