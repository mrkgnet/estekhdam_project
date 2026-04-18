import React, { Suspense } from 'react';
import FetchDataNotification from './FetchDataNotification';
import { Loader2 } from 'lucide-react';

// ۱. مشکل رندر نشدن اسپینر با اضافه کردن کلمه return حل شد
function LoaderSpinner() {
  return (
    <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center w-full h-full bg-white/60 backdrop-blur-[2px] gap-3 text-slate-600 transition-all duration-300">
      <Loader2 className="w-10 h-10 animate-spin text-[#2b5c9e]" />
      <span className="text-sm font-medium">در حال دریافت اطلاعات...</span>
    </div>
  );
}

export default function Page() {
  return (
    // ۲. استفاده از Suspense و پاس دادن اسپینر به عنوان fallback
    <Suspense fallback={<LoaderSpinner />}>
      <FetchDataNotification />
    </Suspense>
  );
}
