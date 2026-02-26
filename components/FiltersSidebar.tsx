"use client";

import { useMemo, useState } from "react";
import { ChevronUp, Search, X } from "lucide-react";

// ✅ قبلاً فقط type بود، الان export شد تا جاهای دیگه هم استفاده کنن
export type StatusKey =
  | "REGISTERING"
  | "WAITING_CARD"
  | "CARD_RECEIVED"
  | "WAITING_RESULTS"
  | "RESULTS_ANNOUNCED"
  | "NEWS";

export type FiltersValue = {
  regions: string[];
  statuses: StatusKey[];
};

const STATUS_OPTIONS: { key: StatusKey; label: string }[] = [
  { key: "REGISTERING", label: "ثبت نام" },
  { key: "WAITING_CARD", label: "در انتظار دریافت کارت" },
  { key: "CARD_RECEIVED", label: "دریافت کارت" },
  { key: "WAITING_RESULTS", label: "در انتظار نتایج" },
  { key: "RESULTS_ANNOUNCED", label: "اعلام نتایج" },
  { key: "NEWS", label: "اطلاعاتیه و خبر" },
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

function toggleInArray<T>(arr: T[], value: T) {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

export default function FiltersSidebar({
  value,
  onChange,
}: {
  value: FiltersValue;
  onChange: (next: FiltersValue) => void;
}) {
  const [regionOpen, setRegionOpen] = useState(true);
  const [statusOpen, setStatusOpen] = useState(true);
  const [regionQuery, setRegionQuery] = useState("");

  const filteredRegions = useMemo(() => {
    const q = regionQuery.trim().toLowerCase();
    if (!q) return REGIONS;
    return REGIONS.filter((r) => r.toLowerCase().includes(q));
  }, [regionQuery]);

  const clearRegions = () => onChange({ ...value, regions: [] });
  const clearStatuses = () => onChange({ ...value, statuses: [] });

  return (
    <aside className="w-full rounded-2xl border border-slate-100 bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-extrabold text-slate-800">فیلترها</p>

        <button
          type="button"
          onClick={() => onChange({ regions: [], statuses: [] })}
          className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          پاک کردن همه
        </button>
      </div>

      {/* Region Section */}
      <div className="rounded-2xl border border-slate-100 overflow-hidden">
        <button
          type="button"
          onClick={() => setRegionOpen((s) => !s)}
          className="w-full flex items-center justify-between p-4"
        >
          <span className="font-extrabold text-slate-800">منطقه جستجو</span>
          <ChevronUp
            className={`w-5 h-5 text-slate-500 transition ${
              regionOpen ? "" : "rotate-180"
            }`}
          />
        </button>

        {regionOpen && (
          <div className="px-4 pb-4">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={regionQuery}
                onChange={(e) => setRegionQuery(e.target.value)}
                placeholder="جستجو"
                className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 text-sm
                           focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Selected meta */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">انتخاب کنید</span>
              {value.regions.length > 0 && (
                <button
                  type="button"
                  onClick={clearRegions}
                  className="text-xs font-semibold text-green-600 hover:text-green-700"
                >
                  پاک کردن
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-56 overflow-y-auto pr-1 space-y-2">
              {filteredRegions.map((r) => {
                const checked = value.regions.includes(r);
                return (
                  <label
                    key={r}
                    className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    <span className="text-sm text-slate-700">{r}</span>

                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        onChange({
                          ...value,
                          regions: toggleInArray(value.regions, r),
                        })
                      }
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
          <ChevronUp
            className={`w-5 h-5 text-slate-500 transition ${
              statusOpen ? "" : "rotate-180"
            }`}
          />
        </button>

        {statusOpen && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">انتخاب کنید</span>
              {value.statuses.length > 0 && (
                <button
                  type="button"
                  onClick={clearStatuses}
                  className="text-xs font-semibold text-green-600 hover:text-green-700"
                >
                  پاک کردن
                </button>
              )}
            </div>

            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => {
                const checked = value.statuses.includes(s.key);
                return (
                  <label
                    key={s.key}
                    className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    <span className="text-sm text-slate-700">{s.label}</span>

                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        onChange({
                          ...value,
                          statuses: toggleInArray(value.statuses, s.key),
                        })
                      }
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
