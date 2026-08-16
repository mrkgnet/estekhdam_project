import React, { Suspense } from 'react';
import FetchDataKPIC from './FetchDataKPIC';
import { KpiSkeleton } from '@/components/ui/SkeletonLoding/KpiSkeleton';
function SkeletonGrid() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiSkeleton />
      <KpiSkeleton />
    </section>
  );
}

// ۳. استفاده از Suspense در کامپوننت اصلی
export default function KpiGrid() {
  return (
    <div>
      {/* تا زمانی که دیتای FetchDataKPIC لود شود، SkeletonGrid نمایش داده می‌شود */}
      
        <FetchDataKPIC />
     
    </div>
  );
}
