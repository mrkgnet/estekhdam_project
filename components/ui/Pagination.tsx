// components/ui/Pagination.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // اگر تعداد صفحات ۱ یا کمتر بود اصلا کامپوننت را رندر نکن
  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    // گرفتن پارامترهای قبلی (مثل سرچ یا فیلترهای دیگر) و آپدیت کردن فقط شماره صفحه
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    
    // جایگزینی URL بدون رفرش شدن صفحه (scroll: false برای اینکه به بالای صفحه نپرد)
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="p-4 border-t border-gray-100 flex justify-center items-center gap-4 bg-gray-50/50">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        قبلی
      </button>
      
      <span className="text-sm text-gray-600">
        صفحه <span className="font-bold text-gray-900">{currentPage}</span> از <span className="font-bold text-gray-900">{totalPages}</span>
      </span>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        بعدی
      </button>
    </div>
  );
}
