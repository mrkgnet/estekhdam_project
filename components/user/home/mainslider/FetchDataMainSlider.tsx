import React, { Suspense } from "react";
import { fetchMainSliderUserAction } from "@/actions/user/mainslider/fetch/Actions";
import ShowMainSlider from "./ShowMainSlider";

export default function FetchDataMainSlider() {
  return (
    <Suspense fallback={<MainSliderFallback />}>
      <MainSliderFetcher />
    </Suspense>
  );
}

// کامپوننت سروری داخلی جهت استریم داده از سرور
async function MainSliderFetcher() {
  const response = await fetchMainSliderUserAction();

  if (!response?.data || response.data.length === 0) {
    return null;
  }

  return <ShowMainSlider initialSliders={response} />;
}

// فالبک هماهنگ با ارتفاع اسلایدر برای جلوگیری از پرش چیدمان (CLS)
function MainSliderFallback() {
  return (
    <div
      className="w-full h-full min-h-[190px] md:min-h-[260px] bg-slate-50/80 animate-pulse flex items-center justify-center"
      dir="rtl"
    >
      <div className="flex items-center gap-2 text-slate-400 text-xs md:text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        در حال بارگذاری اطلاعیه‌ها...
      </div>
    </div>
  );
}