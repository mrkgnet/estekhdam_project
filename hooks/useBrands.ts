'use client';

import { useQuery } from '@tanstack/react-query';
import { getActiveBrands } from '@/actions/brands/Actions';

export const BRANDS_QUERY_KEY = ['active-brands'] as const;

export interface BrandItemType {
  id: number;
  title: string;
  imageUrl: string;
}

export function useBrands(initialData?: BrandItemType[]) {
  return useQuery({
    queryKey: BRANDS_QUERY_KEY,
    queryFn: async () => {
      const activeBrands = await getActiveBrands();
      return activeBrands as BrandItemType[];
    },
    initialData: initialData,
    staleTime: 1000 * 60 * 60 * 12, // ۱۲ ساعت بدون نیاز به رفرش مجدد
    gcTime: 1000 * 60 * 60 * 24,    // نگهداری در حافظه رم تا ۲۴ ساعت
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}