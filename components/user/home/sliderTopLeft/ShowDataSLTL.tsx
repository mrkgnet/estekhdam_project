"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
  viewAllLink?: string; 
  viewAllText?: string; 
}

export default function ShowDataSLTL({ 
  title = "آموزش‌های پرمخاطب", 
  products,
  viewAllLink = "/resources",
  viewAllText = "دیدن همه"
}: Props) {
  const [prevBtn, setPrevBtn] = useState<HTMLButtonElement | null>(null);
  const [nextBtn, setNextBtn] = useState<HTMLButtonElement | null>(null);

  return (
    // اضافه شدن h-full برای پر کردن ارتفاع والد
    <div className="w-full mx-auto text-xs md:text-sm relative px-2 h-full" dir="rtl">
      
      <style jsx global>{`
        .custom-swiper-progress {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #e2e8f0;
          z-index: 20;
          border-radius: 4px 4px 0 0;
          overflow: hidden;
        }
        .custom-swiper-progress .swiper-pagination-progressbar-fill {
          background: linear-gradient(to left, #16a34a, #22c55e);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          transform-origin: right top;
          transition: transform 300ms ease;
        }
      `}</style>

      {/* حذف min-h-[300px] و اضافه شدن h-full */}
      <div className="relative group h-full pt-2">
        <div className="custom-swiper-progress"></div>

        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          navigation={{ nextEl: nextBtn, prevEl: prevBtn }}
          autoplay={{
            delay: 4000, // اصلاح شد
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            el: '.custom-swiper-progress',
            type: 'progressbar',
          }}
          spaceBetween={10}
          slidesPerView={2.3} 
          breakpoints={{
            480: { slidesPerView: 2.8, spaceBetween: 12 }, 
            768: { slidesPerView: 1, spaceBetween: 16 }, 
            1024: { slidesPerView: 1, spaceBetween: 16 }, 
            1280: { slidesPerView: 1, spaceBetween: 16 }, 
          }}
          // اضافه شدن h-full به کلاس‌های swiper
          className="py-2 animate-in fade-in duration-500 static mt-2 h-full"
          dir="rtl"
        >
          {products.map((p) => (
            <SwiperSlide key={p.id} className="w-full h-auto">
              <Link href={`/resources/course/${p.id}`} className="block h-full text-xs md:text-sm">
                <div className="group/card flex flex-col h-full w-full border border-gray-300 rounded overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 bg-white">
                  
                  {/* تغییرات مهم اینجا اعمال شد: کاهش ارتفاع عکس و اضافه شدن flex-shrink-0 */}
                  <div className="relative w-full h-[150px] md:h-[180px] xl:h-[200px] flex-shrink-0 bg-gradient-to-b from-slate-50/50 to-slate-100/50 flex items-center justify-center p-4 md:p-5 overflow-hidden">
                    <div className="relative w-full h-full transform transition-transform duration-500 ease-out drop-shadow-xl group-hover/card:scale-110">
                      <SafeImage
                        src={p.imageUrl || "/images/products/bookExample.jpg"}
                        alt={p.name}
                        fill
                        className="object-contain mix-blend-multiply md:p-0"
                        sizes="(max-width: 768px) 170px, 400px"
                      />
                    </div>
                  </div>

                  {/* بخش متن و دکمه */}
                  <div className="flex flex-col flex-1 p-3 md:p-4 z-10 justify-between">
                    <h3 className="text-slate-700 md:leading-relaxed line-clamp-2 min-h-[2.5rem] group-hover/card:text-green-700 transition-colors duration-300" title={p.name}>
                      {p.name}
                    </h3>





                    
                    <div className="mt-auto pt-3">
                      <button className="w-full h-9 md:h-10 rounded-xl bg-blue-50 text-slate-600 flex items-center justify-center gap-2 group-hover/card:bg-green-600 group-hover/card:text-white group-hover/card:shadow-md group-hover/card:shadow-green-200 transition-all duration-300">
                        مشاهده بانک سوالات
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

        <button
          ref={setNextBtn}
          className="absolute top-1/2 left-1 z-[50] -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-110 transition-all duration-300 xl:opacity-0 xl:group-hover:opacity-100 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <button
          ref={setPrevBtn}
          className="absolute top-1/2 right-1 z-[50] -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-110 transition-all duration-300 xl:opacity-0 xl:group-hover:opacity-100 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
}
