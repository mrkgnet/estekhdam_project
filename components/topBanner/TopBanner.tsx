"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { X, ArrowLeft, Megaphone, BellRing } from "lucide-react";
import { getLatestActiveBanner } from "@/actions/admin/topBanner/Actions";

const NEWS_STATUS_MAP: Record<string, string> = {
  REGISTRATION: "ثبت‌نام کنید",
  REGISTRATION_RENEWAL: "تمدید ثبت‌نام",
  CARD_RECEIVED: "دریافت کارت",
  RESULTS_ANNOUNCED: "مشاهده نتایج",
};

// نگاشت هوشمند متن دکمه بر اساس وضعیت خبر
const ACTION_BUTTON_TEXT_MAP: Record<string, string> = {
  REGISTRATION: "شروع ثبت‌نام کلیک کنید",
  REGISTRATION_RENEWAL: "برای تمدید ثبت‌نام کلیک کنید",
  CARD_RECEIVED: "برای دریافت کارت آزمون کلیک کنید",
  RESULTS_ANNOUNCED: "برای مشاهده نتایج کلیک کنید",
};

export interface BannerType {
  id: string;
  title: string;
  slug?: string;
  newsStatus?: "REGISTRATION" | "REGISTRATION_RENEWAL" | "CARD_RECEIVED" | "RESULTS_ANNOUNCED" | null;
  imageUrl?: string | null;
  targetUrl?: string | null;
  isActive: boolean;
}

interface TopBannerProps {
  initialBanner?: BannerType | null;
}

export default function TopBanner({ initialBanner }: TopBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // واکشی خودکار و همگام‌سازی لحظه‌ای با React Query
  const { data: banner } = useQuery({
    queryKey: ["latestActiveBanner"],
    queryFn: async () => {
      const res = await getLatestActiveBanner();
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    initialData: initialBanner,
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  });

  if (!isVisible || !banner || !banner.isActive) return null;

  // متن دکمه دسکتاپ و موبایل
  const actionButtonText =
    (banner.newsStatus && ACTION_BUTTON_TEXT_MAP[banner.newsStatus]) ||
    "مشاهده جزئیات";

  return (
    <div
      className="relative z-50 bg-[#3b5998] text-white shadow-md shadow-blue-950/20 border-b border-blue-400/30 overflow-hidden"
      dir="rtl"
    >
      {/* پترن پس‌زمینه نوری ملایم */}
      <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 relative">
        <div className="flex items-center justify-between gap-3">
          {/* محتوای اصلی بنر */}
          <div className="flex-1 flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* تصویر بنر یا آیکون اعلان همراه با پالس چشمک‌زن */}
            {banner.imageUrl ? (
              <div className="relative shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border-2 border-white/40 shadow-sm bg-white/10">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-80" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 shadow-sm" />
                </span>
              </div>
            ) : (
              <div className="relative shrink-0">
                <span className="flex p-2 rounded-lg bg-white/15 border border-white/25 shadow-inner backdrop-blur-sm">
                  <Megaphone className="h-4 w-4 text-white animate-bounce" aria-hidden="true" />
                </span>
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-90" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 shadow-sm" />
                </span>
              </div>
            )}

            {/* نشان وضعیت خبر و متن بنر */}
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              {/* {banner.newsStatus && banner.newsStatus !== "NONE" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900 shadow-sm shrink-0">
                  <BellRing className="w-3 h-3 text-slate-900 animate-pulse" />
                  {NEWS_STATUS_MAP[banner.newsStatus] || banner.newsStatus}
                </span>
              )} */}

              <p className="font-semibold text-base leading-snug truncate text-white drop-shadow-sm">
                {banner.title}
              </p>

              {/* دکمه اکشن اختصاصی متناسب با وضعیت (دسکتاپ) */}
              {banner.targetUrl && (
                <Link
                  href={banner.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-[#1e40af] hover:text-blue-900 px-3.5 py-1.5 rounded-full transition-all duration-200 shadow hover:shadow-md shrink-0 hover:scale-105 active:scale-95 border border-white/80"
                >
                  <span>{actionButtonText}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* کلیدهای سمت چپ (لینک در موبایل + دکمه بستن) */}
          <div className="flex items-center gap-2 shrink-0">
            {banner.targetUrl && (
              <Link
                href={banner.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="md:hidden inline-flex items-center gap-1 text-[12px] font-bold bg-white text-[#1e40af] px-2.5 py-1 rounded-full shadow-sm shrink-0"
              >
                <span>
                  {banner.newsStatus && NEWS_STATUS_MAP[banner.newsStatus]
                    ? NEWS_STATUS_MAP[banner.newsStatus]
                    : "مشاهده"}
                </span>
                <ArrowLeft className="w-3 h-3" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="p-1 sm:p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
              title="بستن بنر"
              aria-label="بستن بنر"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}