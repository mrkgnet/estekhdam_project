// components/ui/Loading/BrandsSkeleton.tsx
import React from "react";

interface Props {
  count?: number;
}

export default function BrandsSkeleton({ count = 8 }: Props) {
  return (
    <div className="relative overflow-hidden rounded bg-transparent w-full py-2" dir="rtl">
      <div className="flex items-center justify-around gap-4 sm:gap-6 px-2 overflow-hidden select-none">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={`brand-skeleton-${index}`}
            className="flex flex-col items-center gap-2.5 shrink-0 w-20 sm:w-24 animate-pulse"
          >
            {/* دایره لوگو هم‌اندازه با BrandsTopHome */}
            <div className="w-16 h-16 sm:w-[76px] sm:h-[76px] md:w-[84px] md:h-[84px] rounded-full bg-slate-200/80 border border-slate-100 shadow-sm flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-slate-300/60" />
            </div>

            {/* نوار شبیه‌ساز عنوان برند */}
            <div className="h-3 w-14 sm:w-16 bg-slate-200 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}