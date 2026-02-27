// components/dashboard/MyCourses.tsx
import Link from "next/link";
import { ChevronLeft, PlayCircle } from "lucide-react";

const items = [
  { title: "آزمون جامع ریاضی", progress: 72, last: "دیروز" },
  { title: "دوره نکته و تست زبان", progress: 41, last: "۳ روز پیش" },
  { title: "مبحث آمار و احتمال", progress: 88, last: "امروز" },
];

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function MyCourses() {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <div className="font-extrabold text-slate-900">دوره‌ها و آزمون‌های من</div>
          <div className="text-sm text-slate-500 mt-1">ادامه بده از جایی که مونده بودی</div>
        </div>

        <Link
          href="/dashboard/courses"
          className="text-sm font-bold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
        >
          مشاهده همه <ChevronLeft size={16} />
        </Link>
      </div>

      <div className="p-5 space-y-4">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 transition">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-bold text-slate-900 truncate">{it.title}</div>
                <div className="text-[13px] text-slate-500 mt-1">آخرین فعالیت: {it.last}</div>
              </div>

              <Link
                href="/dashboard/courses/1"
                className="shrink-0 h-10 px-3 rounded-2xl bg-slate-900 text-white font-bold text-sm
                           hover:bg-slate-800 transition inline-flex items-center gap-2"
              >
                <PlayCircle size={18} />
                ادامه
              </Link>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-[12px] text-slate-500 mb-2">
                <span>پیشرفت</span>
                <span className="font-bold text-slate-700">{it.progress}%</span>
              </div>
              <ProgressBar value={it.progress} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}