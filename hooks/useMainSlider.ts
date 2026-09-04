"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMainSliderUserAction } from "@/actions/user/mainslider/fetch/Actions";

export const sliderKeys = {
  all: ["main-slider"] as const,
};

export function useMainSlider(initialData?: any) {
  return useQuery({
    queryKey: sliderKeys.all,
    queryFn: () => fetchMainSliderUserAction(),
    initialData,
    staleTime: 1000 * 60 * 60 * 12, // ۱۲ ساعت معتبر در حافظه رم مرورگر
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false, // جلوگیری از کوئری تکراری موقع تعویض تب
    refetchOnMount: false,
  });
}