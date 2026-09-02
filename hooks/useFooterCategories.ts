// hooks/useFooterCategories.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { dataFooter } from "@/actions/footer/Actions";
import { CategoryParentItem } from "@/components/footer/Footer";

export const FOOTER_CATEGORIES_KEY = ["footer", "categories"] as const;

export function useFooterCategories(initialData?: CategoryParentItem[]) {
  return useQuery({
    queryKey: FOOTER_CATEGORIES_KEY,
    queryFn: async () => {
      const res = await dataFooter();
      if (!res.success) {
        throw new Error(res.error || "خطا در دریافت دسته‌بندی‌ها");
      }
      return (res.data as unknown as CategoryParentItem[]) || [];
    },
    // دیتای اولیه از SSR تزریق می‌شود
    initialData,
    // دیتای فوتر تا ۱۲ ساعت تر و تازه (fresh) در نظر گرفته شود و واکشی مجدد نشود
    staleTime: 1000 * 60 * 60 * 12, // 12 Hours
    // نگهداری در کش تا ۲۴ ساعت در صورت عدم استفاده
    gcTime: 1000 * 60 * 60 * 24, // 24 Hours
    refetchOnWindowFocus: false, // جلوگیری از ریکوئست مجدد هنگام تغییر تب مرورگر
    refetchOnMount: false, // جلوگیری از فچ مجدد با هربار رفتن به صفحه دیگر
  });
}