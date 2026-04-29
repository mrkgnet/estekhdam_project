import React, { Suspense } from 'react';
import FetchDataSLTL from './FetchDataSLTL'; // کامپوننت شما برای دریافت داده
import { SliderSkeleton } from '@/components/ui/SkeletonLoding/SliderSkeleton';

export default function SliderTopLeftComponent() {
  return (
    // ارتفاع کانتینر را برای جلوگیری از پرش حفظ کنید
    <div className=""> {/* ارتفاع تقریبی کامپوننت نهایی */}
      <Suspense fallback={<SliderSkeleton />}>
        {/* این کامپوننت async است و داده‌ها را fetch می‌کند */}
        <FetchDataSLTL />
      </Suspense>
    </div>
  );
}
