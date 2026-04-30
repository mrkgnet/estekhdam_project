"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight, ClipboardList, BookOpen, FileCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import SafeImage from "@/components/ui/SafeImage";
import { fetchLatestProductAction } from "@/actions/user/latestProduct/Actions";
import { SliderSkeletonTopLeft } from "@/components/ui/SkeletonLoding/SliderSkeletonTopLeft";

interface ProductType {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string | null;
}

interface Props {
  title?: string;
  initialProducts: any; // داده اولیه دریافتی از سرور
  viewAllLink?: string;
  slug?: string;
}

export default function ShowDataSLTL({
  title = "آموزش‌های پرمخاطب",
  initialProducts,
  viewAllLink = "/resources",
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [prevBtn, setPrevBtn] = useState<HTMLButtonElement | null>(null);
  const [nextBtn, setNextBtn] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // استفاده از ریکت کوئری برای مدیریت کش و آپدیت داده‌ها
  const { data: response, isLoading } = useQuery({
    queryKey: ["latest-products"],
    queryFn: () => fetchLatestProductAction(),
    initialData: initialProducts, // داده اولیه برای SSR
    staleTime: 1000 * 60 * 5, // ۵ دقیقه اعتبار کش
  });

  const products: ProductType[] = response?.data || [];

  // نمایش اسکلتون تا زمان مانت شدن یا لودینگ اولیه
  if (!mounted || isLoading) {
    return <SliderSkeletonTopLeft />;
  }

  // اگر محصولی نبود، چیزی نشان نده
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full mx-auto relative px-2 h-full" dir="rtl">
      <style jsx global>{`
        .custom-swiper-progress {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: #e2e8f0;
          z-index: 20;
          border-radius: 4px 4px 0 0;
          overflow: hidden;
        }
        .custom-swiper-progress .swiper-pagination-progressbar-fill {
          background: linear-gradient(to left, #16a34a, #22c55e);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          transform-origin: right top;
          transition: transform 300ms ease;
        }
      `}</style>

      <div className="relative group h-full pt-2">
        <div className="custom-swiper-progress"></div>

        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          navigation={{ nextEl: nextBtn, prevEl: prevBtn }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ el: ".custom-swiper-progress", type: "progressbar" }}
          spaceBetween={10}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 2.8, spaceBetween: 12 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1280: { slidesPerView: 2, spaceBetween: 16 },
          }}
          className="py-2 animate-in fade-in duration-500 static mt-2 h-full"
          dir="rtl"
        >
          {products.map((p) => (
            <SwiperSlide key={p.id} className="w-full h-auto">
              <Link href={`/resources/course/${p.slug}`} className="block h-full">
                <div className="group/card flex flex-col h-full w-full border border-gray-300 rounded overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 bg-white">
                  <div className="relative w-full h-[130px] md:h-[150px] xl:h-[170px] flex-shrink-0 flex items-center justify-center p-4 md:p-5 overflow-hidden">
                    <div className="relative w-full h-full transform transition-transform duration-500 ease-out drop-shadow-xl">
                      <SafeImage
                        src={p.imageUrl || "/images/products/bookExample.jpg"}
                        alt={p.name}
                        fill
                        className="object-contain mix-blend-multiply"
                        sizes="(max-width: 768px) 170px, 400px"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-4 md:p-5 z-10 justify-between">
                    <h3 className="text-slate-800 font-semibold leading-relaxed line-clamp-2 min-h-[2.5rem] group-hover/card:text-emerald-600 transition-colors duration-200">
                      {p.name}
                    </h3>
                    <div className="mt-auto">
                      <ul className="space-y-2 text-[11px]">
                        <li className="flex items-center gap-2 text-slate-600">
                          <ClipboardList className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>سوالات طبقه‌بندی شده</span>
                        </li>
                        <li className="flex items-center gap-2 text-slate-600">
                          <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>فصل‌بندی استاندارد</span>
                        </li>
                        <li className="flex items-center gap-2 text-slate-600">
                          <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>پاسخ‌نامه تشریحی</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* دکمه‌های ناوبری */}
        <button
          ref={setNextBtn}
          className="absolute top-1/2 left-1 z-[50] -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-emerald-600 transition-all xl:opacity-0 xl:group-hover:opacity-100 disabled:hidden cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          ref={setPrevBtn}
          className="absolute top-1/2 right-1 z-[50] -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-slate-700 hover:text-emerald-600 transition-all xl:opacity-0 xl:group-hover:opacity-100 disabled:hidden cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
