"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { X, ArrowLeft, Megaphone } from "lucide-react";
import { getLatestActiveBanner } from "@/actions/admin/topBanner/Actions";

export interface BannerType {
  id: string;
  title: string;
  slug?: string;
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
    refetchOnWindowFocus: true, // به‌روزرسانی هنگام بازگشت به تب مرورگر
    refetchInterval: 10000,     // پولینگ هر ۱۰ ثانیه برای تغییرات ریل‌تایم
  });

  if (!isVisible || !banner || !banner.isActive) return null;

  return (
    <div className="bg-[#3b5998] text-white relative shadow-md" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3">

          {/* محتوای بنر و لینک */}
          <div className="flex-1 flex items-center gap-3 min-w-0">
            {banner.imageUrl ? (
              <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 border border-white/20 bg-white/10 shadow-sm">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <span className="flex p-2 rounded-lg bg-white/20 shrink-0">
                <Megaphone className="h-4 w-4 text-white" aria-hidden="true" />
              </span>
            )}

            <div className="flex items-center gap-3 flex-wrap min-w-0">
              <p className="font-medium text-sm sm:text-base truncate text-white">
                {banner.title}
              </p>

              {banner.targetUrl && (
                <Link
                  href={banner.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold bg-white text-[#3b5998] hover:bg-slate-100 px-3 py-1 rounded-full transition-colors shrink-0 shadow-sm"
                >
                  مشاهده جزئیات
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* دکمه بستن بنر */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="flex p-1.5 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
              title="بستن بنر"
            >
              <span className="sr-only">بستن</span>
              <X className="h-4 w-4 text-white" aria-hidden="true" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}