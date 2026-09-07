"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchPaginatedProductsAction,
  ProductType,
} from "@/actions/user/latestProduct/Actions";

export const PRODUCT_SLIDER_QUERY_KEY = ["paginated-products"] as const;

interface UseSliderSLTLProductsOptions {
  page: number;
  initialData?: ProductType[];
}

export function useSliderSLTLProducts({
  page,
  initialData,
}: UseSliderSLTLProductsOptions) {
  return useQuery({
    queryKey: [...PRODUCT_SLIDER_QUERY_KEY, page],
    queryFn: async () => {
      const res = await fetchPaginatedProductsAction(page);
      if (!res.success) {
        throw new Error("خطا در دریافت لیست محصولات");
      }
      return res.data;
    },
    initialData:
      page === 1 && initialData && initialData.length > 0
        ? initialData
        : undefined,
    staleTime: 1000 * 60 * 5, // ۵ دقیقه عدم رکوئست تکراری
    gcTime: 1000 * 60 * 30, // ۳۰ دقیقه ماندگاری در مموری
  });
}