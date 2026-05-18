"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProductDataAction } from "@/actions/user/productsCat/Actions";
import {
  BookOpen,
  CreditCard,
  Play,
  ShoppingBasket,
} from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import Pagination from "@/components/ui/Pagination";
import { GridSkeleton } from "@/components/ui/SkeletonLoding/GridSkeleton";
import FilterResource from "@/components/user/FilterResource";
import { useRouter } from "next/navigation";

/* ---------------------------------- */
/* ✅ Progressive Image */
/* ---------------------------------- */
const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+";

function ProgressiveImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
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

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */
type ProductType = {
  id: string | number;
  name: string;
  slug: string;
  oldPrice: number;
  newPrice: number;
  imageUrl: string;
};

interface Props {
  initialProducts: ProductType[];
  initialTotalCount: number;
  initialTotalPages: number;
  currentPage: number;
  searchQuery: string;
  categoryQuery: string;
  limit: number;
}

/* ---------------------------------- */
/* Utils */
/* ---------------------------------- */
const toman = (n: number) =>
  n === 0 ? "رایگان" : `${n.toLocaleString("fa-IR")} تومان`;

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */
export default function ShowDataResources({
  initialProducts,
  initialTotalCount,
  initialTotalPages,
  currentPage,
  searchQuery,
  categoryQuery,
  limit,
}: Props) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const router = useRouter();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["resources", currentPage, limit, searchQuery, categoryQuery],
    queryFn: async () => {
      const res = await fetchAllProductDataAction(
        currentPage,
        limit,
        searchQuery,
        categoryQuery
      );

      return res.success
        ? {
            products: res.data,
            totalCount: res.totalCount,
            totalPages: res.totalPages || 1,
          }
        : { products: [], totalCount: 0, totalPages: 1 };
    },
    initialData: {
      products: initialProducts,
      totalCount: initialTotalCount,
      totalPages: initialTotalPages,
    },
    staleTime: 1000 * 60 * 5,
  });

  const { products, totalCount, totalPages } = data!;
  const showSkeleton = isLoading && !products.length;

  return (
    <section dir="rtl" className="min-h-screen">
      <FilterResource
        currentCategory={currentCategory}
        totalCount={totalCount}
        isFetching={isFetching}
      />

      <div className="max-w-7xl mx-auto px-4">
        {showSkeleton ? (
          <GridSkeleton />
        ) : !products.length ? (
          <div className="py-20 text-center">
            <BookOpen className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">محصولی یافت نشد</p>
          </div>
        ) : (
          <div className="grid gap-4 mt-2 justify-center md:[grid-template-columns:repeat(auto-fill,250px)]">
            {products.map((p) => (
              <div key={p.id} className="group relative md:w-[250px]">
                <div
                  onClick={() => router.push(`/resources/course/${p.slug}`)}
                  className="bg-white border border-gray-300 rounded overflow-hidden hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 cursor-pointer md:w-[250px] flex flex-row md:flex-col"
                >
                  {/* ✅ Image */}
                  <div className="relative w-[110px] md:w-full md:h-[150px] flex-shrink-0 flex items-center justify-center md:p-2 overflow-hidden">
                       {/* ✅ Label */}
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

                  {/* ✅ Content */}
                  <div className="flex flex-col flex-1 p-2 md:p-5 z-10 justify-between">
                    <div>
                      {/* ✅ Add to cart (Desktop) */}
                      <div className="hidden md:flex items-center justify-center gap-3 mb-2">
                        <div className="flex-1 h-px bg-gray-200" />

                        <Link
                          href={`/cart/${p.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-full border text-gray-600 hover:text-green-600 hover:border-green-400 hover:bg-green-50 transition"
                        >
                          <ShoppingBasket className="w-4 h-4" />
                        </Link>

                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      <h3 className="text-slate-800 font-semibold leading-relaxed line-clamp-2 min-h-[1.5rem] group-hover:text-emerald-600 transition-colors duration-200">
                        {p.name}
                      </h3>

                      <ul className="mt-2 space-y-2 text-[11px] text-slate-600">
                        {[
                          "پاسخ تشریحی",
                          "بروزرسانی مداوم",
                          "سوالات طبقه بندی شده",
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* ✅ Add to cart (Mobile) */}
                    <div className="flex md:hidden items-center justify-center gap-3 my-2">
                      <div className="flex-1 h-px bg-gray-200" />
                      <Link
                        href={`/cart/${p.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-full border text-gray-600 hover:text-green-600 hover:border-green-400 hover:bg-green-50 transition"
                      >
                        <ShoppingBasket className="w-4 h-4" />
                      </Link>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* ✅ Price */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-red-600">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm font-bold">
                          {toman(p.newPrice)}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                        <Play className="w-3.5 h-3.5" />
                        شروع رایگان
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showSkeleton && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        )}
      </div>
    </section>
  );
}
