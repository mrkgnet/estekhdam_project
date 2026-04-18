import React from 'react'
import { Award, ShoppingBag, Timer, TrendingUp } from "lucide-react";
// مسیر ایمپورت تابع بالا را بر اساس پوشه‌بندی خود تنظیم کنید
import { fetchDataKPIC } from '@/actions/kpi-action'; 

function KpiCard({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-1 text-2xl  ">{value}</div>
          {hint && <div className="mt-2 text-[13px] text-slate-500">{hint}</div>}
        </div>

        <div className="w-11 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
          <Icon size={18} />
        </div>
      </div>

      <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full w-2/3 bg-slate-300 rounded-full" />
      </div>
    </div>
  );
}

// ✅ کامپوننت به async تبدیل شده است
export default async function ShowDataKPIC({kpiData} :any) {
  
  // فراخوانی دیتای دیتابیس

  
  // استخراج تعداد (اگر خطا بود 0 در نظر گرفته می‌شود)
  const count = kpiData.success && kpiData.data ? kpiData.data.activeCourses : 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard
        title="دوره‌های فعال"
        value={count.toString()} // 👈 قرار دادن متغیر دینامیک
        hint="دوره‌های خریداری شده شما"
        icon={Award}
      />
      <KpiCard
        title="سفارش‌های موفق"
        value={count.toString()} // 👈 در اینجا هم همان تعداد نمایش داده می‌شود
        hint="تراکنش‌های تایید شده"
        icon={ShoppingBag}
      />
    </section>
  );
}
