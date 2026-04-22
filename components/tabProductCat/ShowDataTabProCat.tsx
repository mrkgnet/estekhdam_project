"use client";

import React, { useState, useMemo, useCallback } from "react";
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
        <div className="h-full border border-slate-200 rounded-xl bg-white overflow-hidden">
            <div className="w-full aspect-[4/5] bg-slate-100 animate-pulse" />
            <div className="p-3 space-y-3 animate-pulse">
                <div className="h-4 bg-slate-200 rounded" />
                <div className="h-4 bg-slate-100 rounded w-4/5" />
                <div className="h-4 bg-slate-100 rounded w-3/5" />
                <div className="h-9 bg-slate-200 rounded-lg" />
            </div>
        </div>
    );
});

export default function ShowDataTabProCat({
    mainCategory,
    isLoading = false,
}: ShowDataTabProCatProps) {
    const rawTabs = useMemo(
        () => (Array.isArray(mainCategory?.children) ? mainCategory.children : []),
        [mainCategory?.children],
    );

    const hasDirectProducts = Boolean(mainCategory?.products?.length);

    const tabList = useMemo(() => {
        const childTabs = rawTabs.map((tab: CategoryType) => ({
            slug: tab.catSlug,
            name: tab.catName,
            products: Array.isArray(tab.products) ? tab.products : [],
        }));

        return [
            ...(hasDirectProducts
                ? [
                    {
                        slug: "direct_products",
                        name: "همه‌ی منابع",
                        products: mainCategory.products ?? [],
                        isFallback: true,
                    },
                ]
                : []),
            ...childTabs,
        ];
    }, [rawTabs, hasDirectProducts, mainCategory.products]);

    const defaultTab = tabList[0]?.slug ?? "";

    const [activeTab, setActiveTab] = useState(defaultTab);
    const [prevBtn, setPrevBtn] = useState<HTMLButtonElement | null>(null);
    const [nextBtn, setNextBtn] = useState<HTMLButtonElement | null>(null);

    const productsByTab = useMemo(() => {
        const map: Record<string, ProductType[]> = {};
        tabList.forEach((tab) => {
            map[tab.slug] = tab.products;
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

    const sliderBreakpoints = useMemo(
        () => ({
            320: { slidesPerView: 2.15, spaceBetween: 10 },
            480: { slidesPerView: 2.7, spaceBetween: 12 },
            640: { slidesPerView: 3.3, spaceBetween: 12 },
            768: { slidesPerView: 3, spaceBetween: 14 },
            1024: { slidesPerView: 4, spaceBetween: 16 },
            1280: { slidesPerView: 5, spaceBetween: 16 },
        }),
        [],
    );

    const skeletonSlides = useMemo(
        () => Array.from({ length: 5 }, (_, idx) => <SkeletonCard key={idx} />),
        [],
    );

    if (!activeTab) return null;

    return (
        <section className="w-full space-y-5" dir="rtl" aria-label={mainCategory?.catName}>
            <header className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 rounded-2xl bg-gradient-to-l from-orange-100/80 via-orange-50/40 to-transparent border-r-4 border-orange-500 overflow-hidden">
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white/35 to-transparent pointer-events-none" />
                <div className="relative flex items-center gap-3 z-10">
                    <span className="flex shrink-0 items-center justify-center w-11 h-11 rounded-xl bg-white border border-orange-100 text-orange-500 shadow-sm">
                        <Flame className="w-5 h-5" />
                    </span>
                    <div className="space-y-1">
                        <h2 className=" font-semibold text-slate-600">
                            {mainCategory?.catName}
                        </h2>
                        <p className=" text-slate-600 ">
                            محبوب‌ترین و پربازدیدترین منابع آموزشی از نگاه کاربران
                        </p>
                    </div>
                </div>
            </header>

            <nav
                className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-100/80 border border-slate-200 rounded-xl p-2 md:p-3"
                aria-label="تب‌های دسته بندی"
            >
                <div className="flex items-center justify-between w-full md:w-auto md:pl-3">
                    <h3 className="text-slate-700  whitespace-nowrap">
                        {mainCategory?.catName}
                    </h3>
                    <Link
                        href={`/resources?category=${mainCategory?.catSlug}`}
                        className="md:hidden text-[#2b5c9e] hover:text-[#1a3b66]   flex items-center transition-colors"
                        aria-label={`مشاهده همهٔ منابع دسته ${mainCategory?.catName}`}
                    >
                        دیدن همه <ChevronLeft className="w-4 h-4 mr-1" />
                    </Link>
                </div>

                <Swiper
                    modules={[FreeMode]}
                    slidesPerView="auto"
                    spaceBetween={8}
                    freeMode
                    dir="rtl"
                    className="w-full"
                    role="tablist"
                    aria-orientation="horizontal"
                >
                    {tabList.map((tab) => (
                        <SwiperSlide
                            key={tab.slug}
                            className="py-1"
                            style={{ width: "max-content" }}
                        >
                            <button
                                onClick={() => handleTabChange(tab.slug)}
                                className={`px-4 py-2 rounded-full   transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-300
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

                <div className="hidden md:block shrink-0">
                    <Link
                        href={`/resources?category=${mainCategory?.catSlug}`}
                        className="text-[#2b5c9e] hover:text-[#1a3b66]   flex items-center transition-colors"
                        aria-label={`مشاهده تمام منابع دسته ${mainCategory?.catName}`}
                    >
                        دیدن همه <ChevronLeft className="w-4 h-4 mr-1" />
                    </Link>
                </div>
            </nav>

            <div
                className="relative group rounded-xl border border-slate-200 bg-white p-2"
                role="tabpanel"
                id={`tab-panel-${activeTab}`}
                aria-labelledby={`tab-${activeTab}`}
            >
                <Swiper
                    key={activeTab}
                    modules={[Navigation]}
                    navigation={{ nextEl: nextBtn, prevEl: prevBtn }}
                    spaceBetween={12}
                    slidesPerView={1.15}
                    breakpoints={sliderBreakpoints}
                    className="py-2"
                    dir="rtl"
                >
                    {isLoading
                        ? skeletonSlides.map((skeleton, idx) => (
                            <SwiperSlide key={`skeleton-${idx}`} className="w-full">
                                {skeleton}
                            </SwiperSlide>
                        ))
                        : currentProducts.map((product: ProductType, index: number) => (
                            <SwiperSlide key={product.id ?? index} className="w-full md:!w-[220px]">
                                <Link
                                    href={`/resources/course/${product.slug}`}
                                    aria-label={`مشاهده جزئیات ${product.name}`}
                                    className="block h-full"
                                >
                                    <article className="group/card flex flex-col h-full border border-slate-200 rounded-xl bg-white overflow-hidden hover:shadow-lg transition-all">
                                        <div className="relative w-full aspect-[4/5] bg-slate-50 flex items-center justify-center p-4 overflow-hidden">
                                            <div className="relative w-full h-full transition-transform duration-500 group-hover/card:scale-105">
                                                <SafeImage
                                                    src={product.imageUrl || "/images/products/bookExample.jpg"}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain"
                                                    sizes="(max-width: 480px) 220px, (max-width: 768px) 320px, 200px"
                                                    priority={index < 2}
                                                    loading={index < 2 ? "eager" : "lazy"}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col flex-1 p-3 md:p-4 space-y-3">
                                            <h4 className="text-slate-600  leading-snug line-clamp-2 min-h-[2.6rem] group-hover/card:text-green-700 transition-colors">
                                                {product.name}
                                            </h4>

                                            <div className="space-y-2 ">
                                                <span className="inline-flex text-11 items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded ">
                                                    <FileQuestion className="w-3.5 h-3.5" />
                                                    سوالات طبقه بندی شده
                                                </span>
                                                <span className="inline-flex text-11 items-center gap-1 text-slate-600 px-2 py-1 rounded ">
                                                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                                                    دارای پاسخ تشریحی
                                                </span>
                                            </div>

                                            <button className="mt-auto w-full h-9 rounded-lg bg-blue-50 text-slate-600   transition-all group-hover/card:bg-green-600 group-hover/card:text-white">
                                                مشاهده بانک سوالات
                                            </button>
                                        </div>
                                    </article>
                                </Link>
                            </SwiperSlide>
                        ))}

                    {!isLoading && currentProducts.length === 0 && (
                        <SwiperSlide className="w-full">
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 py-12 text-slate-500 ">
                                <span className="">محصولی در این دسته‌بندی یافت نشد.</span>
                                <span className=" text-slate-400">
                                    به زودی منابع جدید اضافه می‌شود.
                                </span>
                            </div>
                        </SwiperSlide>
                    )}
                </Swiper>

                <button
                    ref={setNextBtn}
                    className="absolute top-1/2 left-2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all sm:w-10 sm:h-10 xl:hidden"
                    aria-label="اسلاید بعدی"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                    ref={setPrevBtn}
                    className="absolute top-1/2 right-2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all sm:w-10 sm:h-10 xl:hidden"
                    aria-label="اسلاید قبلی"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
}
