"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPaginatedProductsAction, ProductType } from "@/actions/user/latestProduct/Actions";

export const PRODUCT_SLIDER_QUERY_KEY = ["paginated-products"] as const;

interface UsePaginatedProductsOptions {
  page: number;
  initialData?: ProductType[];
}

export function usePaginatedProducts({ page, initialData }: UsePaginatedProductsOptions) {
  return useQuery({
    queryKey: [...PRODUCT_SLIDER_QUERY_KEY, page],
    queryFn: async () => {
      const res = await fetchPaginatedProductsAction(page);
      if (!res.success) {
        throw new Error("خطا در دریافت لیست محصولات");
      }
      return res.data;
    },
    // صفحه اول دیتای اولیه سرور را دریافت می‌کند تا از Layout Shift جلوگیری شود
    initialData: page === 1 && initialData && initialData.length > 0 ? initialData : undefined,
    staleTime: 1000 * 60 * 5, // اطلاعات تا ۵ دقیقه تازه محسوب می‌شود
    gcTime: 1000 * 60 * 30, // ۳۰ دقیقه در حافظه کلاینت می‌ماند
  });
}