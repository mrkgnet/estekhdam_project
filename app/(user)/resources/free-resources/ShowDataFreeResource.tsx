"use client";
import { useState } from "react";

// تعریف تایپ بر اساس خروجی دیتابیس شما
type Category = {
  id: string;
  catName: string;
  catSlug: string;
  imageUrl?: string | null;
};

interface Props {
  initialCategories: Category[];
}

export default function ShowDataFreeResource({ initialCategories }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // استخراج آیدی دسته‌بندی‌های انتخاب شده
  const activeFilters = Object.keys(checked).filter((k) => checked[k]);

  // تابع تغییر وضعیت چک‌باکس‌ها
  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 border-r-4 border-blue-600 pr-3">
          منابع و سوالات رایگان
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* سایدبار فیلترها (دینامیک از دیتابیس) */}
          <aside className="w-full lg:w-1/4 bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 h-fit sticky top-6">
            <h2 className="text-lg font-bold mb-5 text-gray-800 border-b border-gray-100 pb-3">
              دسته‌بندی منابع
            </h2>
            
            {initialCategories.length > 0 ? (
              <div className="space-y-2">
                {initialCategories.map((category) => (
                  <label
                    key={category.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer border transition-all duration-200 ${
                      checked[category.id]
                        ? "border-blue-200 bg-blue-50/50"
                        : "border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={!!checked[category.id]}
                        onChange={() => toggle(category.id)}
                      />
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors duration-200 ${
                          checked[category.id]
                            ? "bg-blue-600 border-blue-600"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {checked[category.id] && (
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 select-none">
                      {category.catName}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">دسته‌بندی یافت نشد.</p>
            )}
          </aside>

          {/* بخش محصولات/فایل‌ها */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                {/* در اینجا باید لیست محصولات/فایل‌های مرتبط با دسته‌بندی‌های انتخاب شده نمایش داده شود.
                  در حال حاضر یک پیام موقت (Placeholder) قرار داده شده است.
                */}
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-bold text-gray-700 mb-2">لیست فایل‌های دانلودی</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  برای نمایش فایل‌های PDF و آزمون‌ها، باید بخش دریافت محصولات (Products) را به این کامپوننت متصل کنید.
                </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}