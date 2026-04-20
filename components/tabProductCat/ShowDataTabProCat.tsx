"use client";

import React, { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { ChevronLeft, ChevronRight, FileQuestion, FileText, Flame } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";

// اضافه کردن تایپ‌ها (اگر تایپ مشخصی دارید جایگزین کنید)
type ProductType = any;
type CategoryType = any;

export default function ShowDataTabProCat({ mainCategory }: { mainCategory: CategoryType }) {

    // استخراج زیردسته‌ها (تب‌ها)
    const tabs = mainCategory.children || [];

    // اگر دسته اصلی خودش مستقیم محصول داشته باشد، یک تب "عمومی" برایش در نظر می‌گیریم
    const hasDirectProducts = mainCategory.products && mainCategory.products.length > 0;

    // پیدا کردن تب پیش‌فرض (اولین زیردسته یا محصولات خود دسته اصلی)
    const defaultTab = tabs.length > 0 ? tabs[0].catSlug : (hasDirectProducts ? 'direct_products' : '');

    const [activeTab, setActiveTab] = useState(defaultTab);

    const [prevBtn, setPrevBtn] = useState<HTMLButtonElement | null>(null);
    const [nextBtn, setNextBtn] = useState<HTMLButtonElement | null>(null);

    // محاسبه محصولاتی که باید در اسلایدر نمایش داده شوند (بدون نیاز به لودینگ و API)
    const currentProducts = useMemo(() => {
        if (activeTab === 'direct_products') {
            return mainCategory.products || [];
        }
        const selectedChild = tabs.find((t: any) => t.catSlug === activeTab);
        return selectedChild?.products || [];
    }, [activeTab, mainCategory, tabs]);

    const handleTabChange = (tabSlug: string) => {
        setActiveTab(tabSlug);
    };

    // اگر کلا تبی وجود نداشت، چیزی رندر نکن
    if (!activeTab) return null;

    return (
        <div className="w-full mx-auto text-bodyall " dir="rtl">
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 p-4 md:p-5 rounded-l-2xl rounded-r-md bg-gradient-to-l from-orange-100/70 via-orange-50/30 to-transparent border-r-4 border-orange-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none"></div>
                <div className="relative flex items-center gap-3 md:gap-4 z-10">
                    <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm border border-orange-100 text-orange-500">
                        <Flame className="w-6 h-6 drop-shadow-sm" />
                    </div>
                    <div className="flex flex-col space-y-1">
                        <h2 className="text-gray-900 font-black text-base md:text-lg tracking-tight">
                            <span className="text-red-500 px-1"> 

                                 {mainCategory.catName}
                            </span>

                        </h2>
                        <p className="text-gray-600 text-xs md:text-sm font-medium">
                            محبوب‌ترین و پربازدیدترین منابع آموزشی از نگاه کاربران
                        </p>
                    </div>
                </div>
            </div>


            {/* بخش هدر (سطح اول) و تب‌ها (سطح دوم) */}
            <div className="flex flex-col md:flex-row py-1 md:border md:border-gray-100 md:bg-slate-100 rounded items-center justify-between mb-6 gap-4 overflow-hidden">
                <div className="flex justify-between items-center w-full md:w-auto shrink-0 pr-4 pl-2 md:border-l border-slate-100 py-2 md:py-0">
                    <h2 className="text-slate-700 font-bold text-sm whitespace-nowrap">
                        {/* عنوان سطح اول */}
                        {mainCategory.catName}
                    </h2>
                    <div className="md:hidden">
                        <Link
                            href={`/resources?category=${mainCategory.catSlug}`}
                            className="flex items-center text-[#2b5c9e] text-sm hover:text-[#1a3b66] font-medium transition-colors whitespace-nowrap"
                        >
                            دیدن همه
                            <ChevronLeft className="w-4 h-4 mr-1" />
                        </Link>
                    </div>
                </div>

                <div className="flex-1 w-full py-1 min-w-0 max-w-full block overflow-hidden border border-gray-300 bg-slate-100 md:border-0 px-1.5 rounded">
                    <Swiper
                        modules={[FreeMode]}
                        slidesPerView="auto"
                        spaceBetween={8}
                        freeMode={true}
                        className="w-full px-2"
                        dir="rtl"
                    >
                        {/* اگر دسته اصلی مستقیم محصول داشت، تب آن را بساز */}
                        {/* {hasDirectProducts && (
                            <SwiperSlide className="py-1" style={{ width: 'max-content' }}>
                                <button
                                    onClick={() => handleTabChange('direct_products')}
                                    className={`px-4 py-2 font-medium rounded whitespace-nowrap transition-all duration-300 ${activeTab === 'direct_products'
                                            ? "bg-white text-slate-800 shadow-md transform scale-105"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                                        }`}
                                >
                                     همه
                                </button>
                            </SwiperSlide>
                        )} */}

                        {/* حلقه روی زیردسته‌ها به عنوان تب (سطح دوم) */}
                        {tabs.map((cat: any, index: number) => (
                            <SwiperSlide key={index} className="py-1" style={{ width: 'max-content' }}>
                                <button
                                    onClick={() => handleTabChange(cat.catSlug)}
                                    className={`px-4 py-2 font-medium rounded whitespace-nowrap transition-all duration-300 ${activeTab === cat.catSlug
                                            ? "bg-white text-slate-800 shadow-md transform scale-105"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                                        }`}
                                >
                                    {cat.catName}
                                </button>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="shrink-0 pl-2 hidden md:block">
                    <Link
                        href={`/resources?category=${mainCategory.catSlug}`}
                        className="flex items-center text-[#2b5c9e] hover:text-[#1a3b66] font-medium transition-colors whitespace-nowrap"
                    >
                        دیدن همه
                        <ChevronLeft className="w-4 h-4 mr-1" />
                    </Link>
                </div>
            </div>

            {/* بخش محتوا و محصولات (سطح سوم) */}
            <div className="relative group rounded-md overflow-hidden p-1 min-h-[320px]">
                <div className="transition-opacity duration-300 opacity-100">
                    <Swiper
                        key={activeTab} // با تغییر تب کامپوننت ریمونت میشود تا به درستی کار کند
                        modules={[Navigation]}
                        navigation={{ nextEl: nextBtn, prevEl: prevBtn }}
                        spaceBetween={10}
                        slidesPerView={2.3}
                        breakpoints={{
                            480: { slidesPerView: 2.8, spaceBetween: 12 },
                            768: { slidesPerView: 3.2, spaceBetween: 16 },
                            1024: { slidesPerView: 4, spaceBetween: 16 },
                            1280: { slidesPerView: 5, spaceBetween: 16 },
                        }}
                        className="py-2 animate-in fade-in duration-500"
                        dir="rtl"
                    >
                        {currentProducts.map((p: any) => (
                            <SwiperSlide key={p.id} className="w-full md:!w-[200px]">
                                <Link href={`/resources/course/${p.slug}`} className="block h-full border border-gray-200 rounded">
                                    <div className="group/card flex flex-col h-full w-full border border-gray-100 rounded bg-white overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 ">
                                        <div className="relative w-full aspect-[4/5] bg-gradient-to-b  flex items-center justify-center p-4 md:p-5 overflow-hidden">
                                            <div className="relative w-full h-full transform transition-transform duration-500 ease-out drop-shadow-sm drop-shadow-xl group-hover/card:scale-110">
                                                <SafeImage
                                                    src={p.imageUrl || "/images/products/bookExample.jpg"}
                                                    alt={p.name}
                                                    fill
                                                    className="object-contain mix-blend-multiply md:p-0"
                                                    sizes="(max-width: 768px) 170px, 200px"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col flex-1 p-3 md:p-4 bg-white z-10">
                                            <h3 className="text-slate-700 md:leading-relaxed line-clamp-2 min-h-[2.5rem] md:min-h-[2.75rem] group-hover/card:text-green-700 transition-colors duration-300" title={p.name}>
                                                {p.name}
                                            </h3>

                                            <div className="flex flex-col gap-1.5 mt-2">
                                                <div className="flex items-center">
                                                    <span className="bg-[#EEF2FF] text-[#4F46E5] text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                                                        <FileQuestion className="w-3.5 h-3.5" />
                                                        سوالات طبقه بندی شده
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="text-[#121211] text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 font-medium">
                                                        <FileText className="w-3.5 h-3.5 text-gray-500" />
                                                        دارای پاسخ تشریحی
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-3 md:pt-4">
                                                <button className="w-full h-9 md:h-10 rounded-xl bg-blue-50 text-slate-600 flex items-center justify-center gap-2 group-hover/card:bg-green-600 group-hover/card:text-white group-hover/card:shadow-md group-hover/card:shadow-green-200 transition-all duration-300">
                                                    مشاهده بانک سوالات
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}

                        {currentProducts.length === 0 && (
                            <div className="w-full text-center py-10 text-slate-500 ">
                                محصولی در این دسته‌بندی یافت نشد.
                            </div>
                        )}
                    </Swiper>
                </div>

                <button
                    ref={setNextBtn}
                    className="absolute top-1/2 left-1 z-[50] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-105 transition-all duration-300 xl:hidden xl:group-hover:flex disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                    ref={setPrevBtn}
                    className="absolute top-1/2 right-1 z-[50] -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-105 transition-all duration-300 xl:hidden xl:group-hover:flex disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
