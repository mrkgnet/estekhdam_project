"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

type Product = {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  image: string;
  href: string;
};

const products: Product[] = [
  {
    id: 1,
    title: "پکیج کامل آزمون استخدامی آموزش و پرورش (PDF + نکته و تست)",
    price: 289000,
    oldPrice: 349000,
    rating: 4.7,
    image: "/images/products/bookExample.jpg",
    href: "/products/1",
  },
  {
    id: 2,
    title: "نمونه سوالات دستگاه‌های اجرایی با پاسخ تشریحی",
    price: 199000,
    oldPrice: 249000,
    rating: 4.5,
    image: "/images/products/bookExample.jpg",
    href: "/products/2",
  },
  {
    id: 3,
    title: "جزوه جمع‌بندی حیطه عمومی + آزمون‌های طبقه‌بندی شده",
    price: 149000,
    oldPrice: 179000,
    rating: 4.6,
    image: "/images/products/bookExample.jpg",
    href: "/products/3",
  },
  {
    id: 4,
    title: "پکیج استخدامی بانک‌ها (مصاحبه + تست‌های پرتکرار)",
    price: 239000,
    oldPrice: 299000,
    rating: 4.4,
    image: "/images/products/bookExample.jpg",
    href: "/products/4",
  },
  {
    id: 5,
    title: "سوالات وزارت بهداشت + درسنامه خلاصه",
    price: 219000,
    oldPrice: 269000,
    rating: 4.8,
    image: "/images/products/bookExample.jpg",
    href: "/products/5",
  },
  {
    id: 6,
    title: "پکیج ویژه استخدام بخش خصوصی (رزومه + آمادگی مصاحبه)",
    price: 179000,
    oldPrice: 229000,
    rating: 4.3,
    image: "/images/bookExample.jpg",
    href: "/products/6",
  },
];

const toman = (n: number) => `${n.toLocaleString("fa-IR")} تومان`;

export default function LatestProducts() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-slate-800"> محصولات استخدامی بانک ها</h2>

        <Link href="/products" className="text-sm text-green-600 hover:text-green-700 font-semibold transition">
          مشاهده همه
        </Link>
      </div>

      {/* Slider */}
      <div className="mt-5">
        <Swiper
          modules={[FreeMode, Pagination]}
          freeMode
          pagination={{ clickable: true }}
          spaceBetween={16}
          slidesPerView="auto"
          className="w-full"
        >
          {products.map((p) => (
            <SwiperSlide key={p.id} className="!w-[240px] pb-10">
              <Link
                href={p.href}
                className="group block w-[240px] rounded-2xl border border-slate-100 bg-white overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                {/* Image */}
                <div className="relative w-[240px] aspect-[3/4] bg-slate-50 overflow-hidden">
                  <Image src={p.image} alt={p.title} fill className="object-contain p-4" sizes="240px" />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* rating */}
                  {typeof p.rating === "number" && (
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4" fill="currentColor" />
                      <span className="text-xs font-bold">{p.rating.toLocaleString("fa-IR")}</span>
                    </div>
                  )}

                  <h3 className="text-sm font-semibold text-slate-800 leading-6 line-clamp-2">{p.title}</h3>

                  {/* Price */}
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-green-600 font-extrabold text-sm">{toman(p.price)}</div>

                      {p.oldPrice && p.oldPrice > p.price && (
                        <div className="text-xs text-slate-400 line-through mt-1">{toman(p.oldPrice)}</div>
                      )}
                    </div>

                    {/* CTA */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // چون کل کارت لینک است
                        e.stopPropagation();
                        // اینجا بعداً addToCart رو صدا می‌زنی
                      }}
                      className="h-9 px-3 rounded-xl bg-green-500 text-white text-xs font-semibold
                                 flex items-center gap-2 hover:bg-green-600 transition"
                    >
                      <ShoppingCart size={16} />
                      افزودن
                    </button>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
