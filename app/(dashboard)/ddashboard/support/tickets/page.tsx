import React, { Suspense } from "react";
import FetchTiketDU from "./FetchTiketDU";
import { SkeletonUserTicketsLoader } from "@/components/ui/SkeletonLoding/SkeletonUserTicketsLoader";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  return (
    <div className="w-full">
      {/* 
        حذف key باعث می‌شود هنگام تغییر صفحه، Suspense کل صفحه را به اسکلتون تبدیل نکند
        و اجازه دهد useTransition لودینگ محلی را مدیریت کند.
      */}
      <Suspense fallback={<SkeletonUserTicketsLoader />}>
        <FetchTiketDU page={currentPage} />
      </Suspense>
    </div>
  );
}