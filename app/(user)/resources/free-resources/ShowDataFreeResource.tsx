"use client";

import Image from "next/image";
import { DownloadCloud, FileText, X, Filter } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import Pagination from "@/components/ui/Pagination"; // مسیر کامپوننت صفحه‌بندی

type Category = {
  id: string;
  catName: string;
  catSlug: string;
  imageUrl?: string | null;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  downloadUrl?: string | null;
  downloadCount?: number;
  categories: { id: string; catName: string; catSlug: string }[];
};

interface Props {
  initialCategories: Category[];
  initialProducts: Product[]; 
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
}

export default function ShowDataFreeResource({ 
  initialCategories, 
  initialProducts,
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [isPending, startTransition] = useTransition();

  const activeFilters = searchParams.getAll("category");

  // پیدا کردن آبجکتِ دسته‌بندی‌های فعال برای نمایش نام آن‌ها در بخش فیلترها
  const activeCategoryObjects = initialCategories.filter(cat => 
    activeFilters.includes(cat.catSlug)
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentValues = params.getAll(name);

      if (name === "category") {
          params.delete("page"); 
      }

      params.delete(name);

      if (currentValues.includes(value)) {
        currentValues
          .filter((v) => v !== value)
          .forEach((v) => params.append(name, v));
      } else {
        currentValues.forEach((v) => params.append(name, v));
        params.append(name, value);
      }

      return params.toString();
    },
    [searchParams]
  );

  const toggleFilter = (slug: string) => {
    const queryString = createQueryString("category", slug);
    startTransition(() => {
      router.push(`${pathname}?${queryString}`, { scroll: false });
    });
  };

  const clearAllFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* هدر صفحه */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 border-r-4 border-blue-600 pr-3 leading-relaxed">
            بانک سوالات و منابع اداری
          </h1>
          <p className="text-sm text-gray-500 mt-2 pr-4">
            جستجو و دریافت فایل‌های آمادگی آزمون‌های استخدامی
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* سایدبار فیلترها */}
          <aside className="w-full lg:w-1/4 bg-white p-5 md:p-6 rounded-lg shadow-sm border border-gray-200 h-fit sticky top-6">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                فیلتر منابع
              </h2>
            </div>
            
            {initialCategories.length > 0 ? (
              <div className="space-y-1">
                {initialCategories.map((category) => {
                  const isChecked = activeFilters.includes(category.catSlug);
                  
                  return (
                    <label
                      key={category.id}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer border-l-2 transition-all duration-200 ${
                        isChecked
                          ? "border-blue-600 bg-blue-50/40"
                          : "border-transparent hover:bg-gray-50"
                      } ${isPending ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={isChecked}
                          onChange={() => toggleFilter(category.catSlug)}
                          disabled={isPending} 
                        />
                        <div
                          className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors duration-200 ${
                            isChecked
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isChecked && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className={`text-sm select-none ${isChecked ? "font-bold text-blue-800" : "font-medium text-gray-600"}`}>
                        {category.catName}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">دسته‌بندی یافت نشد.</p>
            )}
          </aside>

          {/* بخش اصلی: نمایش فایل‌ها و محصولات */}
          <main className="flex-1 flex flex-col relative min-h-[400px]">
            
            {/* 🟢 نمایش برچسب فیلترهای انتخاب شده */}
            {activeCategoryObjects.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-gray-500 ml-1">فیلترهای فعال:</span>
                {activeCategoryObjects.map(cat => (
                  <span 
                    key={cat.id} 
                    className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold border border-gray-200 transition-colors hover:bg-gray-200"
                  >
                    {cat.catName}
                    <button 
                      onClick={() => toggleFilter(cat.catSlug)} 
                      disabled={isPending}
                      className="text-gray-400 hover:text-red-500 cursor-pointer disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <button 
                  onClick={clearAllFilters}
                  disabled={isPending}
                  className="text-xs text-blue-600 hover:text-blue-800 mr-auto font-bold underline decoration-blue-300 underline-offset-4 cursor-pointer disabled:opacity-50"
                >
                  حذف همه فیلترها
                </button>
              </div>
            )}

            {/* لایه لودینگ هنگام فیلتر کردن */}
            {isPending && (
              <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-lg transition-all duration-300">
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-md shadow-md border border-gray-200">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="text-sm font-bold text-gray-700">در حال بروزرسانی لیست...</span>
                </div>
              </div>
            )}

            {initialProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 content-start flex-1">
                  {initialProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all group flex flex-col">
                      
                      <div className="relative h-40 bg-gray-100/80 w-full overflow-hidden flex items-center justify-center border-b border-gray-100">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain p-4 transition-transform duration-300"
                          />
                        ) : (
                          <FileText className="w-10 h-10 text-gray-300" />
                        )}
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {product.categories.slice(0, 2).map((cat) => (
                            <span key={cat.id} className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {cat.catName}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-sm font-bold text-gray-900 mb-4 line-clamp-2 leading-loose">
                          {product.name}
                        </h3>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-medium text-gray-400">تعداد دانلود</span>
                            <span className="text-sm font-bold text-gray-800 mt-0.5">{product.downloadCount || 0} بار</span>
                          </div>
                          
                          {product.downloadUrl ? (
                            <a 
                              href={product.downloadUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                              <DownloadCloud className="w-4 h-4" />
                              دریافت فایل
                            </a>
                          ) : (
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 border border-gray-200 px-4 py-2 rounded">فاقد پیوست</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  itemsPerPage={itemsPerPage}
                  itemName="ردیف اطلاعاتی"
                />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                <FileText className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-base font-bold text-gray-800 mb-2">موردی یافت نشد</h3>
                <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                  با توجه به فیلترهای اعمال شده، ردیف اطلاعاتی در سامانه ثبت نشده است. لطفاً فیلترها را تغییر دهید.
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="mt-6 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold px-6 py-2 rounded transition-colors cursor-pointer"
                  disabled={isPending}
                >
                  پاکسازی جستجو
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}