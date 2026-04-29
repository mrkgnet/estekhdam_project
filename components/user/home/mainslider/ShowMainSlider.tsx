"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
// 🟢 تغییر: اضافه کردن Loader2 به ایمپورت‌ها
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

type SliderDBItem = {
  id: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
  targetLink: string | null;
};

interface ShowMainSliderProps {
  sliders: SliderDBItem[];
}

export default function ShowMainSlider({ sliders }: ShowMainSliderProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
    if (progressRef.current) {
      progressRef.current.style.width = `${(1 - progress) * 100}%`;
    }
  };

  if (!isMounted) {
    return (
      // 🟢 تغییر: جایگزینی اسکلتون سفید با همان اسپینر زیبایی که در Suspense داشتید
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px] gap-3 text-slate-400 bg-white rounded border border-slate-200">
        <Loader2 className="w-10 h-10 animate-spin text-[#2b5c9e]" />
        <span className="text-sm">در حال بارگذاری...</span>
      </div>
    );
  }

  if (!sliders || sliders.length === 0) {
    return null;
  }

  return (
    <div className="contents ">
      <div className="w-full h-full flex flex-col relative group  rounded shadow-xl shadow-blue-900/5 border border-white/80 bg-gradient-to-br from-slate-50 to-blue-50/40">

        <style jsx global>{`
        .modern-slider .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background-color: #cbd5e1;
          border-radius: 20px;
          transition: all 0.4s ease;
          opacity: 0.6;
        }
        .modern-slider .swiper-pagination-bullet-active {
          width: 32px;
          background-color: #3b82f6;
          opacity: 1;
        }

        .modern-slider .swiper-button-next,
        .modern-slider .swiper-button-prev {
          width: 44px;
          height: 44px;
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          border-radius: 10%;
          color: #2563eb;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
           height: 50px;
           opacity: 0;
          transform: scale(0.9);
        }

        .modern-slider .swiper-button-next::after,
        .modern-slider .swiper-button-prev::after {
          font-size: 10px;
          font-weight: 900;
        }

        .modern-slider:hover .swiper-button-next,
        .modern-slider:hover .swiper-button-prev {
          opacity: 1;
          transform: scale(1);
        }

        .modern-slider .swiper-button-next:hover,
        .modern-slider .swiper-button-prev:hover {
          background-color: #2563eb;
          color: #ffffff;
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
        }

        .modern-slider .swiper-button-next {
          left: 20px;
          right: auto;
        }
        .modern-slider .swiper-button-prev {
          right: 20px;
          left: auto;
        }
         .swiper-navigation-icon{
         width: 14px !important;
        
         } 

        @media (max-width: 768px) {
          .modern-slider .swiper-button-next,
          .modern-slider .swiper-button-prev {
            display: none;
          }
          .modern-slider .swiper-pagination-bullets {
            bottom: 10px !important;
          }
        }
      `}</style>

        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          dir="rtl"
          autoplay={{
            delay: 5000, // 🟢 اصلاح شد از 5000000 به 5000 (۵ ثانیه)
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: false,
          }}
          navigation={true}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="w-full h-full flex-1 modern-slider pb-8 md:pb-4"
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-200/50 z-50">
            <div
              ref={progressRef}
              className="h-full bg-blue-600 w-0 transition-none md:transition-all md:duration-75 md:ease-linear"
            ></div>
          </div>

          {sliders.map((s, index) => (
            <SwiperSlide key={s.id} className="h-full">
              <div className="flex flex-col lg:flex-row h-full text-xs md:text-sm gap-6 lg:gap-12 items-center justify-between p-4 md:p-8">

                <div className="order-2 lg:order-1 flex-1 w-full space-y-4 flex flex-col justify-center z-10 px-2 sm:px-4 lg:px-0 text-center lg:text-right">

                  <div className="inline-flex items-center justify-center lg:justify-start gap-1.5 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs w-fit mx-auto lg:mx-0 animate-pulse mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    خبر فوری
                  </div>

                  {s.title && (
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-[1.6] text-slate-800 tracking-tight">
                      {s.title}
                    </h2>
                  )}

                  {s.description && (
                    <p className="text-slate-600 leading-relaxed text-sm lg:text-base line-clamp-3 md:line-clamp-4 font-medium max-w-2xl mx-auto lg:mx-0">
                      {s.description}
                    </p>
                  )}

                  {s.targetLink && s.targetLink !== "#" && (
                    <div className="pt-2 pb-4 flex justify-center lg:justify-start">
                      <Link
                        href={s.targetLink}
                        className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 pb-2 rounded-xl bg-blue-600 text-white text-sm font-bold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 w-full sm:w-auto"
                      >
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                          <div className="relative h-full w-8 bg-white/20" />
                        </div>
                        مشاهده جزئیات بیشتر
                        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                      </Link>
                    </div>
                  )}
                </div>

                <div className="order-1 lg:order-2 relative shrink-0 w-full lg:w-1/2 max-w-[450px] flex items-center justify-center mx-auto lg:mx-0 mt-4 lg:mt-0">
                  <div className="absolute inset-0 bg-blue-400/20 blur-[60px] rounded-full scale-75 -z-10"></div>

                  <div className="relative w-full aspect-video rounded overflow-hidden shadow-lg border border-slate-100 bg-white">
                    <Image
                      src={s.imageUrl}
                      alt={s.title || "تصویر اسلایدر"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 450px"
                      className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                      priority={index === 0}
                    />
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
