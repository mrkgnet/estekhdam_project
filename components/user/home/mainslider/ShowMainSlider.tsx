"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { fetchMainSliderUserAction } from "@/actions/user/mainslider/fetch/Actions";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import DotsLoader from "@/components/ui/Loading/DotsLoader";

type SliderDBItem = {
  id: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
  targetLink: string | null;
  endAt: string | null; 
  slugNews :string | null;
};

interface ShowMainSliderProps {
  initialSliders: any;
}

// 🕒 کامپوننت داخلی و بهینه برای محاسبه و نمایش دایره‌ای/باکسی تایمر معکوس (نسخه بهینه شده برای موبایل)
function CountdownTimer({ targetDate }: { targetDate: string | null }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft(); 
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex flex-col gap-0.5 md:gap-1 mt-1">
      <span className="text-[10px] md:text-[11px] font-medium text-amber-600">زمان باقی‌مانده جهت ثبت نام:</span>
      <div className="flex items-center gap-1 md:gap-1.5 w-fit bg-amber-50/60 border border-amber-200/50 p-1 md:p-1.5 rounded-lg md:rounded-xl" dir="ltr">
  
  
        
        {/* روز */}
        {timeLeft.days > 0 && (
          <>
            <span className="text-amber-400 font-bold animate-pulse text-[10px] md:text-xs">:</span>
            <div className="flex flex-col items-center min-w-[30px] md:min-w-[36px] bg-white px-1 md:px-1.5 py-0.5 rounded-md md:rounded-lg shadow-sm border border-slate-100">
              <span className="text-[10px] md:text-xs font-bold text-slate-800">{String(timeLeft.days).padStart(2, "0")}</span>
              <span className="text-[8px] md:text-[9px] text-slate-400 font-medium">روز</span>
            </div>
          </>
        )}

     {/* ساعت */}
        <div className="flex flex-col items-center min-w-[30px] md:min-w-[36px] bg-white px-1 md:px-1.5 py-0.5 rounded-md md:rounded-lg shadow-sm border border-slate-100">
          <span className="text-[10px] md:text-xs font-bold text-slate-800">{String(timeLeft.hours).padStart(2, "0")}</span>
          <span className="text-[8px] md:text-[9px] text-slate-400 font-medium">ساعت</span>
        </div>


  {/* دقیقه */}
        <div className="flex flex-col items-center min-w-[30px] md:min-w-[36px] bg-white px-1 md:px-1.5 py-0.5 rounded-md md:rounded-lg shadow-sm border border-slate-100">
          <span className="text-[10px] md:text-xs font-bold text-slate-800">{String(timeLeft.minutes).padStart(2, "0")}</span>
          <span className="text-[8px] md:text-[9px] text-slate-400 font-medium">دقیقه</span>
        </div>
        <span className="text-amber-400 font-bold animate-pulse text-[10px] md:text-xs">:</span>
       


              {/* ثانیه */}
        <div className="flex flex-col items-center min-w-[30px] md:min-w-[36px] bg-white px-1 md:px-1.5 py-0.5 rounded-md md:rounded-lg shadow-sm border border-slate-100">
          <span className="text-[10px] md:text-xs font-bold text-slate-800">{String(timeLeft.seconds).padStart(2, "0")}</span>
          <span className="text-[8px] md:text-[9px] text-slate-400 font-medium">ثانیه</span>
        </div>
        <span className="text-amber-400 font-bold animate-pulse text-[10px] md:text-xs">:</span>
      
      </div>
    </div>
  );
}

export default function ShowMainSlider({ initialSliders }: ShowMainSliderProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  // ✅ اصلاح بخش جلوگیری از پرش هیدریشن
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: response, isLoading } = useQuery({
    queryKey: ["main-slider"],
    queryFn: () => fetchMainSliderUserAction(),
    initialData: initialSliders,
    staleTime: 2000,
  });

  const sliders: SliderDBItem[] = response?.data || [];

  const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
    if (progressRef.current) {
      progressRef.current.style.width = `${(1 - progress) * 100}%`;
    }
  };

  // ✅ لودر قبل از mount
  if (!isMounted) return <DotsLoader />;

  // ✅ لودر هنگام لود
  if (isLoading && sliders.length === 0) return <DotsLoader />;

  if (!isLoading && sliders.length === 0) return null;

  return (
    <div className="contents">
      <div className="w-full h-full flex flex-col relative group rounded shadow-xl shadow-blue-900/5 border border-white/80 to-blue-50/40">

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
            border: 1px solid gray;
            padding: 5px;
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
            delay: 70000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="w-full h-[620px] md:h-[360px] flex-1 modern-slider pb-8 md:pb-4"
        >
          {/* نوار پیشرفت زمان اسلاید */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-200/50 z-50">
            <div
              ref={progressRef}
              className="h-full bg-blue-600 w-0 transition-none md:transition-all md:duration-75 md:ease-linear"
            ></div>
          </div>

          {sliders.map((s, index) => (
            <SwiperSlide key={s.id} className="h-full">
              <div className="flex h-full items-stretch gap-4 md:gap-8">

                {/* متن و توضیحات اسلاید */}
                <div className="order-1 w-full h-full flex flex-col justify-center gap-3 px-3 md:px-6 text-right">
                  
                  {/* بجت مدرن و جذاب "خبر فوری" */}
                  <div className="flex items-center gap-1.5 w-fit bg-red-50 text-red-600 border border-red-200/60 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide select-none">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    خبر فوری
                  </div>

                  {s.title && (
                    <h2 className="text-sm md:text-lg font-bold text-slate-800 tracking-tight mt-1">
                      {s.title}
                    </h2>
                  )}
                  
                  {/* 🕒 تایمر معکوس ریسپانسیو */}
                  <CountdownTimer targetDate={s.endAt} />

                  <Link
                    href={`/jobnews/government/${s.slugNews}` ?? "#"}
                    className="inline-flex items-center gap-2 w-fit rounded-md
                      px-4 py-2 text-11 sm:text-12 font-medium text-white bg-blue-600
                      hover:bg-blue-700 active:bg-blue-800 transition-colors
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-blue-400 focus-visible:ring-offset-2 mt-2"
                  >
                    مشاهده اطلاعات بیشتر
                  </Link>
                </div>

                {/* تصویر اسلاید */}
                <div className="order-2 w-full h-full flex items-center justify-center p-2 md:p-4">
                  <div className="relative w-full h-full rounded overflow-hidden border-slate-100 bg-white">
                    <Image
                      src={s.imageUrl}
                      alt={s.title || "تصویر اسلایدر"}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain duration-700 ease-out"
                      priority={index === 0}
                      fetchPriority={index === 0 ? "high" : "auto"}
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