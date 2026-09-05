"use client";

import { memo, useCallback, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Lightbulb,
  MonitorPlay,
  ChevronsLeftRight,
} from "lucide-react";

import SafeImage from "@/components/ui/SafeImage";

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

interface ProductsResponse {
  data?: ProductType[] | null;
}

interface Props {
  title?: string;
  initialProducts: ProductType[] | ProductsResponse | null | undefined;
}

interface ProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

const ProductImage = memo(function ProductImage({
  src,
  alt,
  priority = false,
}: ProductImageProps) {
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
        sizes="(max-width: 640px) 120px, (max-width: 1024px) 180px, 240px"
        placeholder="blur"
        blurDataURL={blurDataURL}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`object-contain  mix-blend-multiply transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
});

function normalizeProducts(
  initialProducts: ProductType[] | ProductsResponse | null | undefined
): ProductType[] {
  if (Array.isArray(initialProducts)) return initialProducts;
  if (initialProducts && "data" in initialProducts && Array.isArray(initialProducts.data)) {
    return initialProducts.data;
  }
  return [];
}

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
    <div className="h-[160px] sm:h-[185px] w-[90%] shrink-0 snap-start sm:w-[calc(100%/1.4-14px)] md:w-[calc(100%/2-14px)] lg:w-[calc(100%/3-14px)] xl:w-[calc(100%/4-16px)]">
      <Link
        href={`/resources/course/${product.slug ?? product.id}`}
        className="block h-full w-full"
      >
        <article className="group/card relative flex h-full w-full flex-row overflow-hidden rounded border border-gray-200 bg-white  hover:border-slate-400 hover:shadow-md">
          {/* بخش تصویر */}
          <div className="relative h-full w-28 shrink-0 border-l border-gray-100 bg-gray-50/50 sm:w-36 xl:w-32 2xl:w-36">
            <ProductImage src={imageSrc} alt={product.name} priority={priority} />
          </div>

          {/* بخش محتوا */}
          <div className="flex h-full min-w-0 flex-1 flex-col justify-between p-3 sm:p-4">
            {/* عنوان درس */}
            <h3 className="shrink-0  text-xs sm:text-13 font-semibold leading-snug text-slate-800 transition-colors duration-200 group-hover/card:text-blue-600">
              {product.name}
            </h3>

            {/* کانتینر بج‌ها با اسکرول عمودی و اسکرول‌بار مشخص */}
            <div className="relative mt-2 min-h-0 flex-1 overflow-hidden">
              <div
                tabIndex={0}
                onClick={(e) => e.stopPropagation()}
                className="custom-scrollbar flex h-full max-h-[62px] sm:max-h-[76px] flex-wrap content-start gap-1.5 overflow-y-auto overscroll-contain pl-1.5"
              >
                <FeatureBadge
                  icon={ClipboardList}
                  label={questionText}
                  colorClass=" border-blue-100"
                />
                <FeatureBadge
                  icon={BookOpen}
                  label="درسنامه کامل"
                  colorClass="  border-emerald-100"
                />
                <FeatureBadge
                  icon={Lightbulb}
                  label="نکات کنکوری"
                  colorClass="  border-amber-100"
                />
                <FeatureBadge
                  icon={MonitorPlay}
                  label="آنلاین"
                  colorClass="  border-purple-100"
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

export default function ShowDataSLTL({
  title = "آموزش‌های پرمخاطب",
  initialProducts,
}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const regionId = useId();

  const products = useMemo(() => normalizeProducts(initialProducts), [initialProducts]);

  const scrollByDirection = useCallback((direction: "next" | "prev") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 320;
    const amount = direction === "next" ? -scrollAmount : scrollAmount;

    container.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="relative mx-auto h-full w-full group" dir="rtl" aria-label={title}>
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
          animation: shimmer 1.8s infinite linear;
        }

        /* اسکرول‌بار ظریف و کاربرپسند برای بخش‌های اسکرول‌خور */
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

      <div className="relative h-full pt-2">
        {/* هدر بخش همراه با نشانگر راهنمای اسکرول */}
        <div className="flex items-center justify-between gap-2 px-1 text-xs text-slate-500">
          <div className="font-medium text-slate-700">دفترچه‌های استخدامی (تست/درسنامه)</div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-full">
            <ChevronsLeftRight className="h-3.5 w-3.5 animate-pulse text-blue-500" />
            <span>اسکرول کنید</span>
          </div>
        </div>

        {/* کانتینر اسکرول افقی با اسکرول‌بار ظریف */}
        <div
          id={regionId}
          ref={scrollContainerRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
          tabIndex={0}
          className="custom-scrollbar mt-2 flex h-full snap-x snap-mandatory gap-[14px] overflow-x-auto scroll-smooth pb-3 pt-2"
        >
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index === 0} />
          ))}
        </div>

        {/* دکمه اسکرول چپ (بعدی در RTL) */}
        <button
          type="button"
          aria-label="اسلاید بعدی"
          aria-controls={regionId}
          onClick={() => scrollByDirection("next")}
          className="absolute left-1 top-1/2 z-10 hidden sm:flex h-11 w-8 -translate-y-1/2 items-center justify-center rounded-md border border-slate-300 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>

        {/* دکمه اسکرول راست (قبلی در RTL) */}
        <button
          type="button"
          aria-label="اسلاید قبلی"
          aria-controls={regionId}
          onClick={() => scrollByDirection("prev")}
          className="absolute right-1 top-1/2 z-10 hidden sm:flex h-11 w-8 -translate-y-1/2 items-center justify-center rounded-md border border-slate-300 bg-white/95 text-slate-700 shadow-md backdrop-blur-sm transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
