// فایل: page.tsx
import React, { Suspense } from "react";
import FetchDataUser from "./FetchDataUser";
import SearchInPage from "@/components/searchInPage/SearchInPage";
import PageHeader from "@/components/ui/PageHeader";
import { ThreeDotsLoader } from "@/components/ui/ThreeDotsLoader"; // ایمپورت لودر جداگانه

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
      <PageHeader
        title={headerTitle}
        subtitle="مشاهده تمامی دوره‌ها و منابع آموزشی در یک نگاه"
        breadcrumbItems={breadcrumbItems}
      >
        <SearchInPage />
      </PageHeader>



      <Suspense key={suspenseKey} fallback={<ThreeDotsLoader />}>
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
