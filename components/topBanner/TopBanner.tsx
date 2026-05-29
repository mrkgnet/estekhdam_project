"use client"

import { useState } from "react";
import { X, Wrench } from "lucide-react";

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    // گرادیانت حذف شد و رنگ آبی کلاسیک فیسبوک (3b5998) اضافه شد
    <div className="bg-[#3b5998] text-white relative shadow-md" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          
          {/* بخش متن و آیکون */}
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <span className="flex p-2 rounded-lg bg-white/20 flex-shrink-0">
              <Wrench className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
            <p className="font-medium truncate text-sm sm:text-base">
              <span className="md:hidden">سایت در حال ساخت است؛ به‌زودی بازمی‌گردیم!</span>
              <span className="hidden md:inline">
                وب‌سایت در حال ساخت می‌باشد و به‌زودی با امکانات جدید قابل استفاده خواهد بود. از شکیبایی شما سپاسگزاریم.
              </span>
            </p>
          </div>

          {/* دکمه بستن */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="flex p-2 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
            >
              <span className="sr-only">بستن</span>
              <X className="h-5 w-5 text-white" aria-hidden="true" />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}