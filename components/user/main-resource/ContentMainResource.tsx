"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FileText, X, BookOpen, ArrowLeft, SearchX, Loader2 } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import type { Category, Product } from "@/types/free-resource";

interface Props {
  products: Product[];
  activeCategoryObjects: Category[];
  isPending: boolean;
  onToggleFilter: (slug: string) => void;
  onClearFilters: () => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    itemsPerPage: number;
  };
}

/* ---------------------------------- */
/* ✅ blurDataURL معتبر و سبک */
/* ---------------------------------- */
const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+";

/* ---------------------------------- */
/* ✅ کامپوننت تصویر محصول با اسکلتون شیمر */
/* ---------------------------------- */
function ProductImage({ src, alt }: { src: string | null | undefined; alt: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // اگه تصویری نیست، آیکون FileText نمایش بده
  if (!src) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <FileText className="w-8 h-8 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* ✅ اسکلتون شیمر تا لود کامل تصویر + آیکون کتاب */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 skeleton-shimmer flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-slate-400 opacity-60" strokeWidth={1.5} />
        </div>
      )}

      {/* ✅ در صورت خطا، آیکون پیش‌فرض */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
          <FileText className="w-8 h-8 text-slate-300" />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`object-contain p-2.5 transition-all duration-700 ease-out group-hover:scale-105 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
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
export default function ContentFreeResource({
  products = [],
  activeCategoryObjects = [],
  isPending,
  onToggleFilter,
  onClearFilters,
  pagination,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="flex-1 flex flex-col relative min-h-[400px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 content-start flex-1">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden flex flex-col animate-pulse"
            >
              <div className="relative w-full h-40 bg-gray-200/60 border-b border-gray-100" />
              <div className="p-2.5 flex flex-col flex-1">
                <div className="mb-1.5 flex flex-wrap gap-1">
                  <div className="w-12 h-3.5 bg-gray-200/60 rounded" />
                  <div className="w-16 h-3.5 bg-gray-200/60 rounded" />
                </div>
                <div className="w-full h-3 bg-gray-200/80 rounded mb-1.5 mt-2" />
                <div className="w-2/3 h-3 bg-gray-200/80 rounded mb-4" />
                <div className="flex items-center justify-end mt-auto pt-3 border-t border-gray-100">
                  <div className="w-24 h-6 bg-gray-200/80 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col relative min-h-[400px]">
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

      {/* نوار لودینگ */}
      {isPending && (
        <div className="absolute inset-0 z-20 bg-gray-50/40 backdrop-blur-[2px] rounded-2xl">
          <div className="sticky top-10 mt-6 mx-auto w-max flex items-center gap-3 bg-white px-6 py-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-blue-100">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-xs font-bold text-blue-800">در حال دریافت اطلاعات، لطفاً صبر کنید...</span>
          </div>
        </div>
      )}

      {/* تگ فیلترهای فعال */}
      {activeCategoryObjects?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-500 ml-2">فیلترهای فعال:</span>
          
          {activeCategoryObjects.map((cat) => (
            <span
              key={cat.id}
              className="flex items-center gap-1 px-2 py-1 bg-blue-50/80 text-blue-700 rounded-lg text-[11px] font-semibold border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              {cat.catName}
              <button
                onClick={() => onToggleFilter(cat.catSlug)}
                disabled={isPending}
                className="text-blue-400 hover:text-red-500 cursor-pointer disabled:opacity-50 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            onClick={onClearFilters}
            disabled={isPending}
            className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50 mr-auto border border-transparent hover:border-red-100"
          >
            حذف همه فیلترها
          </button>
        </div>
      )}

      {/* لیست محصولات */}
      {products?.length > 0 ? (
        <>
          <div
            className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 content-start flex-1 transition-opacity duration-200 ${
              isPending ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/resources/course/${product.slug}?price=free`}
                target="_blank"
                className="relative bg-white rounded shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-300 group flex flex-col cursor-pointer"
              >

                {/* ربان آنلاین */}
                <div className="absolute top-3 left-0 z-20">
                  <div className="relative flex items-center">
                    <span className="bg-emerald-500 text-white text-[9px] font-black px-2.5 py-0.5 shadow-sm tracking-wide">
                      آنلاین
                    </span>
                    {/* دنباله مثلثی ربان */}
                    <div className="w-0 h-0 border-t-[9px] border-b-[9px] border-l-[7px] border-t-emerald-500 border-b-emerald-500 border-l-transparent" />
                  </div>
                </div>

                {/* ✅ بخش تصویر با اسکلتون شیمر */}
                <div className="relative w-full h-40 bg-gray-50/50 border-b border-gray-100 overflow-hidden">
                  <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                  />
                </div>

                <div className="p-2.5 flex flex-col flex-1">
                  <div className="mb-1.5 flex flex-wrap gap-1">
                    {product.categories?.slice(0, 2).map((cat) => (
                      <span
                        key={cat.id}
                        className="text-[9px] font-bold text-gray-500 bg-gray-100/80 px-1.5 py-0.5 rounded"
                      >
                        {cat.catName}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-12 sm:text-13 font-bold text-gray-800 mb-2 line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* 🟢 افکت خط جداکننده با آیکون در وسط که انتهای آن محو می‌شود */}
                  <div className="flex items-center justify-center mt-auto mb-2 w-full opacity-60">
                    <div className="flex-1 h-1 bg-gradient-to-l from-transparent to-gray-300"></div>
                    <div className="mx-2 text-gray-400">
                      <BookOpen className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 h-1 bg-gradient-to-r from-transparent to-gray-300"></div>
                  </div>

                  {/* بخش دکمه شروع یادگیری */}
                  <div className="flex items-center justify-end pt-1">
                    <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold">شروع یادگیری رایگان</span>
                      <ArrowLeft className="w-3.5 h-3.5 opacity-70 group-hover:-translate-x-1 transition-transform duration-300 mr-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={pagination?.currentPage || 1}
            totalPages={pagination?.totalPages || 1}
            totalCount={pagination?.totalCount || 0}
            itemsPerPage={pagination?.itemsPerPage || 10}
            itemName="ردیف اطلاعاتی"
          />
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
          <div className="bg-gray-50 p-4 rounded-full mb-3">
            <SearchX className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-800 mb-1.5">موردی یافت نشد</h3>
          <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
            با توجه به فیلترهای اعمال شده، فایلی یافت نشد. لطفاً فیلترها را تغییر دهید.
          </p>
          <button
            onClick={onClearFilters}
            disabled={isPending}
            className="mt-4 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold px-5 py-2 rounded-xl transition-all cursor-pointer"
          >
            پاکسازی جستجو
          </button>
        </div>
      )}
    </main>
  );
}