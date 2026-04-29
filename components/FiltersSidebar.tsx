"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { ChevronUp, Search, X, Filter, CheckCircle2 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

// ------------------------------------------
// کامپوننت جدید برای نمایش فیلترهای فعال (Pills)
// ------------------------------------------
function ActiveFiltersPills({
  statuses,
  regions,
  onRemoveStatus,
  onRemoveRegion,
}: {
  statuses: string[];
  regions: string[];
  onRemoveStatus: (val: string) => void;
  onRemoveRegion: (val: string) => void;
}) {
  if (statuses.length === 0 && regions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
      <AnimatePresence>
        {statuses.map((s) => {
          const label = STATUS_OPTIONS.find((opt) => opt.key === s)?.label || s;
          return (
            <motion.span
              key={`status-${s}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold shadow-sm"
            >
              {label}
              <button
                type="button"
                onClick={() => onRemoveStatus(s)}
                className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.span>
          );
        })}
        {regions.map((r) => (
          <motion.span
            key={`region-${r}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm"
          >
            {r}
            <button
              type="button"
              onClick={() => onRemoveRegion(r)}
              className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
// ------------------------------------------

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
          <AnimatePresence>
            {(activeRegions.length > 0 || activeStatuses.length > 0) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="button"
                onClick={clearAll}
                className="text-[11px] font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <X className="w-4 h-4" />
                پاک کردن همه
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* نمایش تگ‌های فیلتر فعال */}
      <ActiveFiltersPills
        statuses={activeStatuses}
        regions={activeRegions}
        onRemoveStatus={(s) => updateUrl("statuses", activeStatuses.filter((x) => x !== s))}
        onRemoveRegion={(r) => updateUrl("regions", activeRegions.filter((x) => x !== r))}
      />

      {/* Status Section */}
      <section className="rounded-2xl border border-slate-200/60 overflow-hidden mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
        <button
          type="button"
          onClick={() => setStatusOpen(!statusOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">وضعیت</span>
            <AnimatePresence>
              {activeStatuses.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                >
                  {activeStatuses.length} انتخاب
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <ChevronUp
            className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
              statusOpen ? "" : "rotate-180"
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {statusOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-xs font-medium">انتخاب کنید</span>
                  {activeStatuses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => updateUrl("statuses", [])}
                      className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      پاک کردن وضعیت‌ها
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
                        ${
                          checked
                            ? "bg-emerald-50 border-emerald-200"
                            : "hover:bg-slate-50 border-transparent"
                        }`}
                      >
                        <span className="text-slate-700 text-sm">{s.label}</span>
                        <div className="flex items-center gap-2">
                          <AnimatePresence>
                            {checked && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              updateUrl("statuses", toggleInArray(activeStatuses, s.key))
                            }
                            className="w-5 h-5 accent-emerald-600"
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Region Section */}
      <section className="rounded-2xl border border-slate-200/60 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
        <button
          type="button"
          onClick={() => setRegionOpen(!regionOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">منطقه جستجو</span>
            <AnimatePresence>
              {activeRegions.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
                >
                  {activeRegions.length} انتخاب
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <ChevronUp
            className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
              regionOpen ? "" : "rotate-180"
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {regionOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <div className="relative mb-3">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={regionQuery}
                    onChange={(e) => setRegionQuery(e.target.value)}
                    placeholder="جستجو در ناحیه"
                    className="w-full h-11 pr-10 pl-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-xs font-medium">انتخاب کنید</span>
                  {activeRegions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => updateUrl("regions", [])}
                      className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      پاک کردن مناطق
                    </button>
                  )}
                </div>

                <div className="max-h-56 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                  {filteredRegions.map((r) => {
                    const checked = activeRegions.includes(r);
                    return (
                      <label
                        key={r}
                        className={`flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer border transition
                        ${
                          checked
                            ? "bg-emerald-50 border-emerald-200"
                            : "hover:bg-slate-50 border-transparent"
                        }`}
                      >
                        <span className="text-slate-700 text-sm">{r}</span>
                        <div className="flex items-center gap-2">
                          <AnimatePresence>
                            {checked && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              </motion.div>
                            )}
                          </AnimatePresence>
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
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

export default function FiltersSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL States (برای دسکتاپ)
  const activeRegions = searchParams.get("regions")?.split(",").filter(Boolean) || [];
  const activeStatuses = searchParams.get("statuses")?.split(",").filter(Boolean) || [];

  // Local States (برای موبایل)
  const [localRegions, setLocalRegions] = useState<string[]>(activeRegions);
  const [localStatuses, setLocalStatuses] = useState<string[]>(activeStatuses);

  const [isPending, startTransition] = useTransition();

  const [regionOpen, setRegionOpen] = useState(true);
  const [statusOpen, setStatusOpen] = useState(true);
  const [regionQuery, setRegionQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // همگام‌سازی استیت‌های محلی با URL هر بار که مدال باز می‌شود یا URL تغییر می‌کند
  useEffect(() => {
    setLocalRegions(activeRegions);
    setLocalStatuses(activeStatuses);
  }, [searchParams, mobileOpen]);

  const filteredRegions = useMemo(() => {
    const q = regionQuery.trim().toLowerCase();
    if (!q) return REGIONS;
    return REGIONS.filter((r) => r.toLowerCase().includes(q));
  }, [regionQuery]);

  // آپدیت مستقیم URL (برای دسکتاپ)
  const updateUrl = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) params.set(key, values.join(","));
    else params.delete(key);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // آپدیت استیت محلی (برای موبایل)
  const handleLocalUpdate = (key: string, values: string[]) => {
    if (key === "regions") setLocalRegions(values);
    if (key === "statuses") setLocalStatuses(values);
  };

  // اعمال نهایی فیلترها در موبایل
  const applyMobileFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (localRegions.length > 0) params.set("regions", localRegions.join(","));
    else params.delete("regions");

    if (localStatuses.length > 0) params.set("statuses", localStatuses.join(","));
    else params.delete("statuses");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
    
    setMobileOpen(false);
  };

  // پاک کردن مستقیم همه (برای دسکتاپ)
  const clearAll = () => {
    router.push(pathname, { scroll: false });
    setRegionQuery("");
  };

  // پاک کردن مقادیر محلی (برای موبایل)
  const clearMobileAll = () => {
    setLocalRegions([]);
    setLocalStatuses([]);
    setRegionQuery("");
  };

  const filtersCount = activeRegions.length + activeStatuses.length;
  const localFiltersCount = localRegions.length + localStatuses.length;

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
          <AnimatePresence>
            {filtersCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-xs inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100"
              >
                {filtersCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile modal with Animation */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl bg-slate-50 shadow-xl flex flex-col z-10"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white rounded-t-3xl">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">فیلترها</span>
                  {localFiltersCount > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {localFiltersCount} فعال
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {localFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={clearMobileAll}
                      className="text-xs font-semibold text-red-500 hover:text-red-600"
                    >
                      پاک کردن همه
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <FiltersSidebarContent
                  activeStatuses={localStatuses}
                  activeRegions={localRegions}
                  statusOpen={statusOpen}
                  regionOpen={regionOpen}
                  setStatusOpen={setStatusOpen}
                  setRegionOpen={setRegionOpen}
                  updateUrl={handleLocalUpdate}
                  filteredRegions={filteredRegions}
                  regionQuery={regionQuery}
                  setRegionQuery={setRegionQuery}
                  showHeader={false}
                  clearAll={clearMobileAll}
                />
              </div>

              <div className="px-4 py-3 border-t border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={applyMobileFilters}
                  className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold shadow-sm hover:bg-emerald-500 transition"
                >
                  نمایش نتایج ({localFiltersCount})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-full rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur p-4 md:p-5 shadow-sm sticky top-24">
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
