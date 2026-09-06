"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
import { useMainSlider } from "@/hooks/useMainSlider";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

type NewsStatus = "OPEN" | "CARD_RECEIVED" | "RESULTS_ANNOUNCED" | "NEWS";

type SliderDBItem = {
  id: string;
  imageUrl: string | null;
  title: string | null;
  description: string | null;
  organization?: string | null;
  slugNews: string | null;
  startAt: string | null;
  endAt: string | null;
  examAt: string | null;
  maxAge: number | null;
  status: NewsStatus | null;
  price?: string | number | null;
};

interface ShowMainSliderProps {
  initialSliders: {
    data?: SliderDBItem[];
  };
}

const STATUS_MAP: Record<NewsStatus, { label: string; className: string }> = {
  OPEN: { label: "ثبت‌نام", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CARD_RECEIVED: { label: "دریافت کارت", className: "bg-blue-50 text-blue-700 border-blue-200" },
  RESULTS_ANNOUNCED: { label: "اعلام نتایج", className: "bg-violet-50 text-violet-700 border-violet-200" },
  NEWS: { label: "در‌انتظار نتایج", className: "bg-amber-50 text-amber-700 border-amber-200" },
};

// توابع سازنده Shimmer Effect برای تصاویر
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

function toJalaliDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      calendar: "persian",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return null;
  }
}

function toPersianDigits(value: number): string {
  return value.toLocaleString("fa-IR");
}

function formatPrice(price: string | number): string {
  const num = typeof price === "number" ? price : parseInt(String(price).replace(/,/g, ""), 10);
  if (isNaN(num)) return `${price} تومان`;
  return num.toLocaleString("fa-IR") + " تومان";
}

function buildInfoRows(s: SliderDBItem): [string, string][] {
  const rows: [string, string][] = [];
  if (s.price) rows.push(["هزینه ثبت نام", formatPrice(s.price)]);
  const startJalali = toJalaliDate(s.startAt);
  if (startJalali) rows.push(["شروع ثبت‌نام", startJalali]);
  const endJalali = toJalaliDate(s.endAt);
  if (endJalali) rows.push(["پایان ثبت‌نام", endJalali]);
  const examJalali = toJalaliDate(s.examAt);
  if (examJalali) rows.push(["برگزاری آزمون", examJalali]);
  if (s.maxAge) rows.push(["شرط سنی", `حداکثر ${toPersianDigits(s.maxAge)} سال`]);
  return rows;
}

export default function ShowMainSlider({ initialSliders }: ShowMainSliderProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  // استفاده از هوک استاندارد با حافظه کش پایدار
  const { data: response } = useMainSlider(initialSliders);
  const sliders: SliderDBItem[] = response?.data || [];

  const onAutoplayTimeLeft = (_: any, __: number, progress: number) => {
    if (progressRef.current) {
      progressRef.current.style.width = `${(1 - progress) * 100}%`;
    }
  };

  if (sliders.length === 0) return null;

  return (
    <div className="w-full h-full flex flex-col relative group rounded shadow-sm border border-white/80">
      <style jsx global>{`
        .modern-slider .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background-color: #cbd5e1;
          border-radius: 20px;
          transition: all 0.4s ease;
          opacity: 0.6;
        }
        .modern-slider .swiper-pagination-bullet-active {
          width: 24px;
          background-color: #3b82f6;
          opacity: 1;
        }
        .modern-slider .swiper-button-next,
        .modern-slider .swiper-button-prev {
          width: 42px;
          height: 62px;
          backdrop-filter: blur(4px);
          border-radius: 10%;
          color: #2563eb;
          border: 1px solid gray;
          padding: 4px;
          transition: all 0.3s ease;
          opacity: 1;
          transform: scale(0.65);
        }
        .modern-slider:hover .swiper-button-next,
        .modern-slider:hover .swiper-button-prev {
          opacity: 1;
          transform: scale(0.65);
        }
        .modern-slider .swiper-button-next {
          left: 12px;
          right: auto;
        }
        .modern-slider .swiper-button-prev {
          right: 12px;
          left: auto;
        }
        @media (max-width: 768px) {
          .modern-slider .swiper-button-next,
          .modern-slider .swiper-button-prev {
            display: none;
          }
        }
      `}</style>

      <Swiper
        modules={[Pagination, Autoplay, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={sliders.length > 1}
        dir="rtl"
        autoplay={{ delay: 10000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
        navigation={true}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="w-full h-full modern-slider pb-6 md:pb-4"
      >
        <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-200/50 z-50">
          <div
            ref={progressRef}
            className="h-full bg-blue-600 w-0 transition-none md:transition-all md:duration-75 md:ease-linear"
          />
        </div>

        {sliders.map((s, index) => {
          const infoRows = buildInfoRows(s);
          const statusInfo = s.status ? STATUS_MAP[s.status] : null;
          const isFirstSlide = index === 0;

          return (
            <SwiperSlide key={s.id} className="h-full">
              <div className="flex h-full items-stretch gap-2 md:gap-6">
                
                {/* بخش مشخصات و جدول */}
                <div className="order-1 w-[60%] md:w-1/2 h-full flex-shrink-0 flex flex-col justify-center gap-1.5 md:gap-2 px-2 md:px-5">
                  <h2 className="text-15 md:text-lg font-bold text-center text-slate-800 tracking-tight break-words whitespace-normal">
                    {s.title}
                  </h2>

                  {(infoRows.length > 0 || statusInfo) && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-center text-[14px] md:text-sm">
                        <tbody>
                          {infoRows.map(([label, value]) => (
                            <tr key={label} className="leading-none md:leading-tight">
                              <th className="border border-slate-300 bg-slate-100 px-1.5 py-1 md:py-1.5 font-semibold text-slate-700 text-center whitespace-nowrap">
                                {label}
                              </th>
                              <td className="border border-slate-300 px-1.5 py-1 md:py-1.5 text-center font-semibold text-slate-800">
                                {value}
                              </td>
                            </tr>
                          ))}
                          {statusInfo && (
                            <tr className="leading-none md:leading-tight">
                              <th className="border border-slate-300 bg-slate-100 px-1.5 py-0.5 md:py-1 font-semibold text-slate-700 text-center whitespace-nowrap">
                                وضعیت
                              </th>
                              <td className="border border-slate-300 px-1.5 py-0.5 md:py-1 text-center">
                                <span
                                  className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[13px] md:text-xs font-bold border ${statusInfo.className}`}
                                >
                                  {statusInfo.label}
                                </span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* بخش تصویر */}
                <div className="order-2 w-[40%] md:w-1/2 h-full flex-shrink-0 flex items-center justify-center p-2">
                  <div className="relative w-full h-full rounded overflow-hidden border-slate-100 bg-white">
                    {s.imageUrl && (
                      <Image
                        src={s.imageUrl}
                        alt={s.title || "تصویر اسلایدر"}
                        fill
                        sizes="(max-width: 768px) 40vw, 50vw"
                        priority={isFirstSlide}
                        fetchPriority={isFirstSlide ? "high" : "auto"}
                        className="object-contain"
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                      />
                    )}
                  </div>
                </div>

              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
