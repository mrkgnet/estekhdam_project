// components/dashboard/ActivityFeed.tsx
import { Clock, Check, AlertTriangle } from "lucide-react";

const items = [
  { type: "success", title: "پرداخت با موفقیت انجام شد", time: "۲ ساعت پیش" },
  { type: "warn", title: "یک آزمون نیمه‌تمام داری", time: "دیروز" },
  { type: "success", title: "پروفایل بروزرسانی شد", time: "۳ روز پیش" },
];

function IconByType({ type }: { type: string }) {
  if (type === "success") return <Check size={16} className="text-emerald-700" />;
  if (type === "warn") return <AlertTriangle size={16} className="text-amber-700" />;
  return <Clock size={16} className="text-slate-700" />;
}

export default function ActivityFeed() {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
      <div className="font-extrabold text-slate-900">فعالیت‌های اخیر</div>
      <div className="text-sm text-slate-500 mt-1">آخرین تغییرات حساب شما</div>

      <div className="mt-4 space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <IconByType type={it.type} />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{it.title}</div>
                  <div className="text-[13px] text-slate-500 mt-1">{it.time}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}