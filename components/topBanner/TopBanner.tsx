"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { X, ArrowLeft, Megaphone } from "lucide-react";
import { getLatestActiveBanner } from "@/actions/admin/topBanner/Actions";

/* ============================================================
   News Status
============================================================ */

const NEWS_STATUS_MAP: Record<string, string> = {
  REGISTRATION: "ثبت‌نام کنید",
  REGISTRATION_RENEWAL: "تمدید ثبت‌نام",
  CARD_RECEIVED: "دریافت کارت",
  RESULTS_ANNOUNCED: "مشاهده نتایج",
};

/* ============================================================
   Action Button Text
============================================================ */

const ACTION_BUTTON_TEXT_MAP: Record<string, string> = {
  REGISTRATION: "شروع ثبت‌نام کلیک کنید",
  REGISTRATION_RENEWAL: "برای تمدید ثبت‌نام کلیک کنید",
  CARD_RECEIVED: "برای دریافت کارت آزمون کلیک کنید",
  RESULTS_ANNOUNCED: "برای مشاهده نتایج کلیک کنید",
};

/* ============================================================
   Banner Type
============================================================ */

export interface BannerType {
  id: string;
  title: string;
  slug?: string;

  newsStatus?:
    | "REGISTRATION"
    | "REGISTRATION_RENEWAL"
    | "CARD_RECEIVED"
    | "RESULTS_ANNOUNCED"
    | null;

  imageUrl?: string | null;
  targetUrl?: string | null;
  isActive: boolean;
}

/* ============================================================
   Skeleton Loader
============================================================ */

function TopBannerSkeleton() {
  return (
    <div
      className="relative z-50 overflow-hidden border-b border-blue-400/30 bg-[#3b5998] text-white shadow-md shadow-blue-950/20"
      dir="rtl"
      aria-hidden="true"
    >
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-3 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          {/* Right/Main Content */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            {/* Skeleton Icon */}
            <div className="relative shrink-0">
              <div className="relative h-9 w-9 overflow-hidden rounded-lg border-2 border-white/20 bg-white/15 sm:h-10 sm:w-10">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>

              {/* Notification Dot */}
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400/70" />
              </span>
            </div>

            {/* Skeleton Text */}
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {/* Title Skeleton */}
              <div className="relative h-5 w-40 overflow-hidden rounded-md bg-white/15 sm:w-56 md:w-72">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>

              {/* Desktop Button Skeleton */}
              <div className="relative hidden h-7 w-36 shrink-0 overflow-hidden rounded-full bg-white/15 md:block">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </div>
          </div>

          {/* Left Side */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Mobile Button Skeleton */}
            <div className="relative h-6 w-20 shrink-0 overflow-hidden rounded-full bg-white/15 md:hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>

            {/* Close Button Skeleton */}
            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg bg-white/15">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Shimmer */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden bg-white/10">
        <div className="h-full w-1/3 -translate-x-full animate-[shimmer_1.8s_infinite] bg-white/50" />
      </div>
    </div>
  );
}

/* ============================================================
   Top Banner
============================================================ */

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const {
    data: banner,
    isLoading,
    isFetching,
  } = useQuery<BannerType | null>({
    queryKey: ["latestActiveBanner"],

    queryFn: async () => {
      const response = await getLatestActiveBanner();

      if (!response.success) {
        throw new Error(
          response.error || "خطا در واکشی آخرین بنر"
        );
      }

      /*
       * اگر دیتابیس Banner نداشت،
       * حتماً null برگردان.
       *
       * این قسمت بسیار مهم است.
       */
      return response.data ?? null;
    },

    /*
     * همیشه داده Cache شده را stale در نظر بگیر.
     */
    staleTime: 0,

    /*
     * هنگام Mount مجدداً از Server واکشی کن.
     */
    refetchOnMount: "always",

    /*
     * هنگام برگشت به Tab دوباره بررسی شود.
     */
    refetchOnWindowFocus: true,

    /*
     * هنگام reconnect دوباره بررسی شود.
     */
    refetchOnReconnect: true,

    /*
     * هر 10 ثانیه دیتابیس بررسی شود.
     */
    refetchInterval: 10000,

    /*
     * هیچ Placeholder یا Initial Data استفاده نمی‌کنیم.
     *
     * بنابراین Banner قبلی به عنوان Placeholder
     * نمایش داده نمی‌شود.
     */
    placeholderData: undefined,

    /*
     * در صورت خطا دو بار تلاش شود.
     */
    retry: 2,

    /*
     * فقط تغییرات مرتبط با این موارد باعث Render می‌شود.
     */
    notifyOnChangeProps: [
      "data",
      "isLoading",
      "isFetching",
    ],
  });

  /* ============================================================
     User Closed Banner
  ============================================================ */

  if (!isVisible) {
    return null;
  }

  /* ============================================================
     Initial Loading
  ============================================================ */

  /*
   * فقط در اولین درخواست Skeleton نمایش داده می‌شود.
   *
   * در Fetchهای بعدی:
   *
   * isLoading = false
   * isFetching = true
   *
   * بنابراین Skeleton دوباره نمایش داده نمی‌شود.
   */
  if (isLoading) {
    return <TopBannerSkeleton />;
  }

  /* ============================================================
     No Active Banner
  ============================================================ */

  /*
   * اگر Banner از دیتابیس حذف شده باشد
   * یا isActive = false باشد،
   * کاملاً حذف می‌شود.
   */
  if (!banner || !banner.isActive) {
    return null;
  }

  /* ============================================================
     Action Button Text
  ============================================================ */

  const actionButtonText =
    (banner.newsStatus &&
      ACTION_BUTTON_TEXT_MAP[banner.newsStatus]) ||
    "مشاهده جزئیات";

  /* ============================================================
     Render
  ============================================================ */

  return (
    <div
      className="relative z-50 overflow-hidden border-b border-blue-400/30 bg-[#3b5998] text-white shadow-md shadow-blue-950/20"
      dir="rtl"
    >
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

      {/* Main Container */}
      <div className="relative mx-auto max-w-7xl px-3 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">

          {/* ==================================================
              Main Content
          ================================================== */}

          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">

            {/* ==================================================
                Banner Image / Icon
            ================================================== */}

            {banner.imageUrl ? (
              <div className="relative shrink-0">
                <div className="h-9 w-9 overflow-hidden rounded-lg border-2 border-white/40 bg-white/10 shadow-sm sm:h-10 sm:w-10">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Notification Dot */}
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-80" />

                  <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400 shadow-sm" />
                </span>
              </div>
            ) : (
              <div className="relative shrink-0">
                <span className="flex rounded-lg border border-white/25 bg-white/15 p-2 shadow-inner backdrop-blur-sm">
                  <Megaphone
                    className="h-4 w-4 animate-bounce text-white"
                    aria-hidden="true"
                  />
                </span>

                {/* Notification Dot */}
                <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-90" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400 shadow-sm" />
                </span>
              </div>
            )}

            {/* ==================================================
                Title + Desktop Button
            ================================================== */}

            <div className="flex min-w-0 flex-wrap items-center gap-2">

              {/* Title */}
              <p className="truncate text-base font-semibold leading-snug text-white drop-shadow-sm">
                {banner.title}
              </p>

              {/* Desktop Action Button */}
              {banner.targetUrl && (
                <Link
                  href={banner.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/80 bg-white px-3.5 py-1.5 text-xs font-bold text-[#1e40af] shadow transition-all duration-200 hover:scale-105 hover:bg-slate-50 hover:text-blue-900 hover:shadow-md active:scale-95 md:inline-flex"
                >
                  <span>{actionButtonText}</span>

                  <ArrowLeft className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* ==================================================
              Left Side
          ================================================== */}

          <div className="flex shrink-0 items-center gap-2">

            {/* Mobile Action Button */}
            {banner.targetUrl && (
              <Link
                href={banner.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[12px] font-bold text-[#1e40af] shadow-sm md:hidden"
              >
                <span>
                  {banner.newsStatus &&
                  NEWS_STATUS_MAP[banner.newsStatus]
                    ? NEWS_STATUS_MAP[banner.newsStatus]
                    : "مشاهده"}
                </span>

                <ArrowLeft className="h-3 w-3" />
              </Link>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="rounded-lg p-1 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white sm:p-1.5"
              title="بستن بنر"
              aria-label="بستن بنر"
            >
              <X
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          Fetch Indicator
          
          این قسمت فقط در Fetchهای بعدی نمایش داده می‌شود.
          
          نکته:
          در این مرحله Banner فعلی همچنان نمایش داده می‌شود.
          
          اگر Fetch جدید مقدار null برگرداند،
          React Query مقدار data را null می‌کند
          و در Render بعدی Banner حذف خواهد شد.
      ======================================================== */}

      {isFetching && !isLoading && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden bg-white/10">
          <div className="h-full w-1/3 -translate-x-full animate-[shimmer_1.2s_infinite] bg-white/50" />
        </div>
      )}
    </div>
  );
}