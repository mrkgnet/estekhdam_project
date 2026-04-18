"use client";

import { useMemo, useState } from "react";
import { ChevronUp, Search, X } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export type StatusKey =
  | "OPEN"
  | "CARD_RECEIVED"
  | "RESULTS_ANNOUNCED"
  | "NEWS";

const STATUS_OPTIONS: { key: StatusKey; label: string }[] = [
  { key: "OPEN", label: "ثبت نام" },
  { key: "CARD_RECEIVED", label: "دریافت کارت" },
  { key: "RESULTS_ANNOUNCED", label: "اعلام نتایج" },
  { key: "NEWS", label: "اطلاعیه و خبر" },
];

const REGIONS = [
  "چهارمحال و بختیاری",
  "خراسان جنوبی",
  "خراسان رضوی",
  "خراسان شمالی",
  "تهران",
  "اصفهان",
  "فارس",
  "گیلان",
  "یزد",
  "کرمان",
];

// تابع کمکی برای اضافه یا حذف کردن یک آیتم از آرایه
function toggleInArray<T>(arr: T[], value: T) {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

export default function FiltersSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // خواندن مقادیر فعلی از URL
  const activeRegions = searchParams.get("regions")?.split(",").filter(Boolean) || [];
  const activeStatuses = searchParams.get("statuses")?.split(",").filter(Boolean) || [];

  const [regionOpen, setRegionOpen] = useState(true);
  const [statusOpen, setStatusOpen] = useState(true);
  const [regionQuery, setRegionQuery] = useState("");

  const filteredRegions = useMemo(() => {
    const q = regionQuery.trim().toLowerCase();
    if (!q) return REGIONS;
    return REGIONS.filter((r) => r.toLowerCase().includes(q));
  }, [regionQuery]);

  // منطق اصلی: آپدیت کردن URL
  const updateUrl = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (values.length > 0) {
      params.set(key, values.join(","));
    } else {
      params.delete(key);
    }

    // scroll: false باعث میشه با کلیک روی فیلتر، صفحه به بالا پرش نکند
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  return (
    <aside className="w-full rounded border border-slate-100 bg-white p-4 text-xs md:text-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className=" font-extrabold text-slate-800">فیلترها</p>
        {(activeRegions.length > 0 || activeStatuses.length > 0) && (
          <button
            type="button"
            onClick={clearAll}
            className=" font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            پاک کردن همه
          </button>
        )}
      </div>

      {/* Region Section */}
      <div className="rounded-2xl border border-slate-100 overflow-hidden">
        <button
          type="button"
          onClick={() => setRegionOpen((s) => !s)}
          className="w-full flex items-center justify-between p-4"
        >
          <span className="font-extrabold text-slate-800">منطقه جستجو</span>
          <ChevronUp className={`w-5 h-5 text-slate-500 transition ${regionOpen ? "" : "rotate-180"}`} />
        </button>

        {regionOpen && (
          <div className="px-4 pb-4">
            <div className="relative mb-3">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={regionQuery}
                onChange={(e) => setRegionQuery(e.target.value)}
                placeholder="جستجو"
                className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200  focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className=" text-slate-500">انتخاب کنید</span>
              {activeRegions.length > 0 && (
                <button
                  type="button"
                  onClick={() => updateUrl("regions", [])}
                  className=" font-semibold text-green-600 hover:text-green-700"
                >
                  پاک کردن
                </button>
              )}
            </div>

            <div className="max-h-56 overflow-y-auto pr-1 space-y-2">
              {filteredRegions.map((r) => {
                const checked = activeRegions.includes(r);
                return (
                  <label key={r} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <span className=" text-slate-700">{r}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => updateUrl("regions", toggleInArray(activeRegions, r))}
                      className="w-5 h-5 accent-green-600"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Status Section */}
      <div className="rounded-2xl border border-slate-100 overflow-hidden mt-4">
        <button
          type="button"
          onClick={() => setStatusOpen((s) => !s)}
          className="w-full flex items-center justify-between p-4"
        >
          <span className="font-extrabold text-slate-800">وضعیت</span>
          <ChevronUp className={`w-5 h-5 text-slate-500 transition ${statusOpen ? "" : "rotate-180"}`} />
        </button>

        {statusOpen && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className=" text-slate-500">انتخاب کنید</span>
              {activeStatuses.length > 0 && (
                <button
                  type="button"
                  onClick={() => updateUrl("statuses", [])}
                  className=" font-semibold text-green-600 hover:text-green-700"
                >
                  پاک کردن
                </button>
              )}
            </div>

            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => {
                const checked = activeStatuses.includes(s.key);
                return (
                  <label key={s.key} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                    <span className=" text-slate-700">{s.label}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => updateUrl("statuses", toggleInArray(activeStatuses, s.key))}
                      className="w-5 h-5 accent-green-600"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
