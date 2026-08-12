"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import { fetchMainSliderUserAction } from "@/actions/user/mainslider/fetch/Actions";

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
  organization: string | null;
  slugNews: string | null;
  startAt: string | null;
  endAt: string | null;
  examAt: string | null;
  maxAge: number | null;
  status: NewsStatus | null;
  price?: string | number | null;
};

interface ShowMainSliderProps {
  initialSliders: any;
}

const STATUS_MAP: Record<NewsStatus, { label: string; className: string }> = {
  OPEN: { label: "ثبت‌نام", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CARD_RECEIVED: { label: "دریافت کارت", className: "bg-blue-50 text-blue-700 border-blue-200" },
  RESULTS_ANNOUNCED: { label: "اعلام نتایج", className: "bg-violet-50 text-violet-700 border-violet-200" },
  NEWS: { label: "در‌انتظار نتایج", className: "bg-amber-50 text-amber-700 border-amber-200" },
};

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

/* ---------------------------------- */
/* ✅ کامپوننت تصویر اسلایدر با اسکلتون شیمر */
/* ---------------------------------- */
function SliderImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* ✅ اسکلتون شیمر تا لود کامل تصویر + آیکون ImageIcon */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 skeleton-shimmer flex items-center justify-center">
          <ImageIcon
            className="w-16 h-16 text-slate-400 opacity-50"
            strokeWidth={1.25}
          />
        </div>
      )}

      {/* ✅ در صورت خطا، آیکون پیش‌فرض با پس‌زمینه */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
          <ImageIcon
            className="w-16 h-16 text-slate-300"
            strokeWidth={1.25}
          />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 40vw, 50vw"
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        className={`object-contain duration-700 ease-out ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

// تعداد ردیف‌های جدول که در اسلایدر واقعی نمایش داده می‌شه (max 6: 5 اطلاعات + وضعیت)
const SKELETON_ROW_COUNT = 5;

function SliderSkeleton() {
  return (
    <div className="w-full h-full flex flex-col relative group rounded shadow-xl shadow-blue-900/5 border border-white/80 to-blue-50/40">
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-wave {
          background: linear-gradient(
            90deg,
            #e2e8f0 0%,
            #f1f5f9 40%,
            #f8fafc 50%,
            #f1f5f9 60%,
            #e2e8f0 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s infinite linear;
        }
      `}</style>

      {/* progress bar placeholder */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-200/50 z-50" />

      <div className="w-full h-[620px] md:h-[360px] flex-1 pb-8 md:pb-4">
        <div className="flex h-full items-stretch gap-2 md:gap-8">

          {/* بخش متن — دقیقاً همان ابعاد و padding اسلاید واقعی */}
          <div className="order-1 w-[60%] md:w-1/2 h-full flex-shrink-0 flex flex-col justify-center gap-2 md:gap-3 px-2 md:px-6 text-right">
            {/* عنوان — h2 با text-base/lg و line-clamp-2 */}
            <div className="h-[1.5rem] md:h-[1.75rem] w-3/4 skeleton-wave rounded mt-1" />

            {/* جدول — overflow-x-auto wrapper */}
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse text-[12px] md:text-sm">
                <tbody>
                  {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
                    <tr key={i} className="leading-tight md:leading-normal">
                      <th className="border border-slate-200 bg-slate-100 px-1.5 md:px-2 py-0.5 md:py-1.5 whitespace-nowrap">
                        <div className="h-[1rem] md:h-[1.25rem] w-20 md:w-28 skeleton-wave rounded" />
                      </th>
                      <td className="border border-slate-200 px-1.5 md:px-2 py-0.5 md:py-1.5">
                        <div className="h-[1rem] md:h-[1.25rem] w-full skeleton-wave rounded" />
                      </td>
                    </tr>
                  ))}
                  {/* ردیف وضعیت */}
                  <tr className="leading-tight md:leading-normal">
                    <th className="border border-slate-200 bg-slate-100 px-1.5 md:px-2 py-0.5 md:py-1.5 whitespace-nowrap">
                      <div className="h-[1rem] md:h-[1.25rem] w-12 md:w-16 skeleton-wave rounded" />
                    </th>
                    <td className="border border-slate-200 px-1.5 md:px-2 py-0.5 md:py-1.5">
                      <div className="h-[1.25rem] md:h-[1.5rem] w-20 md:w-24 skeleton-wave rounded-full" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* بخش تصویر — دقیقاً همان ابعاد و padding اسلاید واقعی */}
          <div className="order-2 px-8 w-[40%] md:w-1/2 h-full flex-shrink-0 flex items-center justify-center p-1 md:p-4">
            <div className="relative px-8 w-full h-full rounded overflow-hidden border-slate-100 bg-white">
              <div className="w-full px-8 h-full skeleton-wave" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ShowMainSlider({ initialSliders }: ShowMainSliderProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const { data: response, isLoading } = useQuery({
    queryKey: ["main-slider"],
    queryFn: () => fetchMainSliderUserAction(),
    initialData: initialSliders,
    staleTime: 0,
    refetchInterval: 30_000,
  });

  const sliders: SliderDBItem[] = response?.data || [];

  const onAutoplayTimeLeft = (_: any, __: number, progress: number) => {
    if (progressRef.current) {
      progressRef.current.style.width = `${(1 - progress) * 100}%`;
    }
  };

  if (!isMounted) return <SliderSkeleton />;
  if (isLoading && sliders.length === 0) return <SliderSkeleton />;
  if (!isLoading && sliders.length === 0) return null;

  return (
    <div className="contents">
      <div className="w-full h-full flex flex-col relative group rounded shadow-xl shadow-blue-900/5 border border-white/80 to-blue-50/40">
        {/* ✅ استایل شیمر برای اسکلتون تصاویر + استایل‌های قبلی slider */}
        <style jsx global>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .skeleton-shimmer {
            background: linear-gradient(
              90deg,
              #e2e8f0 0%,
              #f1f5f9 40%,
              #f8fafc 50%,
              #f1f5f9 60%,
              #e2e8f0 100%
            );
            background-size: 200% 100%;
            animation: shimmer 1.8s infinite linear;
          }

          .modern-slider .swiper-pagination-bullet {
            width: 8px; height: 8px;
            background-color: #cbd5e1; border-radius: 20px;
            transition: all 0.4s ease; opacity: 0.6;
          }
          .modern-slider .swiper-pagination-bullet-active {
            width: 32px; background-color: #3b82f6; opacity: 1;
          }
          .modern-slider .swiper-button-next,
          .modern-slider .swiper-button-prev {
            width: 36px; height: 36px; backdrop-filter: blur(4px);
            border-radius: 10%; color: #2563eb; border: 1px solid gray;
            padding: 5px; transition: all 0.3s ease; opacity: 1; transform: scale(0.7);
          }
          .modern-slider:hover .swiper-button-next,
          .modern-slider:hover .swiper-button-prev { opacity: 1; transform: scale(0.7); }
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
          autoplay={{ delay: 10000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          navigation={true}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="w-full h-[620px] md:h-[360px] flex-1 modern-slider pb-8 md:pb-4"
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-200/50 z-50">
            <div ref={progressRef} className="h-full bg-blue-600 w-0 transition-none md:transition-all md:duration-75 md:ease-linear" />
          </div>

          {sliders.map((s, index) => {
            const infoRows = buildInfoRows(s);
            const statusInfo = s.status ? STATUS_MAP[s.status] : null;

            return (
              <SwiperSlide key={s.id} className="h-full">
                <div className="flex h-full items-stretch gap-2 md:gap-8">
                  <div className="order-1 w-[60%] md:w-1/2 h-full flex-shrink-0 flex flex-col justify-center gap-2 md:gap-3 px-2 md:px-6 text-right">
                    {s.title && (
                      <h2 className="text-base md:text-lg font-bold text-slate-800 tracking-tight mt-1 line-clamp-2 md:line-clamp-none">
                        {s.title}
                      </h2>
                    )}

                    {(infoRows.length > 0 || statusInfo) && (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-[12px] md:text-sm">
                          <tbody>
                            {infoRows.map(([label, value]) => (
                              <tr key={label} className="leading-tight md:leading-normal">
                                <th className="border border-slate-200 bg-slate-100 px-1.5 md:px-2 py-0.5 md:py-1.5 font-bold text-slate-800 whitespace-nowrap text-[13px] md:text-sm">
                                  {label}
                                </th>
                                <td className="border border-slate-200 px-1.5 md:px-2 py-0.5 md:py-1.5 text-right font-bold text-slate-800 text-[13px] md:text-sm">
                                  {value}
                                </td>
                              </tr>
                            ))}
                            {statusInfo && (
                              <tr className="leading-tight md:leading-normal">
                                <th className="border border-slate-200 bg-slate-100 px-1.5 md:px-2 py-0.5 md:py-1.5 font-bold text-slate-800 whitespace-nowrap text-[13px] md:text-sm">
                                  وضعیت
                                </th>
                                <td className="border border-slate-200 px-1.5 md:px-2 py-0.5 md:py-1.5 text-right">
                                  <span className={`inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-full text-[12px] md:text-sm font-bold border ${statusInfo.className}`}>
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

                  {/* ✅ بخش تصویر با اسکلتون شیمر */}
                  <div className="order-2 w-[40%] md:w-1/2 h-full flex-shrink-0 flex items-center justify-center p-1 md:p-4">
                    <div className="relative w-full h-full rounded overflow-hidden border-slate-100 bg-white">
                      {s.imageUrl && (
                        <SliderImage
                          src={s.imageUrl}
                          alt={s.title || "تصویر اسلایدر"}
                          priority={index === 0}
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
    </div>
  );
}