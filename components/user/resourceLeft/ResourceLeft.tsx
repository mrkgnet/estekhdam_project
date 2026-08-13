"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, RefreshCcw, BookOpen } from "lucide-react";

type Props = {
  product: any;
};

const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiBmaWxsPSIjZjFmNWY5IiAvPgo8L3N2Zz4=";

const fallbackImage = "/images/products/bookExample.jpg";

/* ---------------------------------- */
/* ✅ کامپوننت تصویر با اسکلتون شیمر */
/* ---------------------------------- */
function ProductImage({ src, alt, fallback }: { src: string; alt: string; fallback: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* ✅ اسکلتون شیمر تا لود کامل تصویر + آیکون کتاب */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 skeleton-shimmer flex items-center justify-center">
          <BookOpen className="w-12 h-12 sm:w-10 sm:h-10 text-slate-400 opacity-60" strokeWidth={1.5} />
        </div>
      )}

      {/* ✅ در صورت خطا، نمایش تصویر fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
          <BookOpen className="w-12 h-12 sm:w-10 sm:h-10 text-slate-300" strokeWidth={1.5} />
        </div>
      )}

      <Image
        src={hasError ? fallback : src}
        alt={alt}
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 768px) 180px, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={`object-contain p-3 sm:p-3 md:p-4 transition-all duration-700 ease-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */
export default function ResourceLeft({ product }: Props) {
  const imageSrc =
    product?.imageUrl && product.imageUrl !== "#"
      ? product.imageUrl
      : fallbackImage;

  return (
    <div className="lg:col-span-3 w-full">
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

      <div className="lg:sticky lg:top-24 bg-white rounded border border-slate-300 overflow-hidden">
        {/* ✅ Mobile: افقی | Desktop: عمودی */}
        <div className="flex flex-row lg:flex-col">
          {/* IMAGE - بزرگ‌تر در موبایل */}
          <div className="relative w-[170px] sm:w-[180px] lg:w-full min-h-[180px] sm:min-h-[200px] lg:min-h-0 lg:aspect-[4/3] bg-gradient-to-br from-slate-50 to-white flex items-center justify-center flex-shrink-0 overflow-hidden">
            {/* ✅ Label - z-20 برای دیده شدن روی شیمر */}
            <span className="absolute top-2 right-2 z-20 text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full bg-blue-600 text-white shadow font-medium">
              آنلاین
            </span>

            {/* ✅ تصویر با اسکلتون شیمر */}
            <ProductImage
              src={imageSrc}
              alt={product?.name || "product"}
              fallback={fallbackImage}
            />
          </div>

          {/* CONTENT */}
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6 flex-1 min-w-0">
            <div className="space-y-2">
              <h1 className="text-13 sm:text-15 font-semibold text-slate-800 leading-6 sm:leading-7">
                {product?.name}
              </h1>

              {product?.categories?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {product.categories.map((cat: any, idx: number) => (
                    <span
                      key={idx}
                      className="text-[13px] sm:text-sm bg-slate-100 text-slate-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full"
                    >
                      {cat.catName}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-300 pt-3 sm:pt-4 space-y-3 text-11 sm:text-12 md:text-13 text-slate-600">
              <div className="flex items-center gap-2">
                <RefreshCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                <span>بروزرسانی رایگان سوالات</span>
              </div>
            </div>
          </div>
        </div>
        {/* ✅ End layout */}
      </div>
    </div>
  );
}