"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  AlarmClock,
  ArrowLeft,
  BookOpen,
  CalendarRange,
  ChevronLeft,
  Home,
  Info,
  MapPin,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CommentManagment from "@/components/comment/CommentManagmet";
import CountdownTimer from "@/components/CountdownTimer";
import RecomendedProduct from "@/components/user/RecomendedProduct";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

// ---------------- Types & Helpers ----------------

export type NewsStatus = 'OPEN' | 'CARD_RECEIVED' | 'RESULTS_ANNOUNCED' | 'NEWS';

type News = {
  id: string;
  title: string;
  status: NewsStatus;
  slugNews: string;
  organization?: string;
  description?: string;
  imageUrl?: string;
  registerUrl: String;
  price?: number;
  maxAge?: number;
  startAt: string;
  endAt: string;
  jobs: string[];
  cities: string[];
  products?: ProductType[];
};

export type ProductType = {
  id: string;
  name: string;
  slug: string;
  oldPrice?: number;
  newPrice: number;
  imageUrl?: string | null;
};

type RegState = "NOT_STARTED" | "OPEN" | "CLOSING_SOON" | "CLOSED";

const StatusBadge = ({ status }: { status: NewsStatus }) => {
  const config = {
    OPEN: {
      text: "در حال ثبت‌نام",
      color: "text-emerald-700 dark:text-emerald-400", 
      bg: "bg-emerald-100 dark:bg-emerald-950/50", 
      border: "border-2 border-emerald-400 dark:border-emerald-700", 
      dot: "bg-emerald-500",
      animate: true
    },
    CARD_RECEIVED: {
      text: "دریافت کارت",
      color: "text-blue-700 dark:text-blue-400", 
      bg: "bg-blue-100 dark:bg-blue-950/50", 
      border: "border-2 border-blue-400 dark:border-blue-700", 
      dot: "bg-blue-500",
      animate: true
    },
    RESULTS_ANNOUNCED: {
      text: "اعلام نتایج",
      color: "text-fuchsia-700 dark:text-fuchsia-400", 
      bg: "bg-fuchsia-100 dark:bg-fuchsia-950/50", 
      border: "border-2 border-fuchsia-400 dark:border-fuchsia-700", 
      dot: "bg-fuchsia-500",
      animate: false
    },
    NEWS: {
      text: "فقط خبر",
      color: "text-slate-700 dark:text-slate-300", 
      bg: "bg-slate-200 dark:bg-slate-800", 
      border: "border-2 border-slate-400 dark:border-slate-600", 
      dot: "bg-slate-500",
      animate: false
    },
  };

  const current = config[status] || config.NEWS;

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md ${current.bg} ${current.border} shadow-sm`}>
      <span className="relative flex h-2.5 w-2.5">
        {current.animate && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${current.dot}`}></span>
      </span>
      <span className={`text-[11px] font-medium tracking-wide ${current.color}`}>
        {current.text}
      </span>
    </div>
  );
};

function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function getRegState(startAt: string, endAt: string): RegState {
  const now = Date.now();
  const s = new Date(startAt).getTime();
  const e = new Date(endAt).getTime();
  if (now < s) return "NOT_STARTED";
  if (now > e) return "CLOSED";
  const hoursLeft = (e - now) / 36e5;
  return hoursLeft <= 48 ? "CLOSING_SOON" : "OPEN";
}

function formatFaDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(d);
}

function formatToman(amount?: number) {
  if (amount == null) return "نامشخص";
  if (amount === 0) return "رایگان";
  return `${amount.toLocaleString("fa-IR")} تومان`;
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        {icon}
        {label}
      </div>
      <p className="mt-2 font-medium text-slate-900 dark:text-slate-100 text-sm">{value}</p>
    </div>
  );
}

/**
 * کامپوننت تصویر با افکت Shimmer موج‌دار
 */
function LogoWithShimmer({ src, alt }: { src?: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className="relative h-16 w-16 rounded-lg overflow-hidden border-2 border-slate-300 dark:border-slate-700 shadow-sm shrink-0 bg-white dark:bg-slate-800">
      {/* لایه Shimmer موج‌دار */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 bg-slate-200 dark:bg-slate-800 animate-shimmer-wave" />
      )}

      {/* حالت خطا */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
          <span className="text-[10px] font-bold">تصویر</span>
        </div>
      )}

      {/* تصویر اصلی */}
      {src && !hasError && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="64px"
          className={`object-cover p-1 transition-opacity duration-500 ease-in-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

// ---------------- Main Component ----------------

export default function ShowData({ initialNews }: { initialNews: News }) {
  const item = initialNews;

  const mounted = useHasMounted();
  const [tab, setTab] = useState("desc");
  const router = useRouter();

  const regState = mounted ? getRegState(item.startAt, item.endAt) : "NOT_STARTED";
  const canRegister = regState === "OPEN" || regState === "CLOSING_SOON";

  const breadcrumbItems = [
    {
      label: 'اخبار استخدامی دولتی',
      href: '/jobnews/government',
    },
    {
      label: item.title,
      href: `/jobnews/government/${item.slugNews}`,
    },
  ];

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

      <div className="w-full mx-auto max-w-6xl px-4 md:px-6 lg:px-8 overflow-x-hidden">
        <div>
          <div className="mt-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* کارت اصلی آگهی */}
          <div className="rounded-lg bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-sm p-5 md:p-6">
            <div className="flex justify-between gap-6 flex-wrap">
              <div className="flex gap-5">
                {/* استفاده از کامپوننت جدید با شیدینگ */}
                <LogoWithShimmer src={item.imageUrl} alt={item.title} />
                
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-medium text-slate-800 dark:text-slate-100 text-base md:text-lg">
                      {item.title}
                    </h1>
                    <StatusBadge status={item.status || 'NEWS'} />
                  </div>

                  <div className="flex flex-wrap gap-4 text-slate-600 dark:text-slate-400 text-sm">
                    {item.organization && (
                      <span className="flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        {item.organization}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {item.cities?.join("، ") || "سراسری"}
                    </span>
                  </div>

                  {item.jobs?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.jobs.map((job) => (
                        <span 
                          key={job} 
                          className="px-3 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                        >
                          {job}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <CountdownTimer endAt={item.endAt} active={canRegister} />
              </div>
            </div>
          </div>

          {/* کارت‌های اطلاعات */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            <InfoCard icon={<CalendarRange className="w-4 h-4" />} label="شروع ثبت نام" value={formatFaDate(item.startAt)} />
            <InfoCard icon={<CalendarRange className="w-4 h-4" />} label="پایان ثبت نام" value={formatFaDate(item.endAt)} />
            <InfoCard icon={<Wallet className="w-4 h-4" />} label="هزینه" value={formatToman(item.price)} />
            <InfoCard icon={<Info className="w-4 h-4" />} label="شناسه" value={item.id.slice(-6)} />
          </div>

          <div className="grid grid-cols-12 gap-5 mt-6">
            <div className="col-span-12 lg:col-span-8 space-y-4">
              {/* دکمه‌های تب */}
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-lg p-2 flex flex-wrap sm:flex-nowrap gap-2">
                <button 
                  onClick={() => setTab("desc")} 
                  className={`w-full lg:w-auto px-4 py-2.5 rounded-md font-medium transition-colors text-sm ${
                    tab === "desc" 
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  توضیحات
                </button>
                <button 
                  onClick={() => setTab("jobs")} 
                  className={`w-full lg:w-auto px-4 py-2.5 rounded-md font-medium transition-colors text-sm ${
                    tab === "jobs" 
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md" 
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  رشته‌های شغلی
                </button>
              </div>

              {tab === "desc" && (
                <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-lg p-5 md:p-6 min-h-[200px]">
                  <div className="flex gap-2.5 mb-4 items-center border-b-2 border-slate-200 dark:border-slate-800 pb-3">
                    <Info className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <h2 className="font-medium text-slate-800 dark:text-slate-100">توضیحات آزمون</h2>
                  </div>
                  <div className="leading-8 text-slate-700 dark:text-slate-300 prose prose-sm max-w-none overflow-x-auto break-words">
                    {item?.description ? (
                      <div
                        className="prose max-w-none prose-slate dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 italic">
                        توضیحاتی برای این آزمون ثبت نشده است.
                      </span>
                    )}
                  </div>
                </div>
              )}

              {tab === "jobs" && (
                <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-lg p-5 md:p-6 min-h-[200px]">
                  <div className="flex gap-2.5 mb-4 items-center border-b-2 border-slate-200 dark:border-slate-800 pb-3">
                    <BookOpen className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    <h2 className="font-medium text-slate-800 dark:text-slate-100">مشاغل مورد نیاز</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.jobs.map((job) => (
                      <span 
                        key={job} 
                        className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-md font-medium text-slate-700 dark:text-slate-300 text-sm"
                      >
                        {job}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-12 lg:col-span-4">
              <div className="sticky top-5 space-y-4">
                {/* کارت ثبت نام */}
                <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-lg p-4">
                  {item.registerUrl ? (
                    <Link 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      href={item.registerUrl.toString()} 
                      className="w-full block text-white bg-emerald-600 hover:bg-emerald-500 border-2 border-emerald-600 hover:border-emerald-500 py-3 rounded-lg text-center font-medium shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 duration-300"
                    >
                      ثبت نام در آزمون
                    </Link>
                  ) : (
                    <div className="w-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-3 rounded-lg text-center border-2 border-slate-300 dark:border-slate-700 font-medium">
                      لینک ثبت‌نام موجود نیست
                    </div>
                  )}
                </div>

                {/* کارت محدودیت سنی */}
                {item.maxAge && (
                  <div className="rounded-lg border-2 border-amber-400 dark:border-amber-700 bg-amber-100 dark:bg-amber-950/50 p-5">
                    <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-400 font-medium">
                      <AlarmClock className="w-5 h-5" />
                      محدودیت سنی
                    </div>
                    <p className="mt-2 text-amber-900 dark:text-amber-300 text-sm">
                      حداکثر سن مجاز برای ثبت‌نام <span className="font-bold">{item.maxAge}</span> سال می‌باشد.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full overflow-hidden">
            {item.products && item.products.length > 0 && (
              <section className="mt-8">
                <RecomendedProduct
                  title="منابع مطالعاتی مرتبط"
                  products={item.products}
                  slug={item.slugNews}
                />
              </section>
            )}
          </div>

          <CommentManagment targetId={item.id} targetType="governmentNews" />
        </div>
      </div>
    </>
  );
}ر-