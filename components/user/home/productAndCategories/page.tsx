import React, { Suspense } from 'react';
import FetchDataProductAndCat from './FetchDataProductAndCat';
import { LatestProductSkeleton_Server } from '@/components/ui/SkeletonLoding/LatestProductSkeleton_Server';

// تایپ پراپ‌ها را مشخص می‌کنیم (اگر از تایپ‌اسکریپت استفاده می‌کنید)
export interface TabType {
  catName: string;
  catSlug: string;
}

interface ProductAndCategoriesProps {
  title: string;
  tabs: TabType[];
  defaultTab: string;
}

// 1. طراحی کامپوننت اسکلتون لودینگ (بدون تغییر)

// 2. کامپوننت اصلی
export default function ProductAndCategories({ title, tabs, defaultTab }: ProductAndCategoriesProps) {
  return (
    <div className="w-full">
      <Suspense fallback={<LatestProductSkeleton_Server />}>
        {/* پاس دادن پراپ‌ها به کامپوننت سروری */}
        <FetchDataProductAndCat title={title} tabs={tabs} defaultTab={defaultTab} />
      </Suspense>
    </div>
  );
}
