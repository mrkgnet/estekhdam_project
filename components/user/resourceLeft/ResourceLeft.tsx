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
          <BookOpen className="w-10 h-10 text-slate-400 opacity-60" strokeWidth={1.5} />
        </div>
      )}

      {/* ✅ در صورت خطا، نمایش تصویر fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
        </div>
      )}

      <Image
        src={hasError ? fallback : src}
        alt={alt}
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 768px) 140px, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={`object-contain md:p-4 transition-all duration-700 ease-out ${
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

      <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* ✅ Mobile: افقی | Desktop: عمودی */}
        <div className="flex flex-row lg:flex-col">
          {/* IMAGE */}
          <div className="relative w-[130px] lg:w-full lg:aspect-[4/3] bg-gradient-to-br from-slate-50 to-white flex items-center justify-center flex-shrink-0 overflow-hidden">
            {/* ✅ Label - z-20 برای دیده شدن روی شیمر */}
            <span className="absolute top-2 right-2 z-20 text-[10px] px-2 py-1 rounded-full bg-blue-600 text-white shadow">
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
          <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 flex-1">
            <div className="space-y-2">
              <h1 className="text-13 md:text-14 font-semibold text-slate-800 leading-7">
                {product?.name}
              </h1>

              {product?.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((cat: any, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full"
                    >
                      {cat.catName}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3 text-12 md:text-13 text-slate-600">
              <div className="flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-blue-600" />
                بروزرسانی رایگان سوالات
              </div>
            </div>
          </div>
        </div>
        {/* ✅ End layout */}
      </div>
    </div>
  );
}