"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, X } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import type { Category, Product } from "@/types/free-resource";

interface Props {
  products: Product[];
  activeCategoryObjects: Category[];
  isPending: boolean;
  onToggleFilter: (slug: string) => void;
  onClearFilters: () => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    itemsPerPage: number;
  };
}

export default function ContentFreeResource({
  products,
  activeCategoryObjects,
  isPending,
  onToggleFilter,
  onClearFilters,
  pagination,
}: Props) {
  return (
    <main className="flex-1 flex flex-col relative min-h-[400px]">
      {activeCategoryObjects.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4 bg-white p-2.5 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-500 ml-2">فیلترهای فعال:</span>
          {activeCategoryObjects.map((cat) => (
            <span
              key={cat.id}
              className="flex items-center gap-1 px-2 py-1 bg-blue-50/80 text-blue-700 rounded-lg text-[11px] font-semibold border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              {cat.catName}
              <button
                onClick={() => onToggleFilter(cat.catSlug)}
                disabled={isPending}
                className="text-blue-400 hover:text-red-500 cursor-pointer disabled:opacity-50 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {isPending && (
        <div className="absolute inset-0 z-10 bg-gray-50/40 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
          <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-lg border border-gray-100">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-xs font-bold text-gray-700">در حال بروزرسانی لیست...</span>
          </div>
        </div>
      )}

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 content-start flex-1">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/resources/course/${product.slug}?price=free`}
                target="_blank"
                className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-300 group flex flex-col cursor-pointer"
              >
                <div className="relative w-full h-40 bg-gray-50/50 flex items-center justify-center border-b border-gray-100 overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-2.5 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <FileText className="w-8 h-8 text-gray-300" />
                  )}
                </div>

                <div className="p-2.5 flex flex-col flex-1">
                  <div className="mb-1.5 flex flex-wrap gap-1">
                    {product.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat.id}
                        className="text-[9px] font-bold text-gray-500 bg-gray-100/80 px-1.5 py-0.5 rounded"
                      >
                        {cat.catName}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-[11px] font-bold text-gray-800 mb-2 line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-medium text-gray-400">تعداد دانلود</span>
                      <span className="text-[11px] font-bold text-gray-800 mt-0.5">
                        {product.downloadCount || 0} بار
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            itemsPerPage={pagination.itemsPerPage}
            itemName="ردیف اطلاعاتی"
          />
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
          <div className="bg-gray-50 p-3 rounded-full mb-3">
            <FileText className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-sm font-bold text-gray-800 mb-1.5">موردی یافت نشد</h3>
          <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
            با توجه به فیلترهای اعمال شده، فایلی یافت نشد. لطفاً فیلترها را تغییر دهید.
          </p>
          <button
            onClick={onClearFilters}
            disabled={isPending}
            className="mt-4 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold px-5 py-2 rounded-xl transition-all cursor-pointer"
          >
            پاکسازی جستجو
          </button>
        </div>
      )}
    </main>
  );
}
