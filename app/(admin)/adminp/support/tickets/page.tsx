import React, { Suspense } from 'react';
import FetchDataTA from './FetchDataTA';

// ۱. تعریف کامپوننت اسکلتون برای لیست تیکت‌ها
function SkeletonTableLoader() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* هدر باکس */}
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800">لیست تیکت‌های پشتیبانی</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          {/* هدر جدول (ثابت نگه داشته می‌شود تا کاربر بداند چه دیتایی در حال لود است) */}
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="p-4 font-medium w-[30%]">موضوع</th>
              <th className="p-4 font-medium w-[20%]">کاربر</th>
              <th className="p-4 font-medium w-[15%]">وضعیت</th>
              <th className="p-4 font-medium w-[10%]">اولویت</th>
              <th className="p-4 font-medium w-[15%]">تاریخ ثبت</th>
              <th className="p-4 font-medium w-[10%]">عملیات</th>
            </tr>
          </thead>
          
          {/* بدنه جدول با انیمیشن Pulse برای شبیه‌سازی لودینگ داده‌ها */}
          <tbody className="divide-y divide-slate-100 animate-pulse">
            {/* ایجاد ۵ ردیف خالی (اسکلتون) با استفاده از آرایه */}
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                {/* ستون موضوع */}
                <td className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="w-3/4 h-4 bg-slate-200 rounded"></div>
                    <div className="w-16 h-3 bg-slate-100 rounded"></div>
                  </div>
                </td>
                {/* ستون کاربر */}
                <td className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="w-1/2 h-4 bg-slate-200 rounded"></div>
                    <div className="w-3/4 h-3 bg-slate-100 rounded"></div>
                  </div>
                </td>
                {/* ستون وضعیت (شبیه بج) */}
                <td className="p-4">
                  <div className="w-20 h-6 bg-slate-200 rounded-md"></div>
                </td>
                {/* ستون اولویت */}
                <td className="p-4">
                  <div className="w-12 h-4 bg-slate-200 rounded"></div>
                </td>
                {/* ستون تاریخ */}
                <td className="p-4">
                  <div className="w-24 h-3 bg-slate-200 rounded"></div>
                </td>
                {/* ستون عملیات */}
                <td className="p-4">
                  <div className="w-20 h-4 bg-indigo-100 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ۲. کامپوننت اصلی صفحه
export default function page() {
  return (
    <div className="w-full">
      {/* 
        استفاده از Suspense
        تا زمان واکشی دیتای تیکت‌ها توسط FetchDataTA، 
        اسکلتون بالا نمایش داده خواهد شد.
      */}
      <Suspense fallback={<SkeletonTableLoader />}>
        <FetchDataTA />
      </Suspense>
    </div>
  )
}
