"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";

interface ProductType {
  id: string;
  name: string;
  slug?: string;
  oldPrice?: number | null;
  newPrice?: number | null;
  imageUrl?: string | null;
}

interface Props {
  title?: string;
  products: ProductType[];
  viewAllLink?: string; // لینک دکمه "دیدن همه" (اختیاری)
  viewAllText?: string; // متن دکمه "دیدن همه" (اختیاری)
}

export default function RecomendedProduct({ 
  title = "آموزش‌های پرمخاطب", 
  products,
  viewAllLink = "/resources",
  viewAllText = "دیدن همه"
}: Props) {
  // فقط استیت‌های مربوط به دکمه‌های اسلایدر نگه داشته شدند
  const [prevBtn, setPrevBtn] = useState<HTMLButtonElement | null>(null);
  const [nextBtn, setNextBtn] = useState<HTMLButtonElement | null>(null);

  return (
    <div className="w-full mx-auto text-xs md:text-sm" dir="rtl">
      
      {/* بخش هدر ساده شده */}
      <div className="flex items-center justify-between mb-6 md:border md:border-gray-300 md:bg-slate-300 rounded p-2 md:px-4 md:py-3">
        <h2 className="text-slate-700 font-bold text-sm md:text-base whitespace-nowrap">
          {title}
        </h2>
        
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="flex items-center text-[#2b5c9e] text-sm hover:text-[#1a3b66] font-medium transition-colors whitespace-nowrap"
          >
            {viewAllText}
            <ChevronLeft className="w-4 h-4 mr-1" />
          </Link>
        )}
      </div>

      {/* بخش محتوا (اسلایدر اصلی) */}
      <div className="relative group min-h-[300px]">
        <Swiper
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
          {products.map((p) => (
            <SwiperSlide key={p.id} className="w-full md:!w-[200px]">
              {/* در صورت نیاز می‌توانید لینک زیر را داینامیک‌تر کنید */}
              <Link href={`/resources/course/${p.id}`} className="block h-full">
                <div className="group/card flex flex-col h-full w-full border border-gray-300 rounded bg-white overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500">
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
                    <div className="mt-auto pt-3 md:pt-4">
                      <button className="w-full h-9 md:h-10 rounded-xl bg-blue-50 text-slate-600 flex items-center justify-center gap-2 group-hover/card:bg-green-600 group-hover/card:text-white group-hover/card:shadow-md group-hover/card:shadow-green-200 transition-all duration-300">
                        مشاهده جزئیات
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}

          {(!products || products.length === 0) && (
            <div className="w-full text-center py-10 text-slate-500">
              موردی یافت نشد.
            </div>
          )}
        </Swiper>

        {/* دکمه Next */}
        <button
          ref={setNextBtn}
          className="absolute top-1/2 -left-5 z-30 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-105 transition-all duration-300 xl:hidden xl:group-hover:flex disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* دکمه Prev */}
        <button
          ref={setPrevBtn}
          className="absolute top-1/2 -right-5 z-30 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-105 transition-all duration-300 xl:hidden xl:group-hover:flex disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
