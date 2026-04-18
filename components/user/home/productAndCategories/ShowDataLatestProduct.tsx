"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { ChevronLeft, ChevronRight, FileQuestion, FileText, Loader2 } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { fetchProductsByCategoriesAction } from "@/actions/user/home/productAndCategories/fetch/Actions";
import { TabType } from "./page"; // مسیر این ایمپورت باید به فایل اولی اشاره کند

interface ProductType {
  id: string;
  name: string;
  slug: string;
  oldPrice?: number | null;
  newPrice?: number | null;
  imageUrl?: string | null;
  categoryIds?: string[];
}

interface Props {
  title: string;
  tabs: TabType[];
  defaultTab: string;
  products: ProductType[];
}

export default function CourseTabSlider({ title, tabs=[], defaultTab, products: initialProducts }: Props) {



  // ✅ اصلاح شد: مقدار اولیه تب به جای "all" باید defaultTab باشد
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentProducts, setCurrentProducts] = useState<ProductType[]>(initialProducts);

  const [prevBtn, setPrevBtn] = useState<HTMLButtonElement | null>(null);
  const [nextBtn, setNextBtn] = useState<HTMLButtonElement | null>(null);

  const handleTabChange = async (tabSlug: string) => {
    if (tabSlug === activeTab) return;

    setActiveTab(tabSlug);
    setIsLoading(true);

    const result = await fetchProductsByCategoriesAction(tabSlug);
    
    if (result.success) {
      setCurrentProducts(result.data.products);
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full mx-auto text-xs md:text-sm" dir="rtl">
      {/* بخش هدر و تب‌ها */}
      <div className="flex flex-col md:flex-row py-1 md:border md:border-gray-100 md:bg-slate-100 rounded items-center justify-between mb-6 gap-4 overflow-hidden">
        <div className="flex justify-between items-center w-full md:w-auto shrink-0 pr-4 pl-2 md:border-l border-slate-100 py-2 md:py-0">
          <h2 className="text-slate-700 font-bold text-sm whitespace-nowrap">
            {title}
          </h2>
          <div className="md:hidden">
            <Link
              href={`/resources`}
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
            {tabs.map((cat, index) => (
              <SwiperSlide key={index} className="py-1" style={{ width: 'max-content' }}>
                <button
                  onClick={() => handleTabChange(cat.catSlug)}
                  className={`px-4 py-2 font-medium rounded whitespace-nowrap transition-all duration-300 ${
                    activeTab === cat.catSlug
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
            href={`/resources`}
            className="flex items-center text-[#2b5c9e] hover:text-[#1a3b66] font-medium transition-colors whitespace-nowrap"
          >
            دیدن همه
            <ChevronLeft className="w-4 h-4 mr-1" />
          </Link>
        </div>
      </div>

      {/* بخش محتوا */}
      <div className="relative group rounded-md overflow-hidden p-1 min-h-[320px]">
        {isLoading && (
          <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center w-full h-full bg-white/60 backdrop-blur-[2px] gap-3 text-slate-600 transition-all duration-300 rounded-lg">
            <Loader2 className="w-10 h-10 animate-spin text-[#2b5c9e]" />
            <span className="text-sm font-medium">در حال دریافت اطلاعات...</span>
          </div>
        )}

        <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          <Swiper
            key={activeTab}
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
            {currentProducts.map((p) => (
              <SwiperSlide key={p.id} className="w-full md:!w-[200px]">
                <Link href={`/resources/course/${p.id}`} className="block h-full">
                  <div className="group/card flex flex-col h-full w-full border border-gray-100 rounded bg-white overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 ">
                    <div className="relative w-full aspect-[4/5] bg-gradient-to-b from-slate-50/50 to-slate-100/50 flex items-center justify-center p-4 md:p-5 overflow-hidden">
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

            {currentProducts.length === 0 && !isLoading && (
              <div className="w-full text-center py-10 text-slate-500 ">
                موردی در این دسته‌بندی یافت نشد.
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
