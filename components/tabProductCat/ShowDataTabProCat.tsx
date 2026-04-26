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
    // استخراج زیردسته‌ها به صورت ایمن
    const rawTabs = useMemo(
        () => (Array.isArray(mainCategory?.children) ? mainCategory.children : []),
        [mainCategory?.children],
    );

    // بررسی اینکه آیا خود دسته اصلی محصول مستقیمی دارد یا خیر
    const hasDirectProducts = Boolean(mainCategory?.products?.length);

    // ساخت لیست تب‌ها
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
                        products: mainCategory.products ?? [],
                        isFallback: true,
                    },
                ]
                : []),
            ...childTabs,
        ];
    }, [rawTabs, hasDirectProducts, mainCategory?.products]);

    // تب پیش‌فرض
    const defaultTab = tabList[0]?.slug ?? "";
    const [activeTab, setActiveTab] = useState(defaultTab);

    // بروزرسانی اکتیو تب در صورتی که دیتا با تاخیر لود شد
    useEffect(() => {
        if (!activeTab && defaultTab) {
            setActiveTab(defaultTab);
        }
    }, [defaultTab, activeTab]);

    // Refهای مربوط به دکمه‌های ناوبری اسلایدر تب‌ها (هدر)
    const [prevTabBtn, setPrevTabBtn] = useState<HTMLButtonElement | null>(null);
    const [nextTabBtn, setNextTabBtn] = useState<HTMLButtonElement | null>(null);

    // Refهای مربوط به دکمه‌های ناوبری اسلایدر محصولات (محتوا)
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

    // اگر هیچ تبی (نه فرزند و نه محصول مستقیم) وجود نداشت، این سکشن رندر نشود
    if (tabList.length === 0) return null;
    if (!activeTab && !isLoading) return null;

    const categoryName = mainCategory?.catName || mainCategory?.name || "دسته‌بندی";
    const categorySlug = mainCategory?.catSlug || mainCategory?.slug || "";

    return (
        <section className="w-full space-y-5" dir="rtl" aria-label={categoryName}>
            <header className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 rounded-2xl bg-gradient-to-l from-orange-100/80 via-orange-50/40 to-transparent border-r-4 border-orange-500 overflow-hidden">
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white/35 to-transparent pointer-events-none" />
                <div className="relative flex items-center gap-3 z-10">
                    <span className="flex shrink-0 items-center justify-center w-11 h-11 rounded-xl bg-white border border-orange-100 text-orange-500 shadow-sm">
                        <Flame className="w-5 h-5" />
                    </span>
                    <div className="space-y-1">
                        <h2 className="font-semibold text-slate-600">
                            {categoryName}
                        </h2>
                        <p className="text-slate-600">
                            محبوب‌ترین و پربازدیدترین منابع آموزشی از نگاه کاربران
                        </p>
                    </div>
                </div>
            </header>

            <nav
                className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[rgb(234,240,249)] border border-slate-200 rounded-xl p-2 md:p-3"
                aria-label="تب‌های دسته بندی"
            >
                <div className="flex items-center justify-between w-full md:w-auto md:pl-3">
                    <h3 className="text-slate-700 whitespace-nowrap hidden md:block">
                        {categoryName}
                    </h3>
                    <Link
                        href={`/resources?category=${categorySlug}`}
                        className="md:hidden text-[#2b5c9e] hover:text-[#1a3b66] flex items-center transition-colors"
                        aria-label={`مشاهده همهٔ منابع دسته ${categoryName}`}
                    >
                        دیدن همه <ChevronLeft className="w-4 h-4 mr-1" />
                    </Link>
                </div>

                {/* استایل نسبی برای قرارگیری دکمه‌های تب */}
                <div className="relative flex-1 w-full flex items-center overflow-hidden group/tabs px-1 sm:px-6">
                    {/* دکمه تب قبلی (سمت راست در حالت راست‌چین) */}
                    <button
                        ref={setPrevTabBtn}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded-full shadow border border-slate-200 flex items-center justify-center text-slate-600 hover:text-orange-500 transition-all opacity-0 group-hover/tabs:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
                        aria-label="تب قبلی"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    <Swiper
                        modules={[FreeMode, Navigation]} // اضافه شدن ماژول Navigation برای تب‌ها
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
                            <SwiperSlide
                                key={tab.slug}
                                className="py-1"
                                style={{ width: "max-content" }}
                            >
                                <button
                                    onClick={() => handleTabChange(tab.slug)}
                                    className={`px-4 py-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-300
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

                    {/* دکمه تب بعدی (سمت چپ در حالت راست‌چین) */}
                    <button
                        ref={setNextTabBtn}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded-full shadow border border-slate-200 flex items-center justify-center text-slate-600 hover:text-orange-500 transition-all opacity-0 group-hover/tabs:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
                        aria-label="تب بعدی"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </div>

                <div className="hidden md:block shrink-0">
                    <Link
                        href={`/resources?category=${categorySlug}`}
                        className="text-[#2b5c9e] hover:text-[#1a3b66] flex items-center transition-colors"
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
                {/* دکمه اسلاید قبلی محصولات (سمت راست در حالت راست‌چین) */}
                <button
                    ref={setPrevBtn}
                    className="absolute top-1/2 right-2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all z-10 opacity-0 group-hover/content:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
                    aria-label="اسلاید قبلی"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                <Swiper
                    key={activeTab}
                    modules={[Navigation]}
                    navigation={{ nextEl: nextBtn, prevEl: prevBtn }}
                    spaceBetween={12}
                    slidesPerView={1.15}
                    breakpoints={sliderBreakpoints}
                    className="py-2 px-1"
                    dir="rtl"
                >
                    {isLoading
                        ? skeletonSlides.map((skeleton, idx) => (
                            <SwiperSlide key={`skeleton-${idx}`} className="w-full md:!w-[220px]">
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
                                            <h4 className="text-slate-600 leading-snug line-clamp-2 min-h-[2.6rem] group-hover/card:text-green-700 transition-colors">
                                                {product.name}
                                            </h4>

                                            <div className="space-y-2">
                                                <span className="inline-flex text-[11px] items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                                                    <FileQuestion className="w-3.5 h-3.5" />
                                                    سوالات طبقه بندی شده
                                                </span>
                                                <span className="inline-flex text-[11px] items-center gap-1 text-slate-600 px-2 py-1 rounded">
                                                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                                                    دارای پاسخ تشریحی
                                                </span>
                                            </div>

                                            <button className="mt-auto w-full h-9 rounded-lg bg-blue-50 text-slate-600 transition-all group-hover/card:bg-green-600 group-hover/card:text-white">
                                                مشاهده بانک سوالات
                                            </button>
                                        </div>
                                    </article>
                                </Link>
                            </SwiperSlide>
                        ))}

                    {/* اگر تب انتخاب شده هیچ محصولی نداشت */}
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

                {/* دکمه اسلاید بعدی محصولات (سمت چپ در حالت راست‌چین) */}
                <button
                    ref={setNextBtn}
                    className="absolute top-1/2 left-2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-full shadow border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all z-10 opacity-0 group-hover/content:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
                    aria-label="اسلاید بعدی"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
}
