"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react"; // اضافه شدن آیکون‌های صفحه اول و آخر

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage?: number;
  itemName?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage = 10,
  itemName = "مورد",
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startIndex = (currentPage - 1) * itemsPerPage;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  // توابع جدید برای صفحه اول و آخر
  const goToFirstPage = () => {
    if (currentPage > 1) goToPage(1);
  };

  const goToLastPage = () => {
    if (currentPage < totalPages) goToPage(totalPages);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 gap-4">
      <div className="text-sm text-gray-600 font-medium">
        نمایش {startIndex + 1} تا {Math.min(startIndex + itemsPerPage, totalCount)} از {totalCount}{" "}
        {itemName}
      </div>

      <div className="flex items-center gap-1.5" dir="rtl">
        {/* دکمه صفحه اول */}
        <button
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          title="صفحه اول"
          className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
        >
          <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* دکمه صفحه قبل */}
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          title="صفحه قبل"
          className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* شماره صفحات */}
        <div className="flex items-center gap-1 mx-1 sm:mx-2">
          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-2 sm:px-3 py-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page as number)}
                className={`px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors border ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white hover:bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* دکمه صفحه بعد */}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          title="صفحه بعد"
          className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* دکمه صفحه آخر */}
        <button
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
          title="صفحه آخر"
          className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
        >
          <ChevronsLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
