// hooks/useBrands.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getBrands } from '@/actions/brands/Actions';

export const BRANDS_QUERY_KEY = ['brands'] as const;

export interface BrandItemType {
  id: number;
  title: string;
  imageUrl: string;
  isActive?: boolean;
}

export function useBrands(initialData?: BrandItemType[]) {
  return useQuery({
    queryKey: BRANDS_QUERY_KEY,
    queryFn: async () => {
      const res = await getBrands();
      if (!res.success) {
        throw new Error('خطا در دریافت لیست برندها');
      }
      // تنها برندهای فعال برای صفحه اصلی فیلتر می‌شوند
      return res.data.filter((b) => b.isActive) as BrandItemType[];
    },
    initialData: initialData,
    staleTime: 1000 * 60 * 10, // دیتای کش‌شده تا ۱۰ دقیقه تازه (fresh) تلقی شود
    gcTime: 1000 * 60 * 60,    // نگهداری در حافظه کش تا ۱ ساعت
    refetchOnWindowFocus: false,
  });
}