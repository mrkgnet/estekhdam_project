// components/dashboard/KpiGrid.tsx
import { Award, ShoppingBag, Timer, TrendingUp } from "lucide-react";

function KpiCard({
  title,
  value,
  hint,
  icon: Icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500">{title}</div>
          <div className="mt-1 text-2xl font-extrabold text-slate-900">{value}</div>
          <div className="mt-2 text-[13px] text-slate-500">{hint}</div>
        </div>

        <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
          <Icon size={18} />
        </div>
      </div>

      <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full w-2/3 bg-slate-300 rounded-full" />
      </div>
    </div>
  );
}

export default function KpiGrid() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard
        title="امتیاز شما"
        value="1,240"
        hint="+12% نسبت به هفته قبل"
        icon={TrendingUp}
      />
      <KpiCard
        title="دوره‌های فعال"
        value="6"
        hint="2 دوره نزدیک پایان"
        icon={Award}
      />
      <KpiCard
        title="سفارش‌های موفق"
        value="14"
        hint="آخرین خرید: امروز"
        icon={ShoppingBag}
      />
      <KpiCard
        title="زمان مطالعه"
        value="7h 35m"
        hint="این هفته"
        icon={Timer}
      />
    </section>
  );
}