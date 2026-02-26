"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";

type Item = { id: string; label: string };

const items: Item[] = [
  { id: "news", label: "استخدامی دولتی" },
  { id: "video", label: "استخدامی خصوصی" },
  
];

export default function CategoryChipsSwiper() {
  const [active, setActive] = useState("news");
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 px-3 py-2 flex items-center gap-2">
      {/* فلش راست */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slidePrev()}
        className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition shrink-0"
        aria-label="بعدی"
      >
        <ChevronRight className="w-5 h-5 text-slate-600" />
      </button>

      {/* چیپ‌ها */}
      <div className="flex-1 min-w-0">
        <Swiper
          modules={[FreeMode]}
          freeMode
          slidesPerView="auto"
          spaceBetween={10}
          onSwiper={(s) => (swiperRef.current = s)}
          className="w-full"
        >
          {items.map((it) => {
            const isActive = it.id === active;
            return (
              <SwiperSlide key={it.id} className="!w-auto">
                <button
                  type="button"
                  onClick={() => setActive(it.id)}
                  className={[
                    "px-5 h-10 rounded-full border text-sm  transition",
                    isActive
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {it.label}
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* فلش چپ */}
      <button
        type="button"
        onClick={() => swiperRef.current?.slideNext()}
        className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition shrink-0"
        aria-label="قبلی"
      >
        <ChevronLeft className="w-5 h-5 text-slate-600" />
      </button>
    </div>
  );
}
