"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X, Check, SlidersHorizontal, Filter } from "lucide-react";
import type { Category } from "@/types/free-resource";

interface Props {
  categories: Category[];
  activeFilters: string[];
  isPending: boolean;
  onToggleFilter: (slug: string) => void;
  onClearFilters: () => void;
}

interface FilterListProps {
  filteredCategories: Category[];
  activeFilters: string[];
  isPending: boolean;
  filterSearch: string;
  onToggleFilter: (slug: string) => void;
  onFilterSearchChange: (val: string) => void;
}

// ─── کامپوننت اسکلتون اختصاصی برای فیلترها ────────────────────────────────
function FilterSkeleton() {
  return (
    <>
      {/* اسکلتون موبایل */}
      <div className="lg:hidden w-full mb-4">
        <div className="w-full h-14 bg-white px-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded-md" />
            <div className="w-24 h-4 bg-gray-200 rounded-md" />
          </div>
        </div>
      </div>

      {/* اسکلتون دسکتاپ */}
      <aside className="hidden lg:block w-full lg:w-[240px] bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-6">
        <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="w-20 h-4 bg-gray-200 rounded" />
          </div>
        </div>

        {/* اسکلتون بخش تاگل‌ها (دسته‌های اصلی) */}
        <div className="mb-6 pb-6 border-b border-gray-100 animate-pulse">
          <div className="w-28 h-3 bg-gray-200 rounded mb-4" />
          <div className="flex flex-col gap-2">
            <div className="w-full h-12 bg-gray-100 rounded-xl" />
            <div className="w-full h-12 bg-gray-100 rounded-xl" />
          </div>
        </div>

        {/* اسکلتون بخش سرچ و چک‌باکس‌ها (زیردسته‌ها) */}
        <div className="animate-pulse">
          <div className="w-20 h-3 bg-gray-200 rounded mb-4" />
          <div className="w-full h-10 bg-gray-100 rounded-xl mb-4" />
          <div className="flex flex-col gap-2.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-gray-100">
                <div className="w-16 h-3 bg-gray-200 rounded" />
                <div className="w-5 h-5 bg-gray-200 rounded-[6px]" />
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── لیست فیلترهای زیردسته ───────────────────────────────────────────────
function FilterList({
  filteredCategories,
  activeFilters,
  isPending,
  filterSearch,
  onToggleFilter,
  onFilterSearchChange,
}: FilterListProps) {
  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={filterSearch}
          onChange={(e) => onFilterSearchChange(e.target.value)}
          placeholder="جستجو در زیردسته‌ها..."
          className="w-full pr-10 pl-3 py-2.5 text-12 sm:text-13 lg:text-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
        />
        {filterSearch && (
          <button
            onClick={() => onFilterSearchChange("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="h-64 overflow-y-auto flex flex-col gap-2.5 pl-1 custom-scrollbar">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => {
            const isActive = activeFilters.includes(category.catSlug);
            return (
              <label
                key={category.id}
                className={`group flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? "bg-blue-50/40 border-blue-200 shadow-[0_2px_10px_rgba(37,99,235,0.04)]"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                } ${isPending ? "opacity-60 cursor-wait" : ""}`}
              >
                <span className={`transition-colors text-12 sm:text-13 lg:text-12 duration-200 ${isActive ? "text-blue-700 font-bold" : "text-gray-600 group-hover:text-gray-900"}`}>
                  {category.catName}
                </span>
                <div className="relative flex items-center justify-center shrink-0">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isActive}
                    onChange={() => onToggleFilter(category.catSlug)}
                    disabled={isPending}
                  />
                  <div className={`w-[18px] h-[18px] rounded-[6px] flex items-center justify-center transition-all duration-200 ${isActive ? "bg-blue-600 border-blue-600 shadow-sm" : "bg-white border-2 border-gray-300 group-hover:border-blue-400"}`}>
                    {isActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                </div>
              </label>
            );
          })
        ) : (
          <div className="text-center py-8 px-4">
            <div className="bg-gray-50 p-3 rounded-full inline-flex mb-3">
              <Search className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium text-12">نتیجه‌ای یافت نشد</p>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Toggle Switch برای دسته‌های اصلی ───────────────────────────────────────
function ToggleSwitchRow({
  label,
  isActive,
  disabled,
  onToggle,
}: {
  label: string;
  isActive: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 disabled:opacity-50 ${
        isActive
          ? "bg-blue-50/40 border-blue-200"
          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-200"
      }`}
    >
      <span className={`text-12 sm:text-13 font-bold transition-colors ${isActive ? "text-blue-700" : "text-gray-600"}`}>
        {label}
      </span>

      <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 shrink-0 ${isActive ? "bg-blue-600" : "bg-gray-200"}`}>
        <span
          className={`absolute top-[2px] w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
            isActive ? "right-[2px]" : "left-[2px]"
          }`}
        />
      </div>
    </button>
  );
}

// ─── کامپوننت اصلی فیلترها ──────────────────────────────────────────────────
export default function FilterMainResource({
  categories,
  activeFilters,
  isPending,
  onToggleFilter,
  onClearFilters,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");

  useEffect(() => { setMounted(true); }, []);

  const mainCategories = useMemo(() => categories.filter((c) => !c.parentId), [categories]);
  const subCategories = useMemo(() => categories.filter((c) => c.parentId), [categories]);

  const filteredSubCategories = useMemo(() => {
    if (!filterSearch.trim()) return subCategories;
    const lower = filterSearch.toLowerCase().trim();
    return subCategories.filter((cat) => cat.catName.toLowerCase().includes(lower));
  }, [subCategories, filterSearch]);

  useEffect(() => {
    document.body.style.overflow = isMobileFilterOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileFilterOpen]);

  if (!mounted) return <FilterSkeleton />;

  const renderFilterContent = () => (
    <>
      {mainCategories.length > 0 && (
        <div className="mb-6 pb-6 border-b border-gray-100">
          <span className="block text-[12px] font-bold text-gray-800 mb-3">دسته‌بندی‌های اصلی</span>
          <div className="flex flex-col gap-2">
            {mainCategories.map((cat) => (
              <ToggleSwitchRow
                key={cat.id}
                label={cat.catName}
                isActive={activeFilters.includes(cat.catSlug)}
                disabled={isPending}
                onToggle={() => onToggleFilter(cat.catSlug)}
              />
            ))}
          </div>
        </div>
      )}

      {subCategories.length > 0 && (
        <div>
          <span className="block text-[12px] font-bold text-gray-800 mb-3">زیردسته‌ها</span>
          <FilterList
            filteredCategories={filteredSubCategories}
            activeFilters={activeFilters}
            isPending={isPending}
            filterSearch={filterSearch}
            onToggleFilter={onToggleFilter}
            onFilterSearchChange={setFilterSearch}
          />
        </div>
      )}
    </>
  );

  return (
    <>
      {/* دکمه باز کردن فیلتر در موبایل */}
      <div className="lg:hidden w-full mb-4">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-full flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          type="button"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-500" />
            <span className="font-bold text-12 sm:text-13 text-gray-700">فیلتر منابع</span>
          </div>
          {activeFilters.length > 0 && (
            <span className="text-[11px] font-bold text-white bg-blue-600 px-2.5 py-1 rounded-full shadow-sm">
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* روکش تیره پشت فیلتر موبایل */}
      <div
        className={`fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isMobileFilterOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMobileFilterOpen(false)}
      />

      {/* منوی کشویی فیلتر در موبایل (Bottom Sheet) */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:hidden transform transition-transform duration-300 ease-in-out max-h-[90vh] flex flex-col ${isMobileFilterOpen ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex justify-center pt-3 pb-1 shrink-0" onClick={() => setIsMobileFilterOpen(false)}>
          <div className="w-12 h-1.5 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors" />
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-13 font-bold text-gray-800">فیلتر منابع</h2>
          <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-50 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors" type="button">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-6 flex-1">
          {renderFilterContent()}
          {activeFilters.length > 0 && (
            <button
              onClick={onClearFilters}
              disabled={isPending}
              type="button"
              className="mt-6 w-full text-12 sm:text-13 font-bold text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              پاک کردن همه فیلترها
            </button>
          )}
        </div>
        <div className="p-4 border-t border-gray-100 shrink-0 bg-white">
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            type="button"
            className="w-full text-12 sm:text-13 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
          >
            مشاهده نتایج
          </button>
        </div>
      </div>

      {/* سایدبار ثابت در دسکتاپ */}
      <aside className="hidden lg:block w-full lg:w-[240px] bg-white p-5 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-6">
        <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            فیلتر منابع
          </h2>
          {activeFilters.length > 0 && (
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              {activeFilters.length} فعال
            </span>
          )}
        </div>

        {renderFilterContent()}

        {activeFilters.length > 0 && (
          <button
            onClick={onClearFilters}
            disabled={isPending}
            type="button"
            className="mt-6 w-full font-bold text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            پاک کردن همه فیلترها
          </button>
        )}
      </aside>
    </>
  );
}