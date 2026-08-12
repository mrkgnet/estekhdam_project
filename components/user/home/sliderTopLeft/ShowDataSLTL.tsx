"use client";

import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight, ClipboardList, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import SafeImage from "@/components/ui/SafeImage";
import { fetchLatestProductAction } from "@/actions/user/latestProduct/Actions";
import { SliderSkeletonTopLeft } from "@/components/ui/SkeletonLoding/SliderSkeletonTopLeft";

const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+";

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */
interface ProductType {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string | null;
}

interface Props {
  title?: string;
  initialProducts: any;
  viewAllLink?: string;
  slug?: string;
}

/* ---------------------------------- */
/* ✅ کامپوننت تصویر با اسکلتون شیمر */
/* ---------------------------------- */
function ProductImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* ✅ اسکلتون شیمر تا لود کامل تصویر + آیکون BookOpen */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 skeleton-shimmer flex items-center justify-center">
          <BookOpen
            className="w-10 h-10 text-slate-400 opacity-60"
            strokeWidth={1.5}
          />
        </div>
      )}

      {/* ✅ در صورت خطا، آیکون پیش‌فرض */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
        </div>
      )}

      <SafeImage
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 170px, 400px"
        placeholder="blur"
        blurDataURL={blurDataURL}
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        className={`object-contain mix-blend-multiply transition-all duration-700 ease-out group-hover/card:scale-105 ${
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
export default function ShowDataSLTL({
  title = "آموزش‌های پرمخاطب",
  initialProducts,
  viewAllLink = "/resources",
}: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [prevBtn, setPrevBtn] = useState<HTMLButtonElement | null>(null);
  const [nextBtn, setNextBtn] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: response, isLoading } = useQuery({
    queryKey: ["latest-products"],
    queryFn: fetchLatestProductAction,
    initialData: initialProducts,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const products: ProductType[] = response?.data || [];

  if (!isMounted || (isLoading && products.length === 0)) {
    return <SliderSkeletonTopLeft />;
  }

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <div className="w-full mx-auto relative  h-full" dir="rtl">
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
        .custom-swiper-progress {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #e2e8f0;
          z-index: 20;
          border-radius: 4px 4px 0 0;
          overflow: hidden;
          --swiper-pagination-color: #2563eb;
        }
        .custom-swiper-progress .swiper-pagination-progressbar-fill {
          background: #2563eb !important;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          transform-origin: right top;
          transition: transform 300ms ease;
        }
      `}</style>

      <div className="relative group h-full pt-2">
        <div className="custom-swiper-progress" />

        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          navigation={{ nextEl: nextBtn, prevEl: prevBtn }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ el: ".custom-swiper-progress", type: "progressbar" }}
          spaceBetween={10}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 2.8, spaceBetween: 12 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1280: { slidesPerView: 2, spaceBetween: 16 },
          }}
          className="py-2 animate-in fade-in duration-500 static mt-2 h-full"
          dir="rtl"
        >
          {products.map((p, index) => {
            const isPriority = index < 2;

            return (
              <SwiperSlide key={p.id} className="w-full h-auto">
                <Link
                  href={`/resources/course/${p.slug}`}
                  className="block h-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="group/card flex flex-col h-full w-full border border-gray-300 rounded overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 bg-white relative">
                    
                    {/* Image Section */}
                    <div className="relative w-full h-[130px] flex-shrink-0 flex items-center justify-center p-2 overflow-hidden bg-gray-50/40">
                      
                      {/* ✅ Badge با z-30 برای دیده شدن روی شیمر */}
                      <div className="absolute top-0 left-0 z-30">
                        <div className="bg-rose-500 text-white text-[11px] font-bold px-3 py-1 rounded-br-xl shadow-sm">
                          درسنامه/تست
                        </div>
                      </div>

                      {/* ✅ تصویر با اسکلتون شیمر */}
                      <div className="relative w-full h-full">
                        <ProductImage
                          src={p.imageUrl || "/images/products/bookExample.jpg"}
                          alt={p.name}
                          priority={isPriority}
                        />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-1 p-2 md:p-5 z-10 justify-between">
                      <h3 className="text-slate-800 font-semibold leading-relaxed line-clamp-2 min-h-[2.5rem] group-hover/card:text-blue-600 transition-colors duration-200">
                        {p.name}
                      </h3>
                      <div className="mt-auto">
                        <ul className="space-y-2 text-[11px] mt-3">
                          <li className="flex items-center gap-2 text-slate-800">
                            <ClipboardList className="w-4 h-4 text-blue-500 shrink-0" />
                            <span>سوالات طبقه‌بندی شده</span>
                          </li>
                          <li className="flex items-center gap-2 text-slate-800">
                            <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                            <span>فصل‌بندی استاندارد</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation buttons */}
        <button
          ref={setNextBtn}
          className="absolute top-1/2 left-1 z-[50] -translate-y-1/2 w-7 h-7 bg-white/90 rounded-md shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all xl:opacity-0 xl:group-hover:opacity-100 disabled:hidden"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          ref={setPrevBtn}
          className="absolute top-1/2 right-1 z-[50] -translate-y-1/2 w-7 h-7 bg-white/90 rounded-md shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-blue-600 transition-all xl:opacity-0 xl:group-hover:opacity-100 disabled:hidden"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}