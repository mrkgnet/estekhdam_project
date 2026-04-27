import React, { Suspense } from 'react';
import FetchDataT from './FetchDataT';
import { SkeletonTicketDetailsLoader } from '@/components/ui/SkeletonLoding/SkeletonTicketDetailsLoader';

// ۱. تعریف کامپوننت اسکلتون منطبق با ساختار ShowDataT


// ۲. کامپوننت اصلی صفحه (مبتنی بر Next.js Server Components)
export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="w-full">
      {/* 
        استفاده از Suspense
        اسکلتون طراحی شده بلافاصله لود می‌شود تا زمانی که 
        کامپوننت FetchDataT داده‌های اصلی تیکت را از سرور دریافت کند.
      */}
      <Suspense fallback={<SkeletonTicketDetailsLoader />}>
        <FetchDataT ticketID={id} />
      </Suspense>
    </div>
  );
}
