"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Grid } from "lucide-react";
import { CategoryGridSkeleton } from "@/components/ui/SkeletonLoding/CategoryGridSkeleton";
export const revalidate = 0;
export const dynamic = "force-dynamic";

type CategoryType = {
  id: string;
  catName: string;
  catSlug: string;
  imageUrl?: string | null;
};

interface ShowDataCATProps {
  response: {
    success: boolean;
    data: CategoryType[];
    message?: string;
    error?: string;
  };
}

export default function ShowDataCAT({ response }: ShowDataCATProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <CategoryGridSkeleton />;

  if (!response?.success || !response?.data || response.data.length === 0) {
    return (
      <div className="w-full text-center py-10 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
        هیچ دسته‌بندی یافت نشد.
      </div>
    );
  }

  const categories = response.data;

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-[#3b5998] rounded-t-lg">
        <div className="flex items-center justify-between px-4 py-3   mb-8">
          <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-white" />
            دسته‌بندی‌ها
          </h2>

          {/* خط وسط */}
          <div className="h-1.5 flex-1 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <Link
            href="/resources/main-resource"
            target="_blank"
            className="group text-sm md:text-base font-medium  text-white flex items-center gap-1.5 border-2 border-dashed px-3 rounded-full hover:border-amber-50  transition-all duration-200"
          >
            <span>مشاهده همه</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
        <div className="bg-[#3b5998] w-full h-[40px]">
      
        </div>

      </div>


      {/* ✅ همیشه 5 ستون */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-1 md:gap-3 px-3 relative bottom-11">
        {categories.map((category) => (
          <Link
            key={category.id}
            target="_blank"
            rel="noopener noreferrer"
            href={`/resources/main-resource?category=${category.catSlug}`}
            className="group flex bg-white flex-col items-center gap-3 text-center border p-2 border-slate-400 rounded-2xl"
          >
            <div className="w-18 aspect-square border border-slate-200 rounded-full flex items-center justify-center p-2 transition-all duration-300 group-hover:bg-slate-200 group-hover:-translate-y-1 group-hover:shadow-md">
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
            <span className="group-hover:text-blue-600 transition-colors">
              {category.catName}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
