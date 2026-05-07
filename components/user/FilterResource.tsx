"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type FilterResourceProps = {
  currentCategory: string | null;
  totalCount: number;
  isFetching: boolean;
};

// تعریف آرایه فیلترها برای تمیزی کد و توسعه‌پذیری آسان در آینده
const FILTERS = [
  { label: "بانک سوالات", value: "بانک-سوالات" },
  { label: "دفترچه‌های استخدامی", value: "دفترچه-های-استخدامی" },
];

export default function FilterResource({
  currentCategory,
  totalCount,
  isFetching,
}: FilterResourceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // تابع تغییر پارامترهای URL
  const handleFilter = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    // نکته مهم: با تغییر دسته‌بندی، کاربر باید به صفحه اول برگردد
    params.delete("page");

    // آپدیت URL بدون اسکرول شدن صفحه
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative">
      {/* هدر: عنوان و نشانگر تعداد/لودینگ */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700">فیلترها</h2>

        <div className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-opacity">
          {isFetching ? (
            <span className="inline-block w-8 h-3 bg-blue-200 animate-pulse rounded" />
          ) : (
            <>
              تعداد:
              <span className="font-bold">{totalCount}</span>
            </>
          )}
        </div>
      </div>

      {/* چیپ‌های فیلتر با قابلیت اسکرول افقی */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {FILTERS.map((filter) => {
            const isActive = currentCategory === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => handleFilter(filter.value)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border ${
                  isActive
                    ? "bg-red-500 text-white border-red-500 shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {filter.label}
              </button>
            );
          })}

          {/* دکمه 'نمایش همه' (فقط زمان فعال بودن یک فیلتر ظاهر می‌شود) */}
          {currentCategory && (
            <button
              onClick={() => handleFilter(null)}
              className="shrink-0 px-4 py-2 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:text-red-500 transition-all duration-200 flex items-center gap-1"
            >
              نمایش همه
              <span className="text-lg leading-none">&times;</span>
            </button>
          )}
        </div>

        {/* افکت سایه محو در لبه برای نشان دادن قابلیت اسکرول (تنظیم شده برای حالت RTL راست‌چین) */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-white to-transparent" />
      </div>
    </div>
  );
}
