"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchDataResource } from "@/actions/user/resources/course/fetchData/Actions";
import {
  Clock,
  FileText,
  AlertCircle,
  PlayCircle,
  Text,
  ShoppingBasket,
  ChevronRight,
  Home,
  ChevronLeft,
  ShieldCheck,
  RefreshCcw,
  CheckCircle2
} from "lucide-react";
import { ROUTES } from "@/lib/constats";
import CommentManagment from "@/components/comment/CommentManagmet";
import TabSectionCR from "@/components/user/TabSectionCR";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ResourceLeft from "@/components/user/resourceLeft/ResourceLeft";
import ResourceRight from "@/components/user/resourceRight/ResourceRight";

// کامپوننت کمکی برای نمایش قیمت
const PriceDisplay = ({ oldPrice, newPrice }: { oldPrice?: number, newPrice?: number }) => {
  if (!newPrice) return null;
  return (
    <div className="flex flex-col items-end justify-center leading-tight">
      {oldPrice && oldPrice > newPrice && (
        <span className="text-rose-200 line-through opacity-90 decoration-rose-300">
          {oldPrice.toLocaleString()}
        </span>
      )}
      <div className="flex items-center gap-1">
        <span className="font-black">{newPrice.toLocaleString()}</span>
        <span className="font-normal opacity-90">تومان</span>
      </div>
    </div>
  );
};

interface ExamDetailsProps {
  initialResponse: any;
  slugValue: string;
}

export default function ExamDetailsPage({ initialResponse, slugValue }: ExamDetailsProps) {
  // مدیریت داده‌ها با ریکت کوئری
  const { data: response, isFetching } = useQuery({
    queryKey: ['resource-course', slugValue],
    queryFn: async () => await fetchDataResource(slugValue),
    initialData: initialResponse,
    staleTime: 1000 * 60 * 30, // ۳۰ دقیقه کش
  });

  const product = response?.data;

  if (!response?.success || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 text-slate-500 space-y-4 px-4 text-center font-sans">
        <AlertCircle className="w-16 h-16 text-slate-300 mb-2" />
        <p className="font-medium text-slate-700">محصولی یافت نشد</p>
        <p className="text-slate-500 max-w-md">ممکن است لینک اشتباه باشد یا محصول از سایت حذف شده باشد.</p>
        <Link href="/resources" className="mt-6 px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors shadow-sm font-medium">
          بازگشت به منابع
        </Link>
      </div>
    );
  }

  // 🟢 تعیین آیتم‌های بردکرامب بر اساس نوع محصول
  const isFreeResource = product.type === 'FREE_RESOURCE';
  
  const breadcrumbItems = isFreeResource 
    ? [
        {
          label: 'منابع آموزشی رایگان',
          href: '/resources/free-resources',
        },
        {
          label: product.name,
          href: `/resources/course/${product.name}`,
        },
      ]
    : [
        {
          label: 'منابع آموزشی',
          href: '/resources/main-resource',
        },
        {
          label: product.name,
          href: `/resources/course/${product.name}`,
        },
      ];

  return (
    <div className="min-h-screen font-sans  pb-[100px] lg:pb-12" dir="rtl">
      {/* افکت لودینگ نامحسوس در پس‌زمینه */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-5 transition-opacity duration-300 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>

        <div className="">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-start">

          {/* ==================== ستون سمت راست ==================== */}
          <ResourceLeft product={product} />
          
          {/* ==================== ستون سمت وسط ==================== */}
          <div className="lg:col-span-6 w-full flex flex-col gap-3 lg:gap-8">
            {/* تب‌های توضیحات */}
            <div className="bg-white rounded shadow-sm border border-slate-200/60 p-1">
              <TabSectionCR product={product} isLoading={false} />
            </div>
          </div>

          {/* ==================== ستون سمت چپ (خرید/دانلود) ==================== */}
          <ResourceRight product={product} />

        </div>
        
        {/* بخش نظرات */}
        <div className="">
          <CommentManagment targetId={product.id} targetType="product" />
        </div>
      </div>
    </div>
  );
}