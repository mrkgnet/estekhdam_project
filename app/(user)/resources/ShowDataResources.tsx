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
    <div className="relative w-full h-full overflow-hidden rounded-xl ">
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
        className={`object-contain transition-all duration-300 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
            {products.map((p) => (
              <div key={p.id} className="group relative">
                <div
                  onClick={() => router.push(`/resources/course/${p.slug}`)}
                  className="bg-white border border-gray-300 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex sm:block cursor-pointer"
                >
                  {/* ✅ Image */}
                  <div className="relative w-32 sm:w-full aspect-[3/4] sm:aspect-[4/5] p-2">
                    <ProgressiveImage
                      src={p.imageUrl || "/images/products/bookExample.jpg"}
                      alt={p.name}
                    />
                  </div>

                  {/* ✅ Content */}
                  <div className="flex-1 flex flex-col justify-between p-3 sm:p-4">
                    <div>
                      {/* ✅ Add to cart (Desktop) */}
                      <div className="hidden md:flex items-center justify-center gap-3 mb-2">
                        <div className="flex-1 h-px bg-gray-200" />

                        {/* ✅ CART LINK */}
                        <Link
                          href={`/cart/${p.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-full border text-gray-600 hover:text-green-600 hover:border-green-400 hover:bg-green-50 transition"
                        >
                          <ShoppingBasket className="w-4 h-4" />
                        </Link>

                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      <h3 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-green-700 transition">
                        {p.name}
                      </h3>

                      <ul className="mt-2 space-y-1 text-xs text-gray-600">
                        {[
                          "پاسخ تشریحی",
                          "بروزرسانی مداوم",
                          "سوالات طبقه بندی شده",
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-blue-500 rounded-full" />
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
                    <div className="my-3 flex items-center justify-between">
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
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>
    </section>
  );
}
