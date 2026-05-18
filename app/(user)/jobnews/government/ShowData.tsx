"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AlarmClock, CalendarRange, MapPin, Wallet, ExternalLink, ArrowLeft, Home, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FiltersSidebar from "@/components/FiltersSidebar";
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

function formatToman(amount?: number | null) {
  if (amount == null) return "نامشخص";
  if (amount === 0) return "رایگان";
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

function BrandLogo({ src, alt }: { src?: string | null; alt: string }) {
  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <SafeImage
        src={src ?? ''} // اگر src وجود نداشت یک رشته خالی بفرستید تا getSafeImageUrl آن را مدیریت کند
        alt={alt}
        fill
        className="object-contain p-2"
      // اگر می‌خواهید برای لوگوها عکس جایگزین متفاوتی داشته باشید:
      // onError={(e) => { e.currentTarget.src = '/images/default-logo.png'; }}
      />
    </div>
  );
}

function InfoChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl   bg-slate-50/80 hover:bg-slate-100 transition-colors duration-300 px-3 py-2 border border-slate-100/50">
      <div className="flex items-center gap-2  text-slate-500">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-700 shadow-sm">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <p className="mt-1  text-slate-900 font-medium">{value}</p>
    </div>
  );
}

export default function ShowData({ initialNews, currentPage, totalPages }: ShowDataProps) {
  const news = initialNews?.data || [];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 🟢 اصلاح ۱: برای جلوگیری از رندر مجدد useMemo، به جای آرایه، استرینگ را می‌گیریم
  const regionsQuery = searchParams.get("regions") || "";
  const statusesQuery = searchParams.get("statuses") || "";
  const filtered = useMemo(() => {
    const activeRegions = regionsQuery.split(",").filter(Boolean);
    const activeStatuses = statusesQuery.split(",").filter(Boolean);

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
  }, [news, regionsQuery, statusesQuery]); // اینجا فقط به استرینگ وابسته هستیم نه یک آرایه جدید در هر رندر

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");

  // 🟢 اصلاح ۲: حل مشکل لوپ بی‌نهایت
  useEffect(() => {
    const currentQueryFromUrl = searchParams.get("query") || "";

    // 🔥 ترمز (Circuit Breaker): 
    // اگر کلمه‌ای که تایپ شده دقیقا همانی است که الان در URL وجود دارد، کاری نکن و خارج شو!
    if (searchTerm === currentQueryFromUrl) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString()); // حتما toString() بگذارید

      if (searchTerm) {
        params.set("query", searchTerm);
      } else {
        params.delete("query");
      }

      // چون مطمئنیم کوئری تغییر کرده، پس صفحه را ۱ میکنیم
      params.set("page", "1");

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]); // حالا وجود searchParams بی‌خطر است


  if (!initialNews.success && news.length === 0) {
    return (
      <div className="p-8 mt-10 text-center bg-white rounded border border-slate-200 shadow-sm max-w-2xl mx-auto">
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <CalendarRange className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-slate-600 font-medium">{initialNews.message || "اطلاعاتی یافت نشد"}</p>
        <button onClick={() => router.push(pathname)} className="mt-4 text-emerald-600 hover:text-emerald-700  ">
          پاک کردن فیلترها و بازگشت
        </button>
      </div>
    )
  }



  return (
    <div className="w-full max-w-7xl mx-auto  sm:px-6  mt-4">
      <div className="grid grid-cols-12 gap-4 p-4 md:p-2 ">
        <div className="col-span-12 lg:col-span-3">
          <FiltersSidebar />
        </div>
        {/* سمت چپ  */}
        <div className="col-span-12 lg:col-span-9">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-4 mb-5 rounded shadow-sm">
            {/* بخش تعداد نتایج (در موبایل میره دوم) */}
            <div className="w-full md:w-auto text-right order-1 md:order-1">
              <p className="text-slate-600   flex items-center gap-1.5">
                تعداد نتایج:
                <span className="text-emerald-600 font-black ">
                  {filtered.length.toLocaleString("fa-IR")}
                </span>
                آگهی
              </p>
            </div>

          </div>


          <div className="space-y-5">
            {filtered.map((x) => {
              return (


                <div key={x.id} className="group rounded-xl border border-slate-200 bg-white p-5 hover:shadow-xl hover:border-emerald-100 transition-all duration-500">
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
                            <h2 className="font-bold  text-base leading-tight group-hover:text-emerald-700 transition-colors">
                              {x.title}
                            </h2>
                            <StatusBadge status={x.status || 'NEWS'} />
                          </div>

                          <p className="text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                            {x.organization && <span className=" ">{x.organization}</span>}
                            {x.organization && <span className="text-slate-300">•</span>}

                            <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                              {x.cities && x.cities.length > 0 ? x.cities.join("، ") : "سراسر کشور"}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="w-full lg:w-auto flex justify-start lg:justify-end shrink-0">
                        <CountdownTimer endAt={x.endAt} active={true} />
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <InfoChip icon={<CalendarRange className="h-4 w-4" />} label="شروع ثبت‌نام" value={formatFaDate(x.startAt)} />
                      <InfoChip icon={<CalendarRange className="h-4 w-4" />} label="پایان ثبت‌نام" value={formatFaDate(x.endAt)} />
                      <InfoChip icon={<Wallet className="h-4 w-4" />} label="هزینه ثبت‌نام" value={formatToman(x.price)} />
                      <InfoChip icon={<AlarmClock className="h-4 w-4" />} label="شرط سنی" value={x.maxAge ? `حداکثر ${x.maxAge} سال` : "ندارد"} />
                    </div>

                    {x.jobs?.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2 pt-5 border-t border-slate-100/80">
                        {x.jobs.map((t: string, i: number) => (
                          <span key={i} className="rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 font-medium text-slate-600 transition-colors cursor-default">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-5 flex justify-end">

                      <button className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3  bg-emerald-600 hover:bg-emerald-500 shadow-md hover:shadow-lg shadow-emerald-600/20 text-white transition-all duration-300 w-full sm:w-auto transform hover:-translate-y-0.5">
                        <ExternalLink className="h-4 w-4" />
                        مشاهده جزئیات و ثبت‌نام
                      </button>
                    </div>
                  </Link>
                </div>

              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16 bg-slate-50 rounded border-2 border-dashed border-slate-200">
                <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <MapPin className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium ">آگهی استخدامی با این فیلترها یافت نشد.</p>
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
  );
}
