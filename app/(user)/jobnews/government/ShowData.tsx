"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { AlarmClock, CalendarRange, MapPin, Wallet, ExternalLink, ArrowLeft, Home, ChevronLeft, Loader2, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FiltersSidebar, { STATUS_OPTIONS } from "@/components/FiltersSidebar";
import CountdownTimer from "@/components/CountdownTimer";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import SafeImage from "@/components/ui/SafeImage";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

// ---------------- Types ----------------
type ShowDataProps = {
  initialNews: { success: boolean; data?: any[]; message?: string };
  currentPage: number;
  totalPages: number;
};

// ---------------- Helpers ----------------
function formatFaDate(iso?: string | null) {
  if (!iso) return "نامشخص";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(d);
}

/**
 * کامپوننت لوگو با افکت Shimmer موج‌دار (Skeleton Wave)
 */
function BrandLogo({ src, alt }: { src?: string | null; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // ریست کردن وضعیت هنگام تغییر src
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      {/* لایه Shimmer موج‌دار */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 bg-slate-200 dark:bg-slate-800 animate-shimmer-wave" />
      )}

      {/* حالت خطا در لود تصویر */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
          <span className="text-[10px] font-bold">تصویر</span>
        </div>
      )}

      {/* تصویر اصلی */}
      {!hasError && (
        <SafeImage
          src={src ?? ""}
          alt={alt}
          fill
          sizes="64px"
          className={`object-contain p-2 transition-opacity duration-500 ease-in-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

function InfoChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300 px-3 py-2 border-2 border-slate-300 dark:border-slate-700">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm">
          {icon}
        </span>
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1 text-slate-900 dark:text-slate-100 font-medium text-sm">{value}</p>
    </div>
  );
}

export default function ShowData({ initialNews, currentPage, totalPages }: ShowDataProps) {
  const news = initialNews?.data || [];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const regionsQuery = searchParams.get("regions") || "";
  const statusesQuery = searchParams.get("statuses") || "";

  const activeRegions = useMemo(() => regionsQuery.split(",").filter(Boolean), [regionsQuery]);
  const activeStatuses = useMemo(() => statusesQuery.split(",").filter(Boolean), [statusesQuery]);

  const filtered = useMemo(() => {
    return news.filter((x) => {
      const okRegion =
        activeRegions.length === 0
          ? true
          : x.cities?.some((c: string) => activeRegions.includes(c));

      const okStatus =
        activeStatuses.length === 0
          ? true
          : activeStatuses.includes(x.status || "NEWS");

      return okRegion && okStatus;
    });
  }, [news, activeRegions, activeStatuses]);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");

  const removeFilter = (key: "statuses" | "regions", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = (params.get(key) || "").split(",").filter(Boolean);
    const updatedValues = currentValues.filter((v) => v !== value);

    if (updatedValues.length > 0) {
      params.set(key, updatedValues.join(","));
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  useEffect(() => {
    const currentQueryFromUrl = searchParams.get("query") || "";
    if (searchTerm === currentQueryFromUrl) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("query", searchTerm);
      } else {
        params.delete("query");
      }
      params.set("page", "1");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]);

  if (!initialNews.success && news.length === 0) {
    return (
      <div className="p-8 mt-10 text-center bg-white dark:bg-slate-900 rounded-lg border-2 border-slate-300 dark:border-slate-700 shadow-sm max-w-2xl mx-auto">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 border-2 border-slate-300 dark:border-slate-700">
          <CalendarRange className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium">{initialNews.message || "اطلاعاتی یافت نشد"}</p>
        <button onClick={() => router.push(pathname)} className="mt-4 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium">
          پاک کردن فیلترها و بازگشت
        </button>
      </div>
    );
  }

  return (
    <>
      {/* استایل‌های گلوبال برای انیمیشن موج‌دار Shimmer */}
      <style jsx global>{`
        @keyframes shimmer-wave {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        
        .animate-shimmer-wave {
          position: relative;
          overflow: hidden;
          background-color: rgb(226 232 240); /* slate-200 */
        }
        
        .dark .animate-shimmer-wave {
          background-color: rgb(30 41 59); /* slate-800 */
        }

        .animate-shimmer-wave::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%) skewX(-12deg);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer-wave 1.5s infinite ease-in-out;
          will-change: transform;
        }

        .dark .animate-shimmer-wave::after {
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0) 100%
          );
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto sm:px-6 mt-4">
        <div className="grid grid-cols-12 gap-4 p-4 md:p-2">
          <div className="col-span-12 lg:col-span-3">
            <FiltersSidebar startTransition={startTransition} />
          </div>

          {/* بخش محتوا و نتایج */}
          <div className="col-span-12 lg:col-span-9 relative min-h-[400px]">
            {/* لودر شناور وسط صفحه هنگام تعویض فیلتر */}
            <AnimatePresence>
              {isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-[2px] z-30 flex items-center justify-center rounded-xl"
                >
                  <div className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-800">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">در حال به‌روزرسانی...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* هدر نمایش تعداد نتایج و فیلترهای فعال با ضربدر */}
            <div className="flex flex-col gap-3 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 p-4 mb-5 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 text-sm">
                    تعداد نتایج:
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">
                      {filtered.length.toLocaleString("fa-IR")}
                    </span>
                    آگهی
                  </p>
                </div>

                {(activeStatuses.length > 0 || activeRegions.length > 0) && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                  >
                    حذف همه فیلترها
                  </button>
                )}
              </div>

              {/* تگ‌های فیلتر فعال با دکمه ضربدر */}
              {(activeStatuses.length > 0 || activeRegions.length > 0) && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-400 dark:text-slate-500">فیلترهای فعال:</span>
                  <AnimatePresence>
                    {activeStatuses.map((s) => {
                      const label = STATUS_OPTIONS.find((opt) => opt.key === s)?.label || s;
                      return (
                        <motion.span
                          key={`status-${s}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium"
                        >
                          {label}
                          <button
                            type="button"
                            onClick={() => removeFilter("statuses", s)}
                            className="hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50 rounded p-0.5 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.span>
                      );
                    })}

                    {activeRegions.map((r) => (
                      <motion.span
                        key={`region-${r}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-700/60 text-blue-700 dark:text-blue-300 text-xs font-medium"
                      >
                        {r}
                        <button
                          type="button"
                          onClick={() => removeFilter("regions", r)}
                          className="hover:bg-blue-200/50 dark:hover:bg-blue-900/50 rounded p-0.5 transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="space-y-5">
              {filtered.map((x) => (
                <div key={x.id} className="group rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300">
                  <Link
                    href={`/jobnews/government/${x.slugNews}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                      <div className="flex items-start gap-4">
                        <BrandLogo src={x.imageUrl} alt={x.organization ?? x.title} />
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="font-bold text-base leading-tight text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                              {x.title}
                            </h2>
                            <StatusBadge status={x.status || 'NEWS'} />
                          </div>

                          <p className="text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 mt-1 text-sm">
                            {x.organization && <span>{x.organization}</span>}
                            {x.organization && <span className="text-slate-300 dark:text-slate-600">•</span>}

                            <span className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border-2 border-slate-300 dark:border-slate-700">
                              <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              {x.cities && x.cities.length > 0 ? x.cities.join("، ") : "سراسر کشور"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="w-full lg:w-auto flex justify-start lg:justify-end shrink-0">
                        <CountdownTimer endAt={x.endAt} active={true} />
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <InfoChip icon={<CalendarRange className="h-4 w-4" />} label="شروع ثبت‌نام" value={formatFaDate(x.startAt)} />
                      <InfoChip icon={<CalendarRange className="h-4 w-4" />} label="پایان ثبت‌نام" value={formatFaDate(x.endAt)} />
                      <InfoChip icon={<AlarmClock className="h-4 w-4" />} label="شرط سنی" value={x.maxAge ? `حداکثر ${x.maxAge} سال` : "ندارد"} />
                    </div>

                    {x.jobs?.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2 pt-2 border-t-2 border-slate-200 dark:border-slate-800">
                        {x.jobs.map((t: string, i: number) => (
                          <span key={i} className="rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-700 px-3 py-1.5 font-medium text-slate-600 dark:text-slate-300 text-xs transition-colors cursor-default">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 flex justify-end">
                      <button className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-600 hover:border-emerald-500 shadow-md hover:shadow-lg shadow-emerald-600/20 text-white font-medium transition-all duration-300 w-full sm:w-auto transform hover:-translate-y-0.5 cursor-pointer">
                        <ExternalLink className="h-4 w-4" />
                        مشاهده جزئیات و ثبت‌نام
                      </button>
                    </div>
                  </Link>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
                  <div className="mx-auto w-16 h-16 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center mb-4 shadow-sm border-2 border-slate-300 dark:border-slate-700">
                    <MapPin className="h-8 w-8 text-slate-300 dark:text-slate-500" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">آگهی استخدامی با این فیلترها یافت نشد.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 mb-4 flex justify-center">
                <Pagination totalPages={totalPages} currentPage={currentPage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}