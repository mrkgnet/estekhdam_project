"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

/* ---------------------------------- */
/* ✅ Data (Static – بهترین حالت) */
/* ---------------------------------- */

const BANKS_DATA = [
  { id: 1, name: "بانک ملی", logo: "/images/topSlider/بانک_ملی.png", href: "/" },
  { id: 2, name: "بانک ملت", logo: "/images/topSlider/بانک_ملت.png", href: "/" },
  { id: 3, name: "بانک صادرات", logo: "/images/topSlider/بانک_صادرات.png", href: "/" },
  { id: 4, name: "وزارت ارتباطات", logo: "/images/topSlider/وزارت_ارتباطات.png", href: "/" },
  { id: 5, name: "بانک سپه", logo: "/images/topSlider/بانک_سپه.png" , href: "/"},
  { id: 6, name: "آموزش و پرورش", logo: "/images/topSlider/آموزش و پرورش.jpg", href: "/" },
  { id: 7, name: "وزارت بهداشت", logo: "/images/topSlider/وزارت_بهداشت.jpg", href: "/" },
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

/* ---------------------------------- */
/* ✅ Blur Placeholder */
/* ---------------------------------- */

const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+";

/* ---------------------------------- */
/* ✅ Skeleton */
/* ---------------------------------- */

function BrandSliderSkeleton() {
  return (
    <div className="flex gap-4 px-2 py-4 animate-pulse">
      {Array.from({ length: 13 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 sm:w-[76px] sm:h-[76px] md:w-[84px] md:h-[84px] rounded-full bg-slate-200" />
          <div className="w-14 h-3 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------- */
/* ✅ Main Component */
/* ---------------------------------- */

export default function BrandTopSlider({ title }: { title?: string }) {
  const [swiperReady, setSwiperReady] = useState(false);

  return (
    <div className="relative py-4 overflow-hidden rounded">
      {title && (
        <div className="flex items-center gap-2.5 mb-6 px-2">
          <div className="w-1.5 h-5 bg-green-500 rounded-full" />
          <h2 className="font-bold text-slate-800">{title}</h2>
        </div>
      )}

      {/* ✅ Skeleton */}
      {!swiperReady && <BrandSliderSkeleton />}

      {/* ✅ Swiper */}
      <div
        className={`transition-opacity duration-300 ${
          swiperReady ? "opacity-100" : "opacity-0 absolute inset-0"
        }`}
      >
        <Swiper
          modules={[Autoplay]}
          loop
          speed={3500}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          dir="rtl"
          onInit={() => setSwiperReady(true)}
          breakpoints={{
            0: { slidesPerView: 3.5, spaceBetween: 12 },
            480: { slidesPerView: 4.5, spaceBetween: 16 },
            768: { slidesPerView: 6.5, spaceBetween: 16 },
            1024: { slidesPerView: 9.5, spaceBetween: 24 },
          }}
          className="brand-swiper w-full px-2 py-4"
        >
          {BANKS_DATA.map((bank, index) => (
            <SwiperSlide key={bank.id}>
              <BrandItem bank={bank} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* ✅ Item */
/* ---------------------------------- */

function BrandItem({
  bank,
  index,
}: {
  bank: { name: string; logo: string; href: string };
  index: number;
}) {
  return (
    <Link
      href={bank.href}
      className="group flex flex-col items-center gap-3 w-full h-full outline-none"
      title={bank.name}
    >
      <div
        className="relative w-16 h-16 sm:w-[76px] sm:h-[76px] md:w-[84px] md:h-[84px]
        flex items-center justify-center p-3 rounded-full bg-white shadow-sm border border-slate-100/80
        group-hover:border-green-100 group-hover:shadow-[0_8px_20px_-6px_rgba(22,163,74,0.3)]
        group-hover:ring-4 group-hover:ring-green-50 group-hover:-translate-y-1.5
        transition-all duration-300 ease-out"
      >
        <Image
          src={bank.logo}
          alt={`منابع آزمون استخدامی ${bank.name}`}
          fill
          sizes="(max-width: 480px) 64px, (max-width: 768px) 76px, 84px"
          placeholder="blur"
          blurDataURL={blurDataURL}
          priority={index < 5}
          className="object-contain p-3.5 mix-blend-multiply"
        />
      </div>

      <span className="font-medium text-slate-600 group-hover:text-green-700 transition-colors text-center line-clamp-1 w-full px-1 text-xs sm:text-sm">
        {bank.name}
      </span>
    </Link>
  );
}
