"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { ChevronUp, Search, X, Filter, CheckCircle2 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export type StatusKey = "OPEN" | "CARD_RECEIVED" | "RESULTS_ANNOUNCED" | "NEWS";

const STATUS_OPTIONS: { key: StatusKey; label: string }[] = [
  { key: "OPEN", label: "ثبت نام" },
  { key: "CARD_RECEIVED", label: "دریافت کارت" },
  { key: "RESULTS_ANNOUNCED", label: "اعلام نتایج" },
  { key: "NEWS", label: "اطلاعیه و خبر" },
];

const REGIONS = [
  "سراسر کشور",
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

// helper
function toggleInArray<T>(arr: T[], value: T) {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

type FiltersSidebarContentProps = {
  activeStatuses: string[];
  activeRegions: string[];
  statusOpen: boolean;
  regionOpen: boolean;
  setStatusOpen: (val: boolean) => void;
  setRegionOpen: (val: boolean) => void;
  updateUrl: (key: string, values: string[]) => void;
  filteredRegions: string[];
  regionQuery: string;
  setRegionQuery: (val: string) => void;
  showHeader?: boolean;
  clearAll: () => void;
};

function FiltersSidebarContent({
  activeStatuses,
  activeRegions,
  statusOpen,
  regionOpen,
  setStatusOpen,
  setRegionOpen,
  updateUrl,
  filteredRegions,
  regionQuery,
  setRegionQuery,
  showHeader = true,
  clearAll,
}: FiltersSidebarContentProps) {
  return (
    <div>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">
              <Filter className="w-4 h-4" />
            </span>
            <div>
              <p className="font-extrabold text-slate-800">فیلترها</p>
              <p className="text-[11px] text-slate-400">انتخاب‌های شما اعمال می‌شوند</p>
            </div>
          </div>
          {(activeRegions.length > 0 || activeStatuses.length > 0) && (
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              پاک کردن همه
            </button>
          )}
        </div>
      )}

      {/* Status Section */}
      <section className="rounded-2xl border border-slate-200/60 overflow-hidden mb-4 bg-white">
        <button
          type="button"
          onClick={() => setStatusOpen(!statusOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">وضعیت</span>
            {activeStatuses.length > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                {activeStatuses.length} انتخاب
              </span>
            )}
          </div>
          <ChevronUp className={`w-5 h-5 text-slate-500 transition ${statusOpen ? "" : "rotate-180"}`} />
        </button>

        {statusOpen && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500">انتخاب کنید</span>
              {activeStatuses.length > 0 && (
                <button
                  type="button"
                  onClick={() => updateUrl("statuses", [])}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  پاک کردن
                </button>
              )}
            </div>

            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => {
                const checked = activeStatuses.includes(s.key);
                return (
                  <label
                    key={s.key}
                    className={`flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer border transition
                    ${checked ? "bg-emerald-50 border-emerald-200" : "hover:bg-slate-50 border-transparent"}`}
                  >
                    <span className="text-slate-700">{s.label}</span>
                    <div className="flex items-center gap-2">
                      {checked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => updateUrl("statuses", toggleInArray(activeStatuses, s.key))}
                        className="w-5 h-5 accent-emerald-600"
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Region Section */}
      <section className="rounded-2xl border border-slate-200/60 overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setRegionOpen(!regionOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">منطقه جستجو</span>
            {activeRegions.length > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                {activeRegions.length} انتخاب
              </span>
            )}
          </div>
          <ChevronUp className={`w-5 h-5 text-slate-500 transition ${regionOpen ? "" : "rotate-180"}`} />
        </button>

        {regionOpen && (
          <div className="px-4 pb-4">
            <div className="relative mb-3">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={regionQuery}
                onChange={(e) => setRegionQuery(e.target.value)}
                placeholder="جستجو در ناحیه"
                className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500">انتخاب کنید</span>
              {activeRegions.length > 0 && (
                <button
                  type="button"
                  onClick={() => updateUrl("regions", [])}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  پاک کردن
                </button>
              )}
            </div>

            <div className="max-h-56 overflow-y-auto pr-1 space-y-2">
              {filteredRegions.map((r) => {
                const checked = activeRegions.includes(r);
                return (
                  <label
                    key={r}
                    className={`flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer border transition
                    ${checked ? "bg-emerald-50 border-emerald-200" : "hover:bg-slate-50 border-transparent"}`}
                  >
                    <span className="text-slate-700">{r}</span>
                    <div className="flex items-center gap-2">
                      {checked && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => updateUrl("regions", toggleInArray(activeRegions, r))}
                        className="w-5 h-5 accent-emerald-600"
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function FiltersSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeRegions = searchParams.get("regions")?.split(",").filter(Boolean) || [];
  const activeStatuses = searchParams.get("statuses")?.split(",").filter(Boolean) || [];
  const [isPending, startTransition] = useTransition();

  const [regionOpen, setRegionOpen] = useState(true);
  const [statusOpen, setStatusOpen] = useState(true);
  const [regionQuery, setRegionQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredRegions = useMemo(() => {
    const q = regionQuery.trim().toLowerCase();
    if (!q) return REGIONS;
    return REGIONS.filter((r) => r.toLowerCase().includes(q));
  }, [regionQuery]);

  const updateUrl = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) params.set(key, values.join(","));
    else params.delete(key);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearAll = () => {
    router.push(pathname, { scroll: false });
    setRegionQuery("");
  };

  const filtersCount = activeRegions.length + activeStatuses.length;

  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile trigger */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm"
        >
          <Filter className="w-4 h-4 text-emerald-600" />
          فیلترها
          {filtersCount > 0 && (
            <span className="text-xs inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              {filtersCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile modal */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">فیلترها</span>
                {filtersCount > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {filtersCount} فعال
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {filtersCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    پاک کردن
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {isPending && (
                <div className="mb-3 flex items-center gap-2 text-xs text-emerald-600">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></span>
                  در حال اعمال فیلترها...
                </div>
              )}

              <FiltersSidebarContent
                activeStatuses={activeStatuses}
                activeRegions={activeRegions}
                statusOpen={statusOpen}
                regionOpen={regionOpen}
                setStatusOpen={setStatusOpen}
                setRegionOpen={setRegionOpen}
                updateUrl={updateUrl}
                filteredRegions={filteredRegions}
                regionQuery={regionQuery}
                setRegionQuery={setRegionQuery}
                showHeader={false}
                clearAll={clearAll}
              />
            </div>

            <div className="px-4 py-3 border-t border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold shadow-sm hover:bg-emerald-500 transition"
              >
                نمایش نتایج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-full rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur p-4 md:p-5 text-xs md:text-sm shadow-sm  top-24">
        <FiltersSidebarContent
          activeStatuses={activeStatuses}
          activeRegions={activeRegions}
          statusOpen={statusOpen}
          regionOpen={regionOpen}
          setStatusOpen={setStatusOpen}
          setRegionOpen={setRegionOpen}
          updateUrl={updateUrl}
          filteredRegions={filteredRegions}
          regionQuery={regionQuery}
          setRegionQuery={setRegionQuery}
          showHeader
          clearAll={clearAll}
        />
      </aside>
    </>
  );
}
