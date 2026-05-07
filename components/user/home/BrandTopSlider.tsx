"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import { BrandSliderSkeleton } from "@/components/ui/SkeletonLoding/BrandSliderSkeleton";

const BANKS_DATA = [
  { id: 1, name: "بانک ملی", logo: "/images/topSlider/بانک_ملی.png", href: "/" },
  { id: 2, name: "بانک ملت", logo: "/images/topSlider/بانک_ملت.png", href: "/" },
  { id: 3, name: "بانک صادرات", logo: "/images/topSlider/بانک_صادرات.png", href: "/" },
  { id: 4, name: "وزارت ارتباطات", logo: "/images/topSlider/وزارت_ارتباطات.png", href: "/" },
  { id: 5, name: "بانک سپه", logo: "/images/topSlider/بانک_سپه.png", href: "/banks/sepah" },
  { id: 6, name: "آموزش و پرورش", logo: "/images/topSlider/آموزش و پرورش.jpg", href: "/" },
  { id: 7, name: "وزارت بهداشت ", logo: "/images/topSlider/وزارت_بهداشت.jpg", href: "/" },
  { id: 8, name: "بانک اقتصاد نوین", logo: "/images/topSlider/بانک_اقتصاد_نوین.png", href: "/" },
  { id: 9, name: "بانک پارسیان", logo: "/images/topSlider/بانک_پارسیان.png", href: "/" },
  { id: 10, name: "وزارت دفاع", logo: "/images/topSlider/وزارت_دفاع.png", href: "/" },
  { id: 11, name: "سازمان امور مالیاتی", logo: "/images/topSlider/سازمان_امور_مالیاتی.jpg", href: "/" },
  { id: 12, name: "دانشگاه فرهنگیان", logo: "/images/topSlider/دانشگاه_فرهنگیان.png", href: "/" },
  { id: 13, name: "سازمان فنی حرفه ایی", logo: "/images/topSlider/سازمان_آموزش_فنی_حرفه_ایی.png", href: "/" },
  { id: 14, name: "بانک دی", logo: "/images/topSlider/بانک_دی.png", href: "/" },
  { id: 15, name: "بانک رفاه", logo: "/images/topSlider/بانک_رفاه.png", href: "/" },
  { id: 16, name: "وزارت دادگستری", logo: "/images/topSlider/وزارت_دادگستری.png", href: "/" },
];



export default function BrandTopSlider({ title }: { title?: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSwiperReady, setIsSwiperReady] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const showSkeleton = !isMounted || !isSwiperReady;

  return (
    <div className=" relative py-4 group/slider overflow-hidden rounded">
      <style jsx>{`
        :global(.brand-swiper .swiper-wrapper) {
          transition-timing-function: linear !important;
        }
      `}</style>

      {/* Skeleton Overlay */}
      {showSkeleton && (
        <div className="absolute inset-0 z-20 bg-white">
          <BrandSliderSkeleton title={title} />
        </div>
      )}

      {/* Real Slider */}
      <div className={`transition-opacity duration-300 ${showSkeleton ? "opacity-0" : "opacity-100"}`}>
        {title && (
          <div className="flex items-center gap-2.5 mb-6 px-2">
            <div className="w-1.5 h-5 bg-green-500 rounded-full" aria-hidden="true"></div>
            <h2 className="font-bold text-slate-800 tracking-tight">{title}</h2>
          </div>
        )}

        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block"></div>

        <Swiper
          modules={[Autoplay]}
          onInit={() => setIsSwiperReady(true)}
          loop={true}
          speed={3500}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          dir="rtl"
          breakpoints={{
            0: { slidesPerView: 3.5, spaceBetween: 12 },
            480: { slidesPerView: 4.5, spaceBetween: 16 },
            768: { slidesPerView: 6.5, spaceBetween: 16 },
            1024: { slidesPerView: 9.5, spaceBetween: 24 },
          }}
          className="brand-swiper w-full px-2 py-4"
        >
          {BANKS_DATA.map((bank) => (
            <SwiperSlide key={bank.id} className="pt-2">
              <Link
                href={bank.href}
                className="group flex flex-col items-center justify-start gap-3 w-full h-full outline-none"
                title={bank.name}
              >
                <div className="w-16 h-16 sm:w-[76px] sm:h-[76px] md:w-[84px] md:h-[84px] flex items-center justify-center p-3 relative rounded-full bg-white shadow-sm border border-slate-100/80 group-hover:border-green-100 group-hover:shadow-[0_8px_20px_-6px_rgba(22,163,74,0.3)] group-hover:ring-4 group-hover:ring-green-50 group-hover:-translate-y-1.5 transition-all duration-300 ease-out">
                  <Image
                    src={bank.logo}
                    alt={`منابع آزمون استخدامی ${bank.name}`}
                    fill
                    className="object-contain p-3.5 group-hover:scale-110 transition-transform duration-300 ease-out mix-blend-multiply"
                    sizes="(max-width: 480px) 64px, (max-width: 768px) 76px, 84px"
                    priority
                  />
                </div>

                <span className="font-medium text-slate-600 group-hover:text-green-700 transition-colors text-center line-clamp-1 w-full px-1">
                  {bank.name}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
