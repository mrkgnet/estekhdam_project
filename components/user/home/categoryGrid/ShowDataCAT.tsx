"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Grid, ImageIcon } from "lucide-react";
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

// ✅ blurDataURL معتبر و سبک (SVG کوچک)
const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+";

/* ---------------------------------- */
/* ✅ کامپوننت تصویر با اسکلتون شیمر */
/* ---------------------------------- */
function CategoryImage({ src, alt }: { src: string; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* ✅ اسکلتون شیمر تا لود کامل تصویر + آیکون برای اطلاع کاربر */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 rounded-full skeleton-shimmer flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-slate-400 opacity-60" />
        </div>
      )}

      {/* ✅ در صورت خطا در لود تصویر، آیکون پیش‌فرض */}
      {hasError && (
        <div className="absolute inset-0 rounded-full bg-slate-100 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-slate-400" />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        fill
        className={`object-contain transition-opacity duration-700 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ mixBlendMode: "multiply" }}
        sizes="(max-width: 768px) 50vw, 15vw"
        priority
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */
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
      {/* ✅ استایل شیمر برای اسکلتون تصاویر */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            #e2e8f0 0%,
            #f1f5f9 40%,
            #f8fafc 50%,
            #f1f5f9 60%,
            #e2e8f0 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s infinite linear;
        }
      `}</style>

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
            {/* ✅ overflow-hidden تا شیمر از دایره بیرون نزنه */}
            <div className="w-18 aspect-square border border-slate-200 rounded-full flex items-center justify-center p-2 transition-all duration-300 group-hover:bg-slate-200 group-hover:-translate-y-1 group-hover:shadow-md overflow-hidden">
              <CategoryImage
                src={category.imageUrl || "/images/default-category.png"}
                alt={category.catName}
              />
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