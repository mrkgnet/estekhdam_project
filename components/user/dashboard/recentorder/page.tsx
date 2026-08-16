import React, { Suspense } from 'react';
import FetchDataROD from './FetchDataROD';

function RecentOrdersSkeleton() {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm animate-pulse">
      <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
          <div className="h-3 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </div>

      <div className="p-5 overflow-x-auto">
        <table className="w-full text-sm min-w-[650px]">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="text-right font-bold py-3">کد سفارش</th>
              <th className="text-right font-bold py-3">عنوان</th>
              <th className="text-right font-bold py-3">تاریخ</th>
              <th className="text-right font-bold py-3">مبلغ</th>
              <th className="text-right font-bold py-3">کد رهگیری</th>
              <th className="text-right font-bold py-3">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {[1, 2, 3, 4, 5].map((index) => (
              <tr key={index}>
                <td className="py-4"><div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div></td>
                <td className="py-4"><div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded"></div></td>
                <td className="py-4"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div></td>
                <td className="py-4"><div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div></td>
                <td className="py-4"><div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div></td>
                <td className="py-4"><div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="flex gap-1.5">
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        </div>
      </div>
    </section>
  );
}

interface RecentOrdersProps {
  // پشتیبانی از Next.js 15 که searchParams در آن یک Promise است
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function RecentOrders({ searchParams }: RecentOrdersProps) {
  // باز کردن ایمن پرامیس (اگر پرامیس بود)
  const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams;
  
  // استخراج مقدار صفحه
  const pageParam = resolvedParams?.page;
  const parsedPage = typeof pageParam === 'string' ? parseInt(pageParam, 10) : 1;
  const page = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  return (
    <div>
      {/* پاس دادن key={page} باعث اجرای لودینگ هنگام تغییر صفحه در URL می‌شود */}
      <Suspense key={page} fallback={<RecentOrdersSkeleton />}>
        <FetchDataROD page={page} />
      </Suspense>
    </div>
  );
}
