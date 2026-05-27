import React, { Suspense } from 'react'
import FetchDataGlobalNotification from './fetchData'

// ساخت لودر اسکلتونی کاملاً منطبق بر ساختار تگ‌های جدول اصلی شما
function NotificationGlobalSkeleton() {
  return (
    <div className="p-4 max-w-7xl mx-auto font-sans animate-pulse" dir="rtl">
      
      {/* اسکلتون هدر صفحه */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 gap-4">
        <div className="space-y-3 w-full sm:w-auto">
          {/* عنوان اصلی */}
          <div className="h-6 bg-gray-200 rounded-xl w-48"></div>
          {/* متن زیر عنوان */}
          <div className="h-4 bg-gray-100 rounded-lg w-full max-w-md"></div>
        </div>
        {/* دکمه افزودن پیغام جدید */}
        <div className="h-11 bg-gray-200 rounded-xl w-36 shrink-0"></div>
      </div>

      {/* اسکلتون جدول نمایش پیغام‌ها */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4"><div className="h-4 bg-gray-200 rounded w-16"></div></th>
                <th className="p-4 max-w-md"><div className="h-4 bg-gray-200 rounded w-24"></div></th>
                <th className="p-4 text-center"><div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div></th>
                <th className="p-4 text-center"><div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div></th>
                <th className="p-4 text-center"><div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {/* شبیه‌سازی ۵ ردیف جدول در حال بارگذاری */}
              {[1, 2, 3].map((item) => (
                <tr key={item}>
                  {/* عنوان اعلان */}
                  <td className="p-4">
                    <div className="h-5 bg-gray-200 rounded-lg w-32"></div>
                  </td>
                  
                  {/* متن کامل پیغام */}
                  <td className="p-4 max-w-md">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-100 rounded-lg w-full"></div>
                      <div className="h-4 bg-gray-100 rounded-lg w-2/3"></div>
                    </div>
                  </td>
                  
                  {/* تاریخ ایجاد */}
                  <td className="p-4 text-center">
                    <div className="h-4 bg-gray-200 rounded-lg w-16 mx-auto"></div>
                  </td>
                  
                  {/* دکمه وضعیت نمایش */}
                  <td className="p-4 text-center">
                    <div className="inline-flex h-7 bg-gray-100 rounded-full w-24 mx-auto"></div>
                  </td>
                  
                  {/* دکمه عملیات حذف */}
                  <td className="p-4 text-center">
                    <div className="h-9 w-9 bg-gray-100 rounded-xl mx-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default function page() {
  return (
    // ساسپنس تا زمان واکشی کامل اطلاعات توسط سرور کامپوننت، اسکلتون بالا را نشان می‌دهد
    <Suspense fallback={<NotificationGlobalSkeleton />}>
      <FetchDataGlobalNotification />
    </Suspense>
  )
}