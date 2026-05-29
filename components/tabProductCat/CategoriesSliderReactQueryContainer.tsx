"use client";

import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { productByCatAction } from '@/actions/user/home/productAndCategories/fetchProductByCat/Actions';
import ShowDataTabProCat from './ShowDataTabProCat';

export default function CategoriesSliderContainer({ initialData }: { initialData: any }) {
  // استفاده از ریکت کوئری برای واکشی ریل‌تایم دیتا
  const { data: response, isLoading } = useQuery({
    queryKey: ["categories-products"],
    queryFn: () => productByCatAction(),
    initialData: { success: true, data: initialData },
    staleTime: 0,
    refetchInterval: 10000, // آپدیت خودکار هر 10 ثانیه
    refetchOnWindowFocus: true, // آپدیت در صورت بازگشت به تب مرورگر
  });

  const categories = response?.data || [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-12 w-full">
      {/* روی تک‌تک دسته‌های اصلی حلقه می‌زنیم */}
      {categories.map((mainCategory: any) => (
        <ShowDataTabProCat
          key={mainCategory.id}
          mainCategory={mainCategory}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}