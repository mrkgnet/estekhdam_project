"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  FileQuestion,
  FileText,
  Flame,
} from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";

type ProductType = any;
type CategoryType = any;

type ShowDataTabProCatProps = {
  mainCategory: CategoryType;
  isLoading?: boolean;
};

const SkeletonCard = React.memo(function SkeletonCard() {
  return (
    <div className="h-full border border-gray-300 rounded bg-white overflow-hidden animate-pulse">
      <div className="w-full h-[120px] bg-slate-100" />
      <div className="p-2 md:p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded" />
        <div className="h-4 bg-slate-100 rounded w-4/5" />
        <div className="h-4 bg-slate-100 rounded w-3/5" />
      </div>
    </div>
  );
});

function HeaderSkeleton() {
  return (
    <header className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 rounded-2xl bg-gradient-to-l from-slate-100/80 via-slate-50/40 to-transparent border-r-4 border-slate-500 overflow-hidden animate-pulse">
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white/35 to-transparent pointer-events-none" />
      <div className="relative flex items-center gap-3 z-10">
        <span className="flex shrink-0 items-center justify-center w-11 h-11 rounded-xl bg-slate-200 shadow-sm"></span>
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-slate-200"></div>
          <div className="h-3 w-56 rounded bg-slate-100"></div>
        </div>
      </div>
    </header>
  );
}

function TabsSkeleton() {
  return (
    <nav className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[rgb(234,240,249)] border border-slate-200 rounded-xl p-2 md:p-3 animate-pulse">
      <div className="flex items-center justify-between w-full md:w-auto md:pl-3">
        <div className="h-4 w-24 rounded bg-slate-200 hidden md:block"></div>
      </div>
      <div className="relative flex-1 w-full flex items-center overflow-hidden group/tabs px-1 sm:px-6">
        <button className="absolute right-0 w-8 h-8 bg-slate-200 rounded-full shadow border border-slate-200"></button>
        <Swiper
          modules={[FreeMode, Navigation]}
          slidesPerView="auto"
          spaceBetween={8}
          freeMode
          dir="rtl"
          className="w-full"
        >
          {Array.from({ length: 5 }).map((_, idx) => (
            <SwiperSlide key={idx} style={{ width: "max-content" }}>
              <div className="px-4 py-2 rounded-full bg-slate-200 h-8 w-24"></div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className="absolute left-0 w-8 h-8 bg-slate-200 rounded-full shadow border border-slate-200"></button>
      </div>
      <div className="hidden md:block shrink-0 h-4 w-20 rounded bg-slate-200"></div>
    </nav>
  );
}

export default function ShowDataTabProCat({
  mainCategory,
  isLoading = false,
}: ShowDataTabProCatProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  console.log(mainCategory)

  const rawTabs = useMemo(
    () => (Array.isArray(mainCategory?.children) ? mainCategory.children : []),
    [mainCategory?.children],
  );

  const hasDirectProducts = Boolean(mainCategory?.products?.length);

  const tabList = useMemo(() => {
    const childTabs = rawTabs.map((tab: CategoryType) => ({
      slug: tab.catSlug || tab.slug || tab.id,
      name: tab.catName || tab.name || "بدون نام",
      products: Array.isArray(tab.products) ? tab.products : [],
    }));

    return [
      ...(hasDirectProducts
        ? [
          {
            slug: "direct_products",
            name: "همه‌ی منابع",
            products: Array.isArray(mainCategory?.products)
              ? mainCategory.products
              : [],
            isFallback: true,
          },
        ]
        : []),
      ...childTabs,
    ];
  }, [rawTabs, hasDirectProducts, mainCategory?.products]);

  const defaultTab = tabList[0]?.slug ?? "";
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (!activeTab && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, activeTab]);

  const [prevTabBtn, setPrevTabBtn] = useState<HTMLButtonElement | null>(null);
  const [nextTabBtn, setNextTabBtn] = useState<HTMLButtonElement | null>(null);

  const [prevBtn, setPrevBtn] = useState<HTMLButtonElement | null>(null);
  const [nextBtn, setNextBtn] = useState<HTMLButtonElement | null>(null);

  const productsByTab = useMemo(() => {
    const map: Record<string, ProductType[]> = {};
    tabList.forEach((tab) => {
      map[tab.slug] = Array.isArray(tab.products) ? tab.products : [];
    });
    return map;
  }, [tabList]);

  const currentProducts = useMemo(
    () => productsByTab[activeTab] ?? [],
    [productsByTab, activeTab],
  );

  const handleTabChange = useCallback((tabSlug: string) => {
    setActiveTab(tabSlug);
  }, []);

  // دقیقا مثل اسلایدر قبلی
  const sliderBreakpoints = useMemo(
    () => ({
      480: { slidesPerView: 4.8, spaceBetween: 12 },
      768: { slidesPerView: 4, spaceBetween: 16 },
      1280: { slidesPerView: 5, spaceBetween: 16 },
    }),
    [],
  );

  const skeletonSlides = useMemo(
    () => Array.from({ length: 4 }, (_, idx) => <SkeletonCard key={idx} />),
    [],
  );

  const categoryName = mainCategory?.catName || mainCategory?.name || "دسته‌بندی";
  const categorySlug = mainCategory?.catSlug || mainCategory?.slug || "";

  const showSkeleton = !mounted || isLoading;

  if (tabList.length === 0 && !isLoading) return null;
  if (!activeTab && !isLoading) return null;

  if (showSkeleton) {
    return (
      <section className="w-full space-y-5" aria-label={`${categoryName} skeleton`}>
        <HeaderSkeleton />
        <TabsSkeleton />
        <div className="relative group/content rounded-xl border border-slate-200 bg-white p-2 animate-pulse">
          <button className="absolute top-1/2 right-2 -translate-y-1/2 w-9 h-9 bg-slate-200 rounded-full shadow border border-slate-200"></button>
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={2}
            breakpoints={sliderBreakpoints}
            className="py-2 px-1"
            dir="rtl"
          >
            {skeletonSlides.map((skeleton, idx) => (
              <SwiperSlide key={`skeleton-${idx}`} className="w-full h-auto">
                {skeleton}
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="absolute top-1/2 left-2 -translate-y-1/2 w-9 h-9 bg-slate-200 rounded-full shadow border border-slate-200"></button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full space-y-5" dir="rtl" aria-label={categoryName}>
      <header className="relative flex items-center justify-between w-full p-4 rounded-xl bg-gradient-to-l from-orange-50/80 to-transparent border border-slate-100 border-r-4 border-r-orange-500 overflow-hidden">
        <div className="flex items-center gap-3 z-10">
          <div className="flex shrink-0 items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white border border-orange-100 text-orange-500 shadow-sm">
            <Flame className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h2 className="font-bold text-sm md:text-base text-slate-800">
            مجموعه {categoryName}
          </h2>
        </div>

        <div className="z-10">
          <Link
            href={`/resources?category=${categorySlug}`}
            className="group flex text-sm md:text-base items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
            aria-label={`مشاهده همهٔ منابع دسته ${categoryName}`}
          >
            <span className="hidden sm:block ">مشاهده همه</span>
            <span className="md:hidden sm:block "> همه</span>
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </header>

      <nav
        className="flex flex-col md:flex-row items-center justify-between  bg-[rgb(234,240,249)] border border-slate-200 rounded-xl p-2 md:p-3"
        aria-label="تب‌های دسته بندی"
      >
        <div className="flex items-center justify-between w-full md:w-auto md:pl-3">
          <h3 className="hidden md:block text-sm md:text-base font-bold text-blue-800 whitespace-nowrap">
            {categoryName}
          </h3>
        </div>

        <div className="relative flex-1 w-full flex items-center overflow-hidden group/tabs px-1 sm:px-6">
          <button
            ref={setPrevTabBtn}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded shadow border border-slate-400 flex items-center justify-center text-slate-600 hover:text-orange-500 transition-all opacity-0 group-hover/tabs:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
            aria-label="تب قبلی"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <Swiper
            modules={[FreeMode, Navigation]}
            navigation={{ nextEl: nextTabBtn, prevEl: prevTabBtn }}
            slidesPerView="auto"
            spaceBetween={8}
            freeMode
            dir="rtl"
            className="w-full"
            role="tablist"
            aria-orientation="horizontal"
          >
            {tabList.map((tab) => (
              <SwiperSlide key={tab.slug} className="py-1" style={{ width: "max-content" }}>
                <button
                  onClick={() => handleTabChange(tab.slug)}
                  className={`px-4 py-2 rounded-full transition-all font-bold border border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-300
                    ${activeTab === tab.slug
                      ? "bg-white text-slate-800 shadow-md"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  role="tab"
                  aria-selected={activeTab === tab.slug}
                  aria-controls={`tab-panel-${tab.slug}`}
                  id={`tab-${tab.slug}`}
                >
                  {tab.name}
                </button>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            ref={setNextTabBtn}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded shadow border border-slate-400 flex items-center justify-center text-slate-600 hover:text-orange-500 transition-all opacity-0 group-hover/tabs:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
            aria-label="تب بعدی"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden md:block shrink-0">
          <Link
            href={`/resources?category=${categorySlug}`}
            className="text-[#2b5c9e] text-14 font-semibold hover:text-[#1a3b66] flex items-center transition-colors"
            aria-label={`مشاهده تمام منابع دسته ${categoryName}`}
          >
            دیدن همه <ChevronLeft className="w-4 h-4 mr-1" />
          </Link>
        </div>
      </nav>

      <div
        className="relative group/content rounded-xl border border-slate-200 bg-white p-2"
        role="tabpanel"
        id={`tab-panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        <button
          ref={setPrevBtn}
          className="absolute top-1/2 right-2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded shadow border border-slate-400 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all z-10 opacity-0 group-hover/content:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
          aria-label="اسلاید قبلی"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <Swiper
          key={activeTab}
          modules={[Navigation]}
          navigation={{ nextEl: nextBtn, prevEl: prevBtn }}
          spaceBetween={10}
          slidesPerView={2}
          breakpoints={sliderBreakpoints}
          className="py-2 px-1"
          dir="rtl"
        >
          {isLoading
            ? skeletonSlides.map((skeleton, idx) => (
              <SwiperSlide key={`skeleton-${idx}`} className="w-full h-auto">
                {skeleton}
              </SwiperSlide>
            ))
            : currentProducts.map((product: ProductType, index: number) => (
              <SwiperSlide key={product.id ?? index} className="w-full h-auto">
                <Link
                  href={`/resources/course/${product.slug}`}
                  aria-label={`مشاهده جزئیات ${product.name}`}
                  className="block h-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <article className="group/card flex flex-col h-full w-full border border-gray-300 rounded overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 bg-white">
                    <div className="relative w-full h-[150px] flex-shrink-0 flex items-center justify-center p-2 overflow-hidden">

                      {/* ✅ Label */}
                      <span className="absolute top-2 right-2 z-20 text-[10px] px-2 py-1 rounded-full bg-blue-600 text-white shadow">
                        آنلاین
                      </span>
                      <div className="relative w-full h-full">
                        <SafeImage
                          src={product.imageUrl || "/images/products/bookExample.jpg"}
                          alt={product.name}
                          fill
                          className="object-contain mix-blend-multiply transition-opacity duration-300"
                          sizes="(max-width: 768px) 170px, 400px"
                          loading={index < 2 ? "eager" : "lazy"}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 p-2 md:p-5 z-10 justify-between">
                      <h4 className="text-slate-800 font-semibold leading-relaxed line-clamp-2 min-h-[2.5rem] group-hover/card:text-emerald-600 transition-colors duration-200">
                        {product.name}
                      </h4>

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
                    </div>
                  </article>
                </Link>
              </SwiperSlide>
            ))}

          {!isLoading && currentProducts.length === 0 && (
            <SwiperSlide className="w-full">
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 py-12 text-slate-500">
                <span>محصولی در این بخش یافت نشد.</span>
                <span className="text-slate-400">
                  به زودی منابع جدید اضافه می‌شود.
                </span>
              </div>
            </SwiperSlide>
          )}
        </Swiper>

        <button
          ref={setNextBtn}
          className="absolute top-1/2 left-2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded shadow border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all z-10 opacity-0 group-hover/content:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
          aria-label="اسلاید بعدی"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
