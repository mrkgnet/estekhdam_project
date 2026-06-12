"use client";

import { useMemo, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import FilterMainResource from "@/components/user/resources/main-resources/FilterMainResource";
import ContentMainResource from "@/components/user/resources/main-resources/ContentMainResource";

type ProductType = {
  id: string | number;
  name: string;
  slug: string;
  oldPrice: number;
  newPrice: number;
  imageUrl: string;
};

type CategoryType = {
  id: string | number;
  catName: string;
  catSlug: string;
};

interface Props {
  initialProducts?: ProductType[];
  initialTotalCount?: number;
  initialTotalPages?: number;
  currentPage: number;
  searchQuery: string;
  categoryQuery: string;
  limit: number;
  categories?: CategoryType[];
}

export default function ShowDataResources({
  initialProducts = [],
  initialTotalPages = 1,
  currentPage,
  searchQuery,
  categoryQuery,
  categories = [],
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") ?? categoryQuery ?? "";

  const activeFilters = useMemo(
    () => currentCategory ? currentCategory.split(",").map((i) => i.trim()).filter(Boolean) : [],
    [currentCategory]
  );

  const updateCategoryParams = (filters: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filters.length > 0) params.set("category", filters.join(","));
    else params.delete("category");
    params.delete("page");
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const toggleFilter = (slug: string) =>
    updateCategoryParams(
      activeFilters.includes(slug)
        ? activeFilters.filter((c) => c !== slug)
        : [...activeFilters, slug]
    );

  const sharedFilterProps = {
    categories,
    activeFilters,
    isPending,
    onToggle: toggleFilter,
    onClear: () => updateCategoryParams([]),
  };

  return (
    <section dir="rtl" className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <FilterMainResource {...sharedFilterProps} mobileOnly />

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="hidden lg:block lg:w-1/4 sticky top-6">
            <FilterMainResource {...sharedFilterProps} desktopOnly />
          </div>

          <div className="w-full lg:w-3/4">
            <ContentMainResource
              products={Array.isArray(initialProducts) ? initialProducts : []}
              loading={isPending}
              totalPages={initialTotalPages}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
