import React, { Suspense } from 'react';
import FetchTiketDU from './FetchTiketDU';
import { SkeletonUserTicketsLoader } from '@/components/ui/SkeletonLoding/SkeletonUserTicketsLoader';

// ۱. تعریف کامپوننت اسکلتون منطبق با ساختار TicketsListPage


// ۲. کامپوننت اصلی صفحه
export default function page() {
  return (
    <div className="w-full">
      {/* 
        استفاده از Suspense
        تا زمان واکشی دیتای تیکت‌ها توسط FetchTiketDU، 
        اسکلتون بالا نمایش داده می‌شود و تجربه کاربری نرمی (بدون پرش) ایجاد می‌کند.
      */}
      <Suspense fallback={<SkeletonUserTicketsLoader />}>
        <FetchTiketDU />
      </Suspense>
    </div>
  );
}
