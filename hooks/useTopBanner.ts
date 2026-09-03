// hooks/useTopBanner.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getLatestActiveBanner } from "@/actions/admin/topBanner/Actions";

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

// کلید ثابت و استاندارد برای استفاده در هوک و باطل‌سازی کش در ادمین
export const TOP_BANNER_KEY = ["latestActiveBanner"] as const;

export function useTopBanner(initialBanner?: BannerType | null) {
  return useQuery<BannerType | null>({
    queryKey: TOP_BANNER_KEY,
    queryFn: async () => {
      const response = await getLatestActiveBanner();
      if (!response.success) {
        throw new Error(response.error || "خطا در واکشی آخرین بنر");
      }
      return response.data ?? null;
    },
    // دیتای اولیه از SSR برای جلوگیری از اسکلتون اولیه
    initialData: initialBanner,
    // بنر بالا را می‌توان ۱۰ تا ۱۵ دقیقه بدون فچ مجدد تازه نگه داشت
    staleTime: 1000 * 60 * 10, // 10 Minutes
    gcTime: 1000 * 60 * 60, // 1 Hour
    refetchOnWindowFocus: false, // جلوگیری از ریکوئست مکرر هنگام سوییچ تب‌ها
    refetchOnMount: false, // استفاده از دیتای کش یا initialData
    retry: 2,
  });
}