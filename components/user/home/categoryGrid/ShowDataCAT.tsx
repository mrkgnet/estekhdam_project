"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Grid } from "lucide-react";
import { CategoryGridSkeleton } from "@/components/ui/SkeletonLoding/CategoryGridSkeleton";
export const revalidate = 0;
export const dynamic = "force-dynamic";

// تعریف تایپ دیتابیس شما (نام فیلدها را با Prisma Schema خود چک کنید)
type CategoryType = {
  id: string; // یا number اگر آیدی شما عدد است
  catName: string; // نام دسته‌بندی
  catSlug: string; // لینک دسته‌بندی
  imageUrl?: string | null; // آیکون دسته‌بندی
};

interface ShowDataCATProps {
  response: {
    success: boolean;
    data: CategoryType[];
    message?: string;
    error?: string;
  };
}



/* ---------------- Main Component ---------------- */

export default function ShowDataCAT({ response }: ShowDataCATProps) {
  // ✅ mount state
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const showSkeleton = !mounted;

  if (showSkeleton) {
    return <CategoryGridSkeleton />;
  }

  // مدیریت حالت خطا یا نبود داده
  if (!response?.success || !response?.data || response.data.length === 0) {
    return (
      <div className="w-full text-center py-10 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
        هیچ دسته‌بندی یافت نشد.
      </div>
    );
  }

  const categories = response.data;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8  ">
      {/* بخش هدر */}
      <div className="flex items-center justify-between mb-8 px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl">

        {/* عنوان بخش */}
        <h2 className="text-sm md:text-base font-bold text-slate-800 flex items-center gap-2">
          <Grid className="w-5 h-5 text-blue-500" />
          دسته‌بندی‌ها
        </h2>

        {/* لینک مشاهده همه */}
        <Link
          href="/resources"
          className="group text-sm md:text-base font-medium text-blue-600 flex items-center gap-1.5 hover:text-blue-700 transition-colors"
        >
          <span>مشاهده همه</span>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </Link>

      </div>

      {/* بخش گرید */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-6 md:gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.catSlug}`} // استفاده از slug برای لینک‌دهی داینامیک
            className="group flex flex-col items-center gap-3 text-center"
          >
            {/* باکس طوسی رنگ آیکون */}
            <div className="w-18  aspect-square border border-slate-400 rounded-3xl flex items-center justify-center p-2 transition-all duration-300 group-hover:bg-slate-200 group-hover:-translate-y-1 group-hover:shadow-md">
              <div className="relative w-full h-full">
                <Image
                  src={category.imageUrl || "/images/default-category.png"}
                  alt={category.catName}
                  fill
                  className="object-contain"
                  style={{ mixBlendMode: "multiply" }}
                  sizes="(max-width: 768px) 50vw, 15vw"
                  priority
                  placeholder="blur"
                  blurDataURL={category.imageUrl || "/images/default-category.png"}
                />
              </div>
            </div>

            {/* عنوان دسته‌بندی */}
            <span className=" group-hover:text-blue-600 transition-colors">
              {category.catName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
