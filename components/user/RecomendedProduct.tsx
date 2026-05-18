"use client";

import React, { useMemo, useState, useId } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  FileQuestion,
  FileText,
  ShoppingBasketIcon,
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import SafeImage from "@/components/ui/SafeImage";

interface ProductType {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string | null;
}

interface Props {
  title?: string;
  products: ProductType[];
  viewAllLink?: string;
  viewAllText?: string;
  isLoading?: boolean;
}

// اسکلتون مطابق ابعاد کارت‌های اسلایدر قبلی
const SliderSkeleton = () => (
  <div className="flex gap-[10px] md:gap-4 overflow-hidden w-full h-full pb-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="w-full h-auto border border-gray-300 rounded bg-white overflow-hidden flex flex-col"
      >
        <div className="w-full h-[120px] bg-slate-100 animate-pulse shrink-0" />
        <div className="px-3 md:px-4 py-2 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-100" />
          <span className="w-8 h-8 rounded-full bg-slate-100 animate-pulse shrink-0" />
          <span className="h-px flex-1 bg-slate-100" />
        </div>
        <div className="flex flex-col flex-1 p-2 md:p-5">
          <div className="w-full h-4 bg-slate-100 rounded animate-pulse mb-2"></div>
          <div className="w-2/3 h-4 bg-slate-100 rounded animate-pulse mb-4"></div>
          <div className="w-4/5 h-6 bg-slate-100 rounded animate-pulse mb-2"></div>
          <div className="w-3/5 h-6 bg-slate-100 rounded animate-pulse"></div>
          <div className="mt-auto pt-3">
            <div className="w-full h-9 md:h-10 bg-slate-100 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function RecomendedProduct({
  title = "منابع مطالعاتی مرتبط",
  products,
  viewAllLink = "/resources",
  viewAllText = "مشاهده همه",
  isLoading = false,
}: Props) {
  const [prevBtn, setPrevBtn] = useState<HTMLButtonElement | null>(null);
  const [nextBtn, setNextBtn] = useState<HTMLButtonElement | null>(null);
  const [paginationEl, setPaginationEl] = useState<HTMLDivElement | null>(null);
  const [isSwiperInit, setIsSwiperInit] = useState(false);
  const sectionId = useId();

  const swiperControls = useMemo(
    () => ({
      navigation: { prevEl: prevBtn, nextEl: nextBtn },
      pagination: { el: paginationEl, clickable: true },
    }),
    [prevBtn, nextBtn, paginationEl]
  );

  const hasProducts = Array.isArray(products) && products.length > 0;

  return (
    <section
      className="w-full mx-auto bg-white border border-slate-200 rounded p-4 md:p-6 shadow-sm overflow-hidden"
      dir="rtl"
      aria-labelledby={sectionId}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
        <h2 id={sectionId} className="text-14 sm:text-16 font-semibold">
          {title}
        </h2>

        {viewAllLink && (
          <nav aria-label="لینک‌های بیشتر" className="shrink-0">
            <Link
              href={viewAllLink}
              
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              {viewAllText}
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </nav>
        )}
      </div>

      {/* Content */}
      <div
        className="relative min-h-[300px] pb-4"
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
      >
        {isLoading ? (
          <SliderSkeleton />
        ) : !hasProducts ? (
          <div className="w-full text-center py-10 text-slate-500">
            موردی یافت نشد.
            {viewAllLink && (
              <div className="mt-4">
                <Link
                  href={viewAllLink}
                  target="_blank"
            rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                >
                  مشاهده همه
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            {!isSwiperInit && (
              <div className="absolute inset-0 z-10 bg-white">
                <SliderSkeleton />
              </div>
            )}

            <div
              className={`transition-opacity duration-300 ${
                isSwiperInit ? "opacity-100" : "opacity-0"
              }`}
            >
              <Swiper
                modules={[Navigation, Pagination, A11y]}
                onInit={() => setIsSwiperInit(true)}
                navigation={swiperControls.navigation}
                pagination={swiperControls.pagination}
                spaceBetween={10}
                slidesPerView={2}
                breakpoints={{
                  480: { slidesPerView: 2.8, spaceBetween: 12 },
                  768: { slidesPerView: 5, spaceBetween: 16 },
                  1280: { slidesPerView: 5, spaceBetween: 16 },
                }}
                className="py-2 pb-14 md:pb-16 h-full"
                dir="rtl"
                a11y={{
                  prevSlideMessage: "اسلاید قبلی",
                  nextSlideMessage: "اسلاید بعدی",
                }}
              >
                {products.map((p) => {
                  const href = p.slug
                    ? `/resources/course/${p.slug}`
                    : "/resources";

                  return (
                    <SwiperSlide key={p.id} className="w-full h-auto">
                      <article
                        itemScope
                        itemType="https://schema.org/Product"
                        className="group/card flex flex-col h-full w-full border border-gray-300 rounded overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 bg-white"
                      >
                        {/* Image */}
                        <Link
                          href={href}
                          target="_blank"
            rel="noopener noreferrer"
                          itemProp="url"
                          className="block relative w-full h-[120px] flex-shrink-0 flex items-center justify-center p-2 overflow-hidden"
                        >
                          <div className="relative w-full h-full">
                            <SafeImage
                              src={p.imageUrl || "/images/products/bookExample.jpg"}
                              alt={p.name}
                              fill
                              className="object-contain mix-blend-multiply transition-opacity duration-300"
                              sizes="(max-width: 768px) 170px, 400px"
                              itemProp="image"
                            />
                          </div>
                        </Link>

                        {/* سبد خرید */}
                        <div className="px-3 md:px-4">
                          <Link
                            href="/cart"
                            aria-label="رفتن به سبد خرید"
                            className="group flex items-center gap-3 py-2"
                          >
                            <span className="h-px flex-1 bg-slate-200" />
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition shrink-0">
                              <ShoppingBasketIcon className="w-4 h-4" />
                            </span>
                            <span className="h-px flex-1 bg-slate-200" />
                          </Link>
                        </div>

                        {/* Content */}
                        <Link href={href} className="flex flex-col flex-1 p-2 md:p-5 z-10 justify-between">
                          <h3
                            className="text-slate-800 font-semibold leading-relaxed line-clamp-2 min-h-[2.5rem] group-hover/card:text-emerald-600 transition-colors duration-200"
                            title={p.name}
                            itemProp="name"
                          >
                            {p.name}
                          </h3>
                          <div className="mt-auto">
                            <ul className="space-y-2 text-[11px]">
                              <li className="flex items-center gap-2 text-slate-600">
                                <FileQuestion className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>سوالات طبقه‌بندی شده</span>
                              </li>
                              <li className="flex items-center gap-2 text-slate-600">
                                <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>پاسخ نامه تشریحی</span>
                              </li>
                            </ul>
                          </div>
                        </Link>
                      </article>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              {/* Controls */}
              <button
                ref={setNextBtn}
                type="button"
                aria-label="اسلاید بعدی"
                className="flex absolute top-1/2 left-1 z-[50] -translate-y-1/2 w-7 h-7 bg-white/90 rounded-md shadow-lg border border-slate-200 items-center justify-center text-slate-700 hover:text-emerald-600 transition-all xl:opacity-0 xl:group-hover:opacity-100 disabled:hidden"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                ref={setPrevBtn}
                type="button"
                aria-label="اسلاید قبلی"
                className="flex absolute top-1/2 right-1 z-[50] -translate-y-1/2 w-7 h-7 bg-white/90 rounded-md shadow-lg border border-slate-200 items-center justify-center text-slate-700 hover:text-emerald-600 transition-all xl:opacity-0 xl:group-hover:opacity-100 disabled:hidden"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div
                ref={setPaginationEl}
                className="absolute bottom-0 left-0 right-0 z-30 flex justify-center items-center gap-1.5"
                aria-label="ناوبری صفحات محصولات"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
