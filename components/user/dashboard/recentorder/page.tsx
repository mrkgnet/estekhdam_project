import React, { Suspense } from 'react';
import FetchDataROD from './FetchDataROD';

// ۱. ساخت کامپوننت اسکلتون برای جدول سفارشات
function RecentOrdersSkeleton() {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
      {/* هدر بخش */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <div className="h-5 w-32 bg-slate-200 rounded mb-2"></div>
          <div className="h-3 w-48 bg-slate-200 rounded"></div>
        </div>
        <div className="h-4 w-20 bg-slate-200 rounded"></div>
      </div>

      {/* اسکلتون جدول */}
      <div className="p-5 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          {/* هدرهای جدول را به صورت متن ثابت نگه می‌داریم تا ظاهر بهتری در زمان لود داشته باشد */}
          <thead>
            <tr className="text-slate-400">
              <th className="text-right font-bold py-2">کد سفارش</th>
              <th className="text-right font-bold py-2">عنوان</th>
              <th className="text-right font-bold py-2">تاریخ</th>
              <th className="text-right font-bold py-2">مبلغ (تومان)</th>
              <th className="text-right font-bold py-2">وضعیت</th>
              <th className="text-right font-bold py-2">رسید</th>
            </tr>
          </thead>

          {/* ردیف‌های فیک برای لودینگ (مثلا ۳ ردیف) */}
          <tbody className="divide-y divide-slate-100">
            {[1, 2, 3].map((index) => (
              <tr key={index}>
                <td className="py-4"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
                <td className="py-4"><div className="h-4 w-32 bg-slate-200 rounded"></div></td>
                <td className="py-4"><div className="h-4 w-20 bg-slate-200 rounded"></div></td>
                <td className="py-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
                <td className="py-4"><div className="h-6 w-16 bg-slate-200 rounded-full"></div></td>
                <td className="py-4"><div className="h-4 w-16 bg-slate-200 rounded"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ۲. استفاده از Suspense در کامپوننت اصلی
export default function RecentOrders() {
  return (
    <div>
      {/* در زمان دریافت اطلاعات از دیتابیس، اسکلتون جدول نمایش داده می‌شود */}
      <Suspense fallback={<RecentOrdersSkeleton />}>
        <FetchDataROD />
      </Suspense>
    </div>
  );
}
