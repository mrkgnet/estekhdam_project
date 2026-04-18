"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; 

// اطمینان حاصل کنید این مسیر درست است
import { ROUTES } from "@/lib/constats";

const toman = (n: number) => `${n?.toLocaleString("fa-IR")} تومان`;

// تعریف تایپ تقریبی بر اساس کدهای شما (در صورت نیاز تکمیل کنید)
type ProductType = {
  id: string;
  name: string;
  slug: string;
  oldPrice?: number;
  newPrice: number;
  imageUrl?: string | null;
};

interface LatestProductProps {
  title: string;
  products: ProductType[];
  slug: string;
}

export default function ShowDataBankProduct({ title, products, slug }: LatestProductProps) {
  return (
    <div className="bg-white text-xs md:text-sm relative rounded-2xl p-4 shadow-sm border border-slate-100">
      <style jsx global>{`
        .swiper-button-prev,
        .swiper-button-next {
          background-color: white;
          width: 30px;
          color: #15803d; 
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          transition: all 0.2s;
          border-radius: 6px;
          border: 1px solid #15803d;
          height: 30px;
        }
        .swiper-button-next > svg,
        .swiper-button-prev > svg {
          width: 10px !important;
        }
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background-color: #f0fdf4; 
          transform: scale(1.05);
        }
        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 14px !important;
          font-weight: 900;
        }
        .swiper-pagination-bullet-active {
          background-color: #15803d !important;
        }
        .swiper-pagination-fraction, .swiper-pagination-custom, .swiper-horizontal > .swiper-pagination-bullets, .swiper-pagination-bullets.swiper-pagination-horizontal {
            bottom: 0px !important; 
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <h2 className="text-base text-slate-800"> {title}</h2>
        <Link 
          href={`/resources`} 
          className="text-green-600 text-base hover:text-green-700 transition flex items-center gap-1"
        >
          مشاهده همه <span className="text-lg mr-1">←</span>
        </Link>
      </div>

      {/* Slider */}
      <Swiper
        modules={[FreeMode, Pagination, Navigation]}
        freeMode
        dir="rtl"
        navigation={true}
        pagination={{ 
            clickable: true, 
            dynamicBullets: true 
        }}
        spaceBetween={20}
        slidesPerView="auto"
        className="w-full !pb-14 px-1"
      >
        {products.map((p) => (
          <SwiperSlide key={p.id} className="!w-[240px]">
            <div className="group block w-[240px] rounded-2xl border border-slate-100 bg-white overflow-hidden hover:shadow-xl transition-all duration-300">
              
              {/* Image */}
              <div className="relative w-full aspect-[3/4] bg-slate-50 overflow-hidden flex items-center justify-center">
                <Image 
                  // اگر محصول عکس نداشت از عکس پیش‌فرض استفاده می‌شود
                  src={p.imageUrl || "/images/products/bookExample.jpg"} 
                  alt={p.name} 
                  fill 
                  className="object-contain p-4 group-hover:scale-105 transition-transform" 
                  sizes="240px" 
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className=" text-slate-800 leading-6 line-clamp-2 " title={p.name}>
                  {p.name}
                </h3>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50 ">
                   <div className="flex flex-col">
                      {p.oldPrice && p.oldPrice > p.newPrice && (
                        <span className=" text-slate-400 line-through">
                          {toman(p.oldPrice)}
                        </span>
                      )}
                      <span className="text-green-700 ">
                        {p.newPrice ? toman(p.newPrice) : "رایگان"}
                      </span>
                   </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href={`/resources/${p.slug}/learn`}
                    className="h-8 rounded-lg border border-slate-200 text-slate-700  flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    آموزش
                  </Link>
                  <Link
                    href={ROUTES.USER.RESOURCES.COURSE(p.id)}
                    className="h-8 rounded-lg bg-green-700 text-white  flex items-center justify-center hover:bg-green-600 transition-colors"
                  >
                    آزمون
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
