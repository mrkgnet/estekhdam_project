"use client";

import React, { useMemo, useState, useId } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import { BugPlay, ChevronLeft, ChevronRight, FileQuestion, FileText, Plus, ShoppingBasket, ShoppingBasketIcon } from "lucide-react";

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

// کامپوننت داخلی برای لودر اسکلتونی جهت جلوگیری از تکرار کد و تطابق کامل با کارت‌ها
const SliderSkeleton = () => (
  <div className="flex gap-[14px] md:gap-4 overflow-hidden w-full h-full pb-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="w-[160px] sm:w-[190px] md:w-[230px] shrink-0 h-full border border-slate-200 rounded-2xl bg-white overflow-hidden flex flex-col"
      >
        {/* اسکلتون تصویر */}
        <div className="w-full aspect-[4/5] bg-slate-100 animate-pulse shrink-0"></div>

        {/* اسکلتون دکمه سبد خرید و جداکننده */}
        <div className="px-3 md:px-4 py-2 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-100" />
          <span className="w-8 h-8 rounded-full bg-slate-100 animate-pulse shrink-0" />
          <span className="h-px flex-1 bg-slate-100" />
        </div>

        {/* اسکلتون محتوا و توضیحات */}
        <div className="flex flex-col flex-1 p-3 md:p-4">
          {/* عنوان */}
          <div className="w-full h-4 bg-slate-100 rounded animate-pulse mb-2"></div>
          <div className="w-2/3 h-4 bg-slate-100 rounded animate-pulse mb-4"></div>

          {/* ویژگی‌ها (تگ‌ها) */}
          <div className="w-4/5 h-6 bg-slate-100 rounded animate-pulse mb-2"></div>
          <div className="w-3/5 h-6 bg-slate-100 rounded animate-pulse"></div>

          {/* دکمه پایین */}
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
        className="relative min-h-[380px] pb-4" // ارتفاع حداقلی تنظیم شد
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
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                >
                  مشاهده همه
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* لودر اسکلتونی - زمانی که اسلایدر هنوز مقداردهی نشده نمایش داده می‌شود */}
            {!isSwiperInit && (
              <div className="absolute inset-0 z-10 bg-white">
                <SliderSkeleton />
              </div>
            )}

            {/* بدنه اسلایدر */}
            <div
              className={`transition-opacity duration-300 ${
                isSwiperInit ? "opacity-100" : "opacity-0"
              }`}
            >
              <Swiper
                modules={[Navigation, Pagination, A11y]}
                onInit={() => setIsSwiperInit(true)} // مقداردهی به محض لود کامل اسلایدر
                navigation={swiperControls.navigation}
                pagination={swiperControls.pagination}
                spaceBetween={14}
                slidesPerView={2.2}
                breakpoints={{
                  480: { slidesPerView: 2.6, spaceBetween: 14 },
                  768: { slidesPerView: 3.2, spaceBetween: 16 },
                  1024: { slidesPerView: 4, spaceBetween: 18 },
                  1280: { slidesPerView: 5, spaceBetween: 18 },
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
                    <SwiperSlide key={p.id} className="w-full md:!w-[230px] h-auto">
                      <article
                        itemScope
                        itemType="https://schema.org/Product"
                        className="group/card h-full flex flex-col border border-slate-200 rounded-2xl bg-white overflow-hidden hover:shadow-[0_10px_32px_rgba(0,0,0,0.10)] transition-all duration-300"
                      >
                        {/* لینک اول: تصویر محصول */}
                        <Link
                          href={href}
                          itemProp="url"
                          className="block relative w-full aspect-[4/5] bg-slate-50 flex items-center justify-center p-4 overflow-hidden shrink-0"
                        >
                          <div className="relative w-full h-full transition-transform duration-300 ease-out group-hover/card:scale-105">
                            <SafeImage
                              src={p.imageUrl || "/images/products/bookExample.jpg"}
                              alt={p.name}
                              fill
                              className="object-contain mix-blend-multiply"
                              sizes="(max-width: 768px) 170px, 200px"
                              itemProp="image"
                            />
                          </div>
                        </Link>

                        {/* لینک مستقل سبد خرید */}
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

                        {/* لینک دوم: عنوان و توضیحات محصول */}
                        <Link
                          href={href}
                          className="flex flex-col flex-1 p-3 md:p-4"
                        >
                          <h3
                            className="leading-relaxed line-clamp-2 min-h-[2.5rem]  font-medium"
                            title={p.name}
                            itemProp="name"
                          >
                            {p.name}
                          </h3>
                          <div className="space-y-2 mt-2">
                            <span className="inline-flex text-11 items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded w-fit">
                              <FileQuestion className="w-3.5 h-3.5" />
                              سوالات طبقه بندی شده
                            </span>
                            <span className="inline-flex text-11 items-center gap-1 text-slate-600 px-2 py-1 rounded w-fit">
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              دارای پاسخ تشریحی
                            </span>
                          </div>
                          <div className="mt-auto pt-3">
                            <span className="w-full h-9 md:h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center group-hover/card:bg-blue-700 transition-all ">
                              مشاهده جزئیات
                            </span>
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
                className="flex absolute top-1/2 left-0 md:-left-5 z-30 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 bg-white/95 backdrop-blur-sm rounded-full shadow-md border border-slate-200 items-center justify-center text-slate-600 hover:text-blue-700 hover:scale-105 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <button
                ref={setPrevBtn}
                type="button"
                aria-label="اسلاید قبلی"
                className="flex absolute top-1/2 right-0 md:-right-5 z-30 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 bg-white/95 backdrop-blur-sm rounded-full shadow-md border border-slate-200 items-center justify-center text-slate-600 hover:text-blue-700 hover:scale-105 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Pagination Container */}
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
