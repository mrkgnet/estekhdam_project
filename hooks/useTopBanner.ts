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
    initialData: initialBanner,
    staleTime: 1000 * 60 * 60 * 12, // ۱۲ ساعت پایدار در رم کلاینت
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
  });
}