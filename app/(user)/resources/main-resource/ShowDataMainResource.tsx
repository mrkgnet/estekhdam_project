"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { Category, Product } from "@/types/free-resource";
import HeaderFreeResource from "@/components/user/free-resource/HeaderFreeResource";
import FilterFreeResource from "@/components/user/free-resource/FilterFreeResource";
import ContentFreeResource from "@/components/user/free-resource/ContentFreeResource";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

interface Props {
  initialCategories: Category[];
  initialProducts: Product[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
}

export default function ShowDataMainResource({
  initialCategories,
  initialProducts,
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeFilters = searchParams.getAll("category");

  const activeCategoryObjects = initialCategories.filter((cat) =>
    activeFilters.includes(cat.catSlug)
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentValues = params.getAll(name);
      
      if (name === "category") params.delete("page");
      
      params.delete(name);
      
      if (currentValues.includes(value)) {
        currentValues.filter((v) => v !== value).forEach((v) => params.append(name, v));
      } else {
        currentValues.forEach((v) => params.append(name, v));
        params.append(name, value);
      }
      
      return params.toString();
    },
    [searchParams]
  );

  const handleToggleFilter = (slug: string) => {
    const queryString = createQueryString("category", slug);
    startTransition(() => {
      router.push(`${pathname}?${queryString}`, { scroll: false });
    });
  };

  const handleClearAllFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  // 🟢 اصلاح بردکرامب: حذف "خانه" (چون کامپوننت خودش آن را اضافه می‌کند)
  // و استفاده از pathname برای صفحه فعلی
  const breadcrumbItems = [
    {
      label: 'منابع آموزشی ',
      href: pathname, 
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* بخش بردکرامب */}
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <HeaderFreeResource />
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-4">
          <FilterFreeResource
            categories={initialCategories}
            activeFilters={activeFilters}
            isPending={isPending}
            onToggleFilter={handleToggleFilter}
            onClearFilters={handleClearAllFilters}
          />
          
          <ContentFreeResource
            products={initialProducts}
            activeCategoryObjects={activeCategoryObjects}
            isPending={isPending}
            onToggleFilter={handleToggleFilter}
            onClearFilters={handleClearAllFilters}
            pagination={{ currentPage, totalPages, totalCount, itemsPerPage }}
          />
        </div>
        
      </div>
    </div>
  );
}