'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import deleteProductAction from '@/actions/admin/products/government/deleteproduct/Actions';
import DeleteButton from '@/components/ui/DeleteButton';
import {
  Plus,
  ArrowRight,
  ImageOff,
  Inbox,
  FileQuestion,
  FileEdit,
} from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';

interface Category {
  id: string;
  catName: string;
  catSlug: string;
}

interface Product {
  id: string;
  name: string;
  newPrice: number;
  oldPrice?: number;
  imageUrl?: string;
  categories?: Category[];
}

interface ShowDataProps {
  products: Product[];
  totalPages: number;
  currentPage: number;
  limit: number;
}

export default function ShowData({
  products,
  totalPages,
  currentPage,
  limit,
}: ShowDataProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // مدیریت وضعیت لودینگ با useTransition
  const [isPending, startTransition] = useTransition();

  const initialQuery = searchParams.get('query') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const currentUrlQuery = searchParams.get('query') || '';

      if (searchTerm !== currentUrlQuery) {
        if (searchTerm) {
          params.set('query', searchTerm);
        } else {
          params.delete('query');
        }

        params.set('page', '1');

        // اعمال تغییر روت در قالب Transition برای فعال شدن isPending
        startTransition(() => {
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]);

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col max-w-5xl mx-auto items-center text-xs md:text-sm justify-center py-20 bg-white border border-dashed border-slate-300 rounded-2xl shadow-sm relative">
        <div className="bg-slate-50 p-6 rounded mb-4">
          <Inbox className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-slate-700 mb-1">
          {searchTerm ? 'نتیجه‌ای برای جستجوی شما یافت نشد' : 'هیچ آگهی یافت نشد'}
        </h3>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            disabled={isPending}
            className="text-blue-600 mt-2 underline disabled:opacity-50"
          >
            پاک کردن جستجو
          </button>
        )}
        <Link
          href="/adminp/products/government/addproduct"
          className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded font-medium transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          ثبت محصول جدید
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-xs md:text-sm max-w-7xl mx-auto relative">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-all"
            title="بازگشت"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-blue-600 rounded"></div>
            <h1 className="text-xl font-semibold text-slate-800">
              مدیریت محصولات استخدامی دولتی
            </h1>
          </div>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="جستجو در عنوان یا دسته‌بندی..."
          className="md:w-1/3"
          isLoading={isPending}
        />

        <Link
          href="/adminp/products/government/addproduct"
          className="flex w-full sm:w-auto items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded font-medium transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          ثبت محصول جدید
        </Link>
      </div>

      {/* جدول داده‌ها */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-slate-600">
            <thead className="text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4 text-center whitespace-nowrap">
                  ردیف
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  تصویر
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  عنوان آگهی / محصول
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  هزینه (تومان)
                </th>
                <th scope="col" className="px-6 py-4 whitespace-nowrap">
                  دسته‌بندی‌ها
                </th>
                <th scope="col" className="px-6 py-4 text-center whitespace-nowrap">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/80 transition-colors duration-200 group"
                >
                  <td className="px-6 py-4 font-medium text-slate-500 text-center whitespace-nowrap">
                    {((currentPage - 1) * limit + index + 1).toLocaleString('fa-IR')}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.imageUrl && product.imageUrl !== '###' ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-400 border border-slate-200">
                        <ImageOff className="w-5 h-5 mb-0.5 opacity-50" />
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 text-slate-800 font-medium min-w-[200px]">
                    {product.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-emerald-600">
                        {product.newPrice
                          ? product.newPrice.toLocaleString()
                          : 'رایگان'}
                      </span>
                      {product.oldPrice && product.oldPrice > product.newPrice && (
                        <span className="text-slate-400 line-through mt-0.5">
                          {product.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-xs">
                    {product.categories && product.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {product.categories.map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100/50 font-medium"
                          >
                            {category.catName}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 bg-slate-100 px-2.5 py-1 rounded">
                        بدون دسته
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/adminp/chapter/${product.id}`}
                        title="سرفصل ها"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 font-medium rounded hover:bg-teal-600 hover:text-white transition-all"
                      >
                        <FileQuestion className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">سرفصل ها</span>
                      </Link>

                      <Link
                        href={`/adminp/questions/${product.id}`}
                        title="سوالات"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-200 font-medium rounded hover:bg-teal-600 hover:text-white transition-all"
                      >
                        <FileQuestion className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">سوالات</span>
                      </Link>

                      <Link
                        href={`/adminp/products/government/editproduct/${product.id}`}
                        title="ویرایش"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 font-medium rounded hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">ویرایش</span>
                      </Link>

                      <DeleteButton
                        id={product.id}
                        action={deleteProductAction}
                        itemName="این آگهی"
                        className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded transition-colors border border-transparent hover:border-red-200"
                      >
                        حذف
                      </DeleteButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* صفحه‌بندی */}
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}