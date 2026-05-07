import React, { Suspense } from 'react'
import FetchDataMainSlider from './FetchDataMainSlider'
import { Loader2 } from 'lucide-react';


const SpinnerLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[300px] gap-3 text-slate-400  rounded border border-slate-200">
      <Loader2 className="w-10 h-10 animate-spin text-[#2b5c9e]" />
      <span className="text-sm">در حال بارگذاری...</span>
    </div>
  );
};



export default function MainSliderComponent() {
  return (
    // 🟢 تغییر ۲: اضافه کردن h-full به این دیو (یا می‌توانید کلاً آن را حذف کرده و از <>...</> استفاده کنید)
    <div className="h-full">
       <Suspense fallback={<SpinnerLoader />}>
        <FetchDataMainSlider />
      </Suspense>
    </div>
  )
}
