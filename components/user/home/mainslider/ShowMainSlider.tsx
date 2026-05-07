"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchMainSliderUserAction } from "@/actions/user/mainslider/fetch/Actions";

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
  initialSliders: any; // داده اولیه از سمت سرور
}

export default function ShowMainSlider({ initialSliders }: ShowMainSliderProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // استفاده از ریکت کوئری برای مدیریت کش اسلایدر
  const { data: response, isLoading } = useQuery({
    queryKey: ["main-slider"],
    queryFn: () => fetchMainSliderUserAction(),
    initialData: initialSliders,
    staleTime: 1000 * 60 * 30, // ۳۰ دقیقه اعتبار کش (چون اسلایدر دیر به دیر عوض می‌شود)
  });

  const sliders: SliderDBItem[] = response?.data || [];

  const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
    if (progressRef.current) {
      progressRef.current.style.width = `${(1 - progress) * 100}%`;
    }
  };

  // نمایش حالت بارگذاری تا زمان مانت شدن یا لودینگ اولیه ریکت کوئری
  if (!isMounted || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px] gap-3 text-slate-400 bg-white rounded border border-slate-200">
        <Loader2 className="w-10 h-10 animate-spin text-[#2b5c9e]" />
        <span className="text-sm">در حال بارگذاری اسلایدر...</span>
      </div>
    );
  }

  if (sliders.length === 0) return null;

  return (
    <div className="contents ">
      <div className="w-full h-full flex flex-col relative group rounded shadow-xl shadow-blue-900/5 border border-white/80 bg-gradient-to-br from-slate-50 to-blue-50/40">

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
            width: 36px;
            height: 36px;
           
            backdrop-filter: blur(4px);
            border-radius: 10%;
            color: #2563eb;
            border:1px solid gray;
            padding:5px;
            transition: all 0.3s ease;
            opacity: 1;
            transform: scale(0.7);
          }
          .modern-slider:hover .swiper-button-next,
          .modern-slider:hover .swiper-button-prev {
            opacity: 1;
            transform: scale(0.7);
          }
          .modern-slider .swiper-button-next { left: 20px; right: auto; }
          .modern-slider .swiper-button-prev { right: 20px; left: auto; }
          @media (max-width: 768px) {
            .modern-slider .swiper-button-next,
            .modern-slider .swiper-button-prev { display: none; }
          }
        `}</style>

        <Swiper
          modules={[Pagination, Autoplay, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={sliders.length > 1}
          dir="rtl"
          autoplay={{
            delay: 5000000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="w-full h-full flex-1 modern-slider pb-8 md:pb-4"
        >
          {/* نوار پیشرفت بالای اسلایدر */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-200/50 z-50">
            <div
              ref={progressRef}
              className="h-full bg-blue-600 w-0 transition-none md:transition-all md:duration-75 md:ease-linear"
            ></div>
          </div>

          {sliders.map((s, index) => (
            <SwiperSlide key={s.id} className="h-full">
              <div className="flex flex-col lg:flex-row h-full text-xs md:text-sm gap-6 lg:gap-12  justify-between  ">
                <div className="order-2 lg:order-1 flex-1 w-full space-y-4 flex flex-col justify-center  z-10 px-2 sm:px-4 lg:px-0  lg:text-right">
                  {s.title && (
                    <h2 className="text-xl text-center  font-bold  text-slate-800 tracking-tight">
                      {s.title}
                    </h2>
                  )}
                  <button>
                    مشاهده  اطلاعات بیشتر
                  </button>
               
                </div>

                <div className="order-1 lg:order-2 relative shrink-0 w-full lg:w-1/2 max-w-[450px] flex items-center justify-center mx-auto lg:mx-0 mt-4 lg:mt-0">
                  <div className="relative w-full aspect-video rounded overflow-hidden shadow-lg border border-slate-100 bg-white">
                    <Image
                      src={s.imageUrl}
                      alt={s.title || "تصویر اسلایدر"}
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
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
