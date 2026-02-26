"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

type SlideItem = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
};

const slides: SlideItem[] = Array.from({ length: 2 }).map((_, i) => ({
  id: i + 1,
  title: "دروازه‌ ناآمنی که استقلال را مجازات کرد؛ با آذان شروع شد، با حبیب تمام!",
  excerpt:
    "استقلال، حذفى زودهنگام از لیگ قهرمانان آسیا داشت و نمایش ضعیف ۲ دروازه‌بان این تیم در نتیجه حاصل شده مؤثر بود.",
  image: "/images/image.png",
}));

export default function MainSlider() {
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const el = swiper.el;

    const handleEnter = () => {
      // توقف قطعی حتی اگر وسط حرکت باشد
      swiper.autoplay?.stop();
      swiper.slideTo(swiper.activeIndex, 0);
    };

    const handleLeave = () => {
      swiper.autoplay?.start();
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      loop
      autoplay={{
        delay: 4500,
        disableOnInteraction: false,
      }}
      pagination={{ type: "progressbar" }}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      className="w-full h-full"
    >
      {slides.map((s) => (
        <SwiperSlide key={s.id} className="h-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 h-full">
            {/* متن (چپ در دسکتاپ) */}
            <div className="order-2 xl:order-1 p-6 space-y-4 flex flex-col justify-center">
              <h2 className=" font-extrabold leading-[1.6] text-slate-800">{s.title}</h2>
              <p className="text-slate-500 leading-8 text-base line-clamp-3">{s.excerpt}</p>
            </div>

            {/* تصویر (راست در دسکتاپ) - دقیقاً هم‌ارتفاع والد */}
            <div className="order-1 xl:order-2 relative h-full">
              <Image src={s.image} alt={s.title} fill className="object-cover" priority={s.id === 1} />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
