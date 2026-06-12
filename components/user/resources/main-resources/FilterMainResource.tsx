"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Search, X, SlidersHorizontal, Filter, Check } from "lucide-react";
import FilterFreeResourceSkeleton from "@/components/ui/SkeletonLoding/FilterFreeResourceSkeleton";

export type CategoryType = {
  id: string | number;
  catName: string;
  catSlug: string;
};

interface Props {
  categories?: CategoryType[];
  activeFilters?: string[];
  isPending: boolean;
  onToggle: (slug: string) => void;
  onClear: () => void;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

function FilterList({
  filteredCategories = [],
  activeFilters = [],
  filterSearch,
  isPending,
  onToggle,
  onFilterSearchChange,
}: {
  filteredCategories: CategoryType[];
  activeFilters: string[];
  isPending: boolean;
  filterSearch: string;
  onToggle: (slug: string) => void;
  onFilterSearchChange: (val: string) => void;
}) {
  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={filterSearch}
          onChange={(e) => onFilterSearchChange(e.target.value)}
          placeholder="جستجو در دسته‌بندی‌ها..."
          className="w-full pr-10 pl-3 py-2.5 text-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        {filterSearch && (
          <button
            onClick={() => onFilterSearchChange("")}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            type="button"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      <div className="h-72 overflow-y-auto flex flex-col gap-2.5 pl-1">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((c) => {
            const isActive = activeFilters.includes(c.catSlug);
            return (
              <label
                key={c.id}
                className={`group flex justify-between items-center px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  isActive
                    ? "bg-blue-50 border-blue-200 shadow-sm"
                    : "bg-white border-gray-100 hover:bg-gray-50"
                }`}
              >
                <span className={isActive ? "text-blue-700 font-medium" : "text-gray-600"}>
                  {c.catName}
                </span>

                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isActive}
                  onChange={() => onToggle(c.catSlug)}
                  disabled={isPending}
                />
                <div
                  className={`w-5 h-5 rounded-[6px] flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-2 border-gray-300 group-hover:border-blue-400"
                  }`}
                >
                  {isActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
              </label>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400 text-sm">موردی یافت نشد</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function FilterMainResource({
  categories = [],
  activeFilters = [],
  isPending,
  onToggle,
  onClear,
  mobileOnly = false,
  desktopOnly = false,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");

  const safeCats = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories]
  );

  const filtered = useMemo(() => {
    if (!filterSearch.trim()) return safeCats;
    const s = filterSearch.toLowerCase().trim();
    return safeCats.filter((c) => c.catName.toLowerCase().includes(s));
  }, [safeCats, filterSearch]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mobileOnly) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mobileOnly]);

  if (!mounted) return <FilterFreeResourceSkeleton />;

  const listProps = {
    filteredCategories: filtered,
    activeFilters,
    isPending,
    filterSearch,
    onToggle,
    onFilterSearchChange: setFilterSearch,
  };

  if (mobileOnly) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden w-full flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-gray-200 mb-4 shadow-sm"
          type="button"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-500" />
            <span className="font-bold text-gray-700">فیلتر محصولات</span>
          </div>
          {activeFilters.length > 0 && (
            <span className="text-[11px] text-white bg-blue-600 px-2.5 py-1 rounded-full font-bold">
              {activeFilters.length}
            </span>
          )}
        </button>

        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
            open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setOpen(false)}
        />

        <div
          className={`fixed bottom-0 left-0 w-full bg-white rounded-t-[2.5rem] z-50 p-6 lg:hidden transition-transform duration-300 ease-in-out ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

          <FilterList {...listProps} />

          <div className="flex gap-3 mt-6">
            {activeFilters.length > 0 && (
              <button
                onClick={onClear}
                className="flex-1 py-3.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm"
                type="button"
              >
                پاک کردن
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="flex-[2] py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100"
              type="button"
            >
              مشاهده نتایج
            </button>
          </div>
        </div>
      </>
    );
  }

  if (desktopOnly) {
    return (
      <aside className="hidden lg:block bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-50">
          <h2 className="flex items-center gap-2 font-bold text-gray-800">
            <Filter className="w-4 h-4 text-gray-500" />
            فیلتر محصولات
          </h2>
          {activeFilters.length > 0 && (
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-bold">
              {activeFilters.length} فعال
            </span>
          )}
        </div>

        <FilterList {...listProps} />

        {activeFilters.length > 0 && (
          <button
            onClick={onClear}
            className="mt-6 w-full py-3 bg-white border border-gray-200 rounded-xl text-gray-500 text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
            type="button"
          >
            پاک کردن همه فیلترها
          </button>
        )}
      </aside>
    );
  }

  return null;
}