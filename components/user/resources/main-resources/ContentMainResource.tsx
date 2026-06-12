"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GridSkeleton } from "@/components/ui/SkeletonLoding/GridSkeleton";
import { BookOpen, ShoppingBasket, CreditCard, Play } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import Pagination from "@/components/ui/Pagination";

const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+";

type Product = {
  id: string | number;
  name: string;
  slug: string;
  newPrice: number;
  imageUrl: string;
};

function ProgressiveImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
      <SafeImage
        src={src}
        alt={alt}
        fill
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoadingComplete={() => setLoaded(true)}
        className={`object-contain transition-all duration-300 ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      />
    </div>
  );
}

const FEATURES = ["پاسخ تشریحی", "بروزرسانی مداوم", "سوالات طبقه بندی شده"];
const toman = (n: number) => (n === 0 ? "رایگان" : `${n.toLocaleString("fa-IR")} تومان`);

function CartButton({ id }: { id: string | number }) {
  return (
    <Link
      href={`/cart/${id}`}
      onClick={(e) => e.stopPropagation()}
      className="p-2 rounded-full border text-gray-600 hover:text-green-600 hover:border-green-400 hover:bg-green-50 transition"
    >
      <ShoppingBasket className="w-4 h-4" />
    </Link>
  );
}

export default function ContentMainResource({
  loading,
  products,
  totalPages,
  currentPage,
}: {
  loading: boolean;
  products: Product[];
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();

  if (loading) return <GridSkeleton />;

  if (!products.length)
    return (
      <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 w-full h-full flex flex-col items-center justify-center">
        <BookOpen className="mb-4 text-gray-300 w-12 h-12" />
        <p className="text-gray-500 font-medium">محصولی یافت نشد</p>
      </div>
    );

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm md:text-base font-bold text-gray-800">لیست محصولات</h2>
      </div>

      <div className="grid gap-4 mt-2 justify-center md:[grid-template-columns:repeat(auto-fill,250px)]">
        {products.map((p) => (
          <div key={p.id} className="group relative md:w-[250px]">
            <div
              onClick={() => router.push(`/resources/course/${p.slug}`)}
              className="bg-white border border-gray-300 rounded overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 cursor-pointer md:w-[250px] flex flex-row md:flex-col h-full"
            >
              <div className="relative w-[110px] md:w-full md:h-[150px] flex-shrink-0 flex items-center justify-center md:p-2 overflow-hidden">
                <span className="absolute top-2 right-2 z-20 text-[10px] px-2 py-1 rounded-full bg-blue-600 text-white shadow">
                  آنلاین
                </span>
                <div className="relative w-full h-full">
                  <ProgressiveImage
                    src={p.imageUrl || "/images/products/bookExample.jpg"}
                    alt={p.name}
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1 p-2 md:p-5 z-10 justify-between">
                <div>
                  {/* دکمه سبد - فقط یک بار رندر میشه، با CSS مخفی/نمایش داده میشه */}
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="flex-1 h-px bg-gray-200" />
                    <CartButton id={p.id} /><div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <h3 className="text-slate-800 font-semibold leading-relaxed line-clamp-2 min-h-[1.5rem] group-hover:text-emerald-600 transition-colors duration-200">
                    {p.name}
                  </h3>

                  <ul className="mt-2 space-y-2 text-[11px] text-slate-600">
                    {FEATURES.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-red-600">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-bold">{toman(p.newPrice)}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                    <Play className="w-3.5 h-3.5" />
                    شروع سریع
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      )}
    </>
  );
}
