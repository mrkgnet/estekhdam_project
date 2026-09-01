"use client";

import { useMemo, useState, TransitionStartFunction, useCallback, memo, useEffect } from "react";
import { ChevronUp, X, Filter } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export type StatusKey = "OPEN" | "CARD_RECEIVED" | "RESULTS_ANNOUNCED" | "NEWS";

export const STATUS_OPTIONS: { key: StatusKey; label: string }[] = [
  { key: "OPEN", label: "ثبت نام" },
  { key: "CARD_RECEIVED", label: "دریافت کارت" },
  { key: "RESULTS_ANNOUNCED", label: "اعلام نتایج" },
  { key: "NEWS", label: "اطلاعیه و خبر" },
];

function toggleInArray<T>(arr: T[], value: T) {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

type FiltersSidebarContentProps = {
  activeStatuses: string[];
  statusOpen: boolean;
  setStatusOpen: (val: boolean) => void;
  updateUrl: (key: string, values: string[]) => void;
  showHeader?: boolean;
  clearAll: () => void;
};

// استفاده از memo برای جلوگیری از رندرهای اضافی فرزند وقتی توابع یا پراپ‌ها تغییر نکرده‌اند
const FiltersSidebarContent = memo(function FiltersSidebarContent({
  activeStatuses,
  statusOpen,
  setStatusOpen,
  updateUrl,
  showHeader = true,
  clearAll,
}: FiltersSidebarContentProps) {
  return (
    <div>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-400 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400">
              <Filter className="w-4 h-4" />
            </span>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">فیلترها</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">انتخاب‌های شما اعمال می‌شوند</p>
            </div>
          </div>
          <AnimatePresence>
            {activeStatuses.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="button"
                onClick={clearAll}
                className="text-[11px] font-bold text-red-800 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                پاک کردن همه
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* بخش وضعیت */}
      <section className="rounded-lg dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 transition-all duration-200">
        <button
          type="button"
          onClick={() => setStatusOpen(!statusOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-800 dark:text-slate-100">وضعیت</span>
            <AnimatePresence>
              {activeStatuses.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-400 dark:border-emerald-700 font-bold"
                >
                  {activeStatuses.length}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <ChevronUp
            className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
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
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <div className="space-y-2">
                  {STATUS_OPTIONS.map((s) => {
                    const checked = activeStatuses.includes(s.key);
                    return (
                      <label
                        key={s.key}
                        className={`flex items-center justify-between gap-3 p-2.5 rounded-md cursor-pointer border select-none transition-all duration-150 active:scale-[0.99] ${
                          checked
                            ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-700"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent"
                        }`}
                      >
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{s.label}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => updateUrl("statuses", toggleInArray(activeStatuses, s.key))}
                            className="w-4 h-4 accent-emerald-600 cursor-pointer rounded"
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
});

export default function FiltersSidebar({ startTransition }: { startTransition?: TransitionStartFunction }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // گرفتن استیت اصلی از URL
  const activeStatuses = useMemo(() => searchParams.get("statuses")?.split(",").filter(Boolean) || [], [searchParams]);

  const [localStatuses, setLocalStatuses] = useState<string[]>([]);
  const [statusOpen, setStatusOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // سینک کردن استیت موبایل فقط زمانی که URL تغییر می‌کند یا کاربر در منوی موبایل است
  useEffect(() => {
    setLocalStatuses(activeStatuses);
  }, [activeStatuses]);

  // باز کردن منوی موبایل و کپی کردن استیت فعلی به عنوان پیش‌نویس
  const handleOpenMobile = useCallback(() => {
    setLocalStatuses(activeStatuses);
    setMobileOpen(true);
  }, [activeStatuses]);

  // متد اصلی آپدیت URL که با useCallback كش شده است
  const updateUrl = useCallback((key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) params.set(key, values.join(","));
    else params.delete(key);

    const apply = () => router.push(`${pathname}?${params.toString()}`, { scroll: false });

    if (startTransition) {
      startTransition(apply);
    } else {
      apply();
    }
  }, [searchParams, pathname, router, startTransition]);

  // هندلر برای آپدیت لوکال (نسخه موبایل)
  const handleLocalUpdate = useCallback((key: string, values: string[]) => {
    if (key === "statuses") setLocalStatuses(values);
  }, []);

  // اعمال نهایی فیلترها در موبایل
  const applyMobileFilters = useCallback(() => {
    updateUrl("statuses", localStatuses);
    setMobileOpen(false);
  }, [updateUrl, localStatuses]);

  // پاک کردن همه فیلترهای URL
  const clearAll = useCallback(() => {
    const apply = () => router.push(pathname, { scroll: false });
    if (startTransition) startTransition(apply);
    else apply();
  }, [pathname, router, startTransition]);

  // پاک کردن فیلترهای پیش‌نویس موبایل
  const clearMobileAll = useCallback(() => {
    setLocalStatuses([]);
  }, []);

  const filtersCount = activeStatuses.length;
  const localFiltersCount = localStatuses.length;

  return (
    <>
      {/* دکمه باز کردن در موبایل */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={handleOpenMobile}
          className="flex font-bold items-center justify-center gap-2 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 text-base text-slate-700 dark:text-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer"
        >
          <Filter className="w-4 h-4 font-bold text-emerald-600 dark:text-emerald-400" />
          فیلترها
          {filtersCount > 0 && (
            <span className="text-xs inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-400 dark:border-emerald-700 font-bold">
              {filtersCount}
            </span>
          )}
        </button>
      </div>

      {/* منوی مدال در موبایل */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-x-0 bottom-0 max-h-[calc(100vh-8rem)] rounded-t-2xl border-t-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-xl flex flex-col z-10"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100">فیلترها</span>
                  {localFiltersCount > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-400 dark:border-emerald-700 font-bold">
                      {localFiltersCount} فعال
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {localFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={clearMobileAll}
                      className="text-xs font-medium text-red-500 hover:text-red-600 cursor-pointer"
                    >
                      پاک کردن همه
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <FiltersSidebarContent
                  activeStatuses={localStatuses}
                  statusOpen={statusOpen}
                  setStatusOpen={setStatusOpen}
                  updateUrl={handleLocalUpdate}
                  showHeader={false}
                  clearAll={clearMobileAll}
                />
              </div>

              <div className="px-4 py-3 border-t-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                <button
                  type="button"
                  onClick={applyMobileFilters}
                  className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 py-3 text-white font-medium shadow-sm transition-colors cursor-pointer"
                >
                  اعمال فیلترها ({localFiltersCount})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* سایدبار دسکتاپ */}
      <aside className="hidden md:block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 backdrop-blur p-4 md:p-5 shadow-sm sticky top-24">
        <FiltersSidebarContent
          activeStatuses={activeStatuses}
          statusOpen={statusOpen}
          setStatusOpen={setStatusOpen}
          updateUrl={updateUrl}
          showHeader
          clearAll={clearAll}
        />
      </aside>
    </>
  );
}