import React, { Suspense } from 'react';
import FetchDataPU from './FetchDataPU';
import { SkeletonProfileLoader } from '@/components/ui/SkeletonLoding/SkeletonProfileLoader';

// ۱. ساخت کامپوننت اسکلتون مخصوص پروفایل


export default function Page() {
  return (
    <div>
      {/* ۲. احاطه کردن کامپوننت Fetch با Suspense و پاس دادن اسکلتون به fallback */}
      <Suspense fallback={<SkeletonProfileLoader />}>
        <FetchDataPU />
      </Suspense>
    </div>
  );
}
