"use client";

import { memo, useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Lightbulb,
  MonitorPlay,
  RotateCcw,
  Loader2,
} from "lucide-react";

import SafeImage from "@/components/ui/SafeImage";
import { fetchPaginatedProductsAction } from "@/actions/user/latestProduct/Actions";

const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+";

export interface ProductType {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string | null;
  _count?: {
    questions?: number;
  };
}

interface Props {
  title?: string;
  initialProducts: ProductType[];
  totalPages: number;
}

const ProductImage = memo(function ProductImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative h-full w-full">
      {!isLoaded && !hasError && (
        <div
          aria-hidden="true"
          className="skeleton-shimmer absolute inset-0 z-10 flex items-center justify-center"
        >
          <BookOpen className="h-8 w-8 text-slate-400 opacity-60" strokeWidth={1.5} />
        </div>
      )}

      {hasError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-slate-50"
        >
          <BookOpen className="h-8 w-8 text-slate-300" strokeWidth={1.5} />
        </div>
      )}

      <SafeImage
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 130px, (max-width: 1024px) 180px, 240px"
        placeholder="blur"
        blurDataURL={blurDataURL}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`object-contain mix-blend-multiply transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
});

const FeatureBadge = memo(function FeatureBadge({
  icon: Icon,
  label,
  colorClass = "bg-slate-100 text-slate-700 font-bold border-2 border-slate-200",
}: {
  icon: React.ElementType;
  label: string;
  colorClass?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border-2 px-2 py-0.5 text-[10px] font-bold leading-none shadow-xs ${colorClass}`}
    >
      <Icon className="h-3 w-3 shrink-0" strokeWidth={2} />
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
});

const ProductCard = memo(function ProductCard({
  product,
  priority,
}: {
  product: ProductType;
  priority: boolean;
}) {
  const imageSrc = product.imageUrl || "/images/products/bookExample.jpg";
  const questionCount = product._count?.questions;

  const questionText =
    typeof questionCount === "number"
      ? `${questionCount.toLocaleString("fa-IR")} تست`
      : "تست چهارگزینه‌ای";

  return (
    <div className="h-[165px] sm:h-[185px] w-full min-w-0">
      <Link
        href={`/resources/course/${product.slug ?? product.id}`}
        className="block h-full w-full"
      >
        <article className="group/card relative flex h-full w-full flex-row overflow-hidden rounded-md border border-gray-200 bg-white hover:border-slate-400 hover:shadow-md transition-all">
          <div className="relative h-full w-28 sm:w-32 xl:w-28 2xl:w-32 shrink-0 border-l border-gray-100 bg-gray-50/50">
            <ProductImage src={imageSrc} alt={product.name} priority={priority} />
          </div>

          <div className="flex h-full min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
            <h3 className="shrink-0 text-xs sm:text-13 font-semibold leading-snug text-slate-800 transition-colors duration-200 group-hover/card:text-blue-600 line-clamp-2">
              {product.name}
            </h3>

            <div className="relative mt-2 min-h-0 flex-1 overflow-hidden">
              <div
                tabIndex={0}
                onClick={(e) => e.stopPropagation()}
                className="custom-scrollbar flex h-full max-h-[62px] sm:max-h-[76px] flex-wrap content-start gap-1.5 overflow-y-auto overscroll-contain pl-1.5"
              >
                <FeatureBadge
                  icon={ClipboardList}
                  label={questionText}
                  colorClass="border-blue-100"
                />
                <FeatureBadge
                  icon={BookOpen}
                  label="درسنامه کامل"
                  colorClass="border-emerald-100"
                />
                <FeatureBadge
                  icon={Lightbulb}
                  label="نکات کنکوری"
                  colorClass="border-amber-100"
                />
                <FeatureBadge
                  icon={MonitorPlay}
                  label="آنلاین"
                  colorClass="border-purple-100"
                />
                <FeatureBadge
                  icon={BookOpen}
                  label="پاسخ تشریحی"
                  colorClass="bg-indigo-50 text-indigo-700 border-indigo-100"
                />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
});

const ProductSkeletonCard = memo(function ProductSkeletonCard() {
  return (
    <div className="h-[165px] sm:h-[185px] w-full min-w-0">
      <div className="relative flex h-full w-full flex-row overflow-hidden rounded-md border border-gray-200 bg-white shadow-xs">
        <div className="relative flex h-full w-28 sm:w-32 xl:w-28 2xl:w-32 shrink-0 items-center justify-center border-l border-gray-100 bg-slate-50">
          <div className="skeleton-shimmer absolute inset-0 opacity-70" />
          <Loader2 className="relative z-10 h-6 w-6 animate-spin text-slate-400" />
        </div>

        <div className="flex h-full min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
          <div className="space-y-2">
            <div className="skeleton-shimmer h-3.5 w-4/5 rounded" />
            <div className="skeleton-shimmer h-3 w-1/2 rounded" />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2">
            <div className="skeleton-shimmer h-5 w-16 rounded-full" />
            <div className="skeleton-shimmer h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default function ShowDataSLTL({
  title = "دفترچه‌های استخدامی پیشنهادی",
  initialProducts = [],
  totalPages = 1,
}: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileItemIndex, setMobileItemIndex] = useState<number>(0);
  const [isPending, startTransition] = useTransition();

  const touchStartX = useRef<number | null>(null);

  const pagesCache = useRef<Record<number, ProductType[]>>({
    1: initialProducts,
  });

  // اطمینان از اینکه حتی اگر سرور به اشتباه دیتای بیشتری داد، حداکثر ۴ تا رندر شود
  const rawProducts = pagesCache.current[currentPage] || [];
  const currentProducts = rawProducts.slice(0, 4);
  const currentMobileProduct = currentProducts[mobileItemIndex] || currentProducts[0];

  const prefetchNextPage = useCallback(
    async (targetPage: number) => {
      if (targetPage > totalPages || pagesCache.current[targetPage]) return;
      const res = await fetchPaginatedProductsAction(targetPage);
      if (res.success && res.data) {
        pagesCache.current[targetPage] = res.data;
      }
    },
    [totalPages]
  );

  useEffect(() => {
    if (currentPage < totalPages) {
      prefetchNextPage(currentPage + 1);
    }
  }, [currentPage, totalPages, prefetchNextPage]);

  const goToPage = useCallback(
    (targetPage: number) => {
      if (targetPage < 1 || targetPage > totalPages || targetPage === currentPage) return;

      setMobileItemIndex(0);

      if (pagesCache.current[targetPage]) {
        setCurrentPage(targetPage);
        return;
      }

      startTransition(async () => {
        const res = await fetchPaginatedProductsAction(targetPage);
        if (res.success && res.data) {
          pagesCache.current[targetPage] = res.data;
          setCurrentPage(targetPage);
        }
      });
    },
    [currentPage, totalPages]
  );

  const handleMobileNext = useCallback(() => {
    if (mobileItemIndex < currentProducts.length - 1) {
      setMobileItemIndex((prev) => prev + 1);
    } else if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [mobileItemIndex, currentProducts.length, currentPage, totalPages, goToPage]);

  const handleMobilePrev = useCallback(() => {
    if (mobileItemIndex > 0) {
      setMobileItemIndex((prev) => prev - 1);
    } else if (currentPage > 1) {
      const prevPage = currentPage - 1;
      if (pagesCache.current[prevPage]) {
        setCurrentPage(prevPage);
        setMobileItemIndex(pagesCache.current[prevPage].slice(0, 4).length - 1);
      } else {
        goToPage(prevPage);
      }
    }
  }, [mobileItemIndex, currentPage, goToPage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      handleMobileNext();
    } else if (diff < -45) {
      handleMobilePrev();
    }
    touchStartX.current = null;
  };

  if (initialProducts.length === 0) return null;

  const isAtFirst = currentPage === 1 && mobileItemIndex === 0;
  const isAtLast =
    currentPage === totalPages && mobileItemIndex === currentProducts.length - 1;

  return (
    <section className="relative mx-auto w-full select-none" dir="rtl" aria-label={title}>
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
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
          animation: shimmer 1.6s infinite linear;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
      `}</style>

      {/* هدر بالای کاروسل */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5 px-1 text-xs">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-800">{title}</h2>
          <span className="text-[10px] text-slate-400 font-medium">ویژه</span>
        </div>

        <div className="flex items-center gap-2.5 text-slate-500 font-medium text-xs">
          <span className="hidden sm:inline-block">
            صفحه <strong className="text-slate-800">{currentPage.toLocaleString("fa-IR")}</strong> از{" "}
            {totalPages.toLocaleString("fa-IR")}
          </span>

          <span className="inline-block sm:hidden bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold text-[11px]">
            {(mobileItemIndex + 1).toLocaleString("fa-IR")} از {currentProducts.length.toLocaleString("fa-IR")}{" "}
            <span className="text-[9px] text-slate-400 font-normal">
              (ص {currentPage.toLocaleString("fa-IR")})
            </span>
          </span>

          {currentPage > 1 && (
            <button
              type="button"
              onClick={() => goToPage(1)}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>شروع مجدد</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative mt-3">
        {/* ۱. مخصوص موبایل: ۱ آیتم */}
        <div
          className="block sm:hidden w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {isPending ? (
            <ProductSkeletonCard />
          ) : (
            currentMobileProduct && (
              <ProductCard
                key={currentMobileProduct.id}
                product={currentMobileProduct}
                priority={true}
              />
            )
          )}
        </div>

        {/* ۲. مخصوص دسکتاپ: دقیقاً ۴ ستون در یک ردیف بدون شکستن به خط بعد */}
        <div className="hidden sm:grid sm:grid-cols-4 gap-3 w-full">
          {isPending
            ? Array.from({ length: 4 }).map((_, idx) => (
                <ProductSkeletonCard key={`page-skeleton-${idx}`} />
              ))
            : currentProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={currentPage === 1 && idx === 0}
                />
              ))}
        </div>

        {/* دکمه بعدی (سمت چپ در RTL) */}
        <button
          type="button"
          aria-label="بعدی"
          disabled={
            isPending ||
            (typeof window !== "undefined" && window.innerWidth < 640
              ? isAtLast
              : currentPage === totalPages)
          }
          onClick={() => {
            if (window.innerWidth < 640) {
              handleMobileNext();
            } else {
              goToPage(currentPage + 1);
            }
          }}
          className={`absolute -left-2.5 sm:-left-4 top-1/2 z-10 flex h-9 w-7 sm:h-12 sm:w-9 -translate-y-1/2 items-center justify-center rounded-r sm:rounded-md border border-slate-300 bg-white/95 text-slate-700 shadow-md backdrop-blur-xs transition-all ${
            (typeof window !== "undefined" && window.innerWidth < 640
              ? isAtLast
              : currentPage === totalPages) || isPending
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400 active:scale-95"
          }`}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>

        {/* دکمه قبلی (سمت راست در RTL) */}
        <button
          type="button"
          aria-label="قبلی"
          disabled={
            isPending ||
            (typeof window !== "undefined" && window.innerWidth < 640
              ? isAtFirst
              : currentPage === 1)
          }
          onClick={() => {
            if (window.innerWidth < 640) {
              handleMobilePrev();
            } else {
              goToPage(currentPage - 1);
            }
          }}
          className={`absolute -right-2.5 sm:-right-4 top-1/2 z-10 flex h-9 w-7 sm:h-12 sm:w-9 -translate-y-1/2 items-center justify-center rounded-l sm:rounded-md border border-slate-300 bg-white/95 text-slate-700 shadow-md backdrop-blur-xs transition-all ${
            (typeof window !== "undefined" && window.innerWidth < 640
              ? isAtFirst
              : currentPage === 1) || isPending
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-400 active:scale-95"
          }`}
        >
          <ChevronRight aria-hidden="true" className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
      </div>
    </section>
  );
}