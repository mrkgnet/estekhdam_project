"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FileText, Clock, Text, PlayCircle, ShoppingBasket, CheckCircle2, Info } from "lucide-react";

import { useAuth } from "@/context/AuthContext"; 
import { checkUserPurchaseStatus } from "@/actions/user/resources/course/checkUserPurchaseStatus/Actions";
// آدرس دقیق اکشن خود را در صورت نیاز اصلاح کنید

const PriceDisplay = ({
  oldPrice,
  newPrice,
}: {
  oldPrice?: number;
  newPrice?: number;
}) => {
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

const Skeleton = () => (
  <div className="lg:col-span-3 w-full">
    <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-3 space-y-6 animate-pulse">
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 bg-slate-100 rounded-lg" />
          <div className="h-16 bg-slate-100 rounded-lg" />
          <div className="h-16 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-14 bg-slate-100 rounded-xl" />
        <div className="space-y-3">
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

type Props = { product: any };

export default function ResourceRight({ product }: Props) {
  const [mounted, setMounted] = useState(false);
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();

  useEffect(() => setMounted(true), []);

  // بررسی وضعیت خرید فقط زمانی که کاربر لاگین باشد
  const { data: hasPurchased, isLoading: purchaseLoading } = useQuery({
    queryKey: ['purchase-status', product?.id, user?.id],
    queryFn: () => checkUserPurchaseStatus(product?.id, user?.id),
    enabled: !!isLoggedIn && !!user?.id && !!product?.id,
    staleTime: 0, // تاخیر کش را 0 می‌گذاریم تا وضعیت خرید همیشه به‌روز باشد
  });

  if (!mounted) return <Skeleton />;

  const isLoading = authLoading || purchaseLoading;

  return (
    <div className="lg:col-span-3 w-full">
      <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-3 pb-36 lg:pb-3 space-y-6">
          
          {/* نمایش بنر بالای کارت */}
          {isLoading ? (
             <div className="w-full h-12 bg-slate-100 animate-pulse rounded-xl"></div>
          ) : hasPurchased ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3 flex items-center justify-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              شما دانشجوی این دوره هستید
            </div>
          ) : isLoggedIn ? (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-3 flex items-center justify-center gap-2 font-bold text-sm">
              <Info className="w-5 h-5" />
              شما وارد حساب کاربری شده‌اید
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 text-slate-500 rounded-xl p-3 flex items-center justify-center gap-2 font-medium text-sm">
              <Info className="w-5 h-5" />
              برای خرید، ابتدا وارد حساب شوید
            </div>
          )}

          {/* QUICK STATS */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <FileText className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-slate-800">
                {product?._count?.questions || 0}
              </div>
              <span className="text-10 text-slate-500">سوال</span>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <span className="text-10 text-slate-700">پرسش های ۴ گزینه‌ای</span>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <Text className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <span className="text-10 text-slate-500">پاسخ تشریحی</span>
            </div>
          </div>

          {/* PRICE */}
          <div className="bg-slate-50 border font-bold border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div className="text-sm text-slate-500">قیمت محصول</div>
            <PriceDisplay oldPrice={product?.oldPrice} newPrice={product?.newPrice} />
          </div>

          {/* CTA */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-4 space-y-3 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] lg:relative lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
            
            {isLoading ? (
              <div className="space-y-3 w-full">
                <div className="w-full h-12 bg-slate-100 animate-pulse rounded-xl"></div>
                <div className="w-full h-12 bg-slate-100 animate-pulse rounded-xl"></div>
              </div>
            ) : hasPurchased ? (
               // حالت خریداری شده
              <>
                <Link
                  href={`/resources/course/questions?pid=${product?.id}&pname=${product?.slug}`}
                  className="w-full h-12 bg-blue-600 font-bold hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 transition active:scale-[0.98]"
                >
                  <PlayCircle className="w-5 h-5" />
                  شروع / ادامه دوره
                </Link>

                <div className="w-full h-12 bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-xl flex items-center justify-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  شما قبلا دوره را خریداری کردید
                </div>
              </>
            ) : (
              // حالت خریداری نشده
              <>
                <Link
                  href={`/resources/course/questions?pid=${product?.id}&pname=${product?.slug}`}
                  className="w-full h-12 border-2 font-bold border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center gap-2 transition bg-slate-100"
                >
                  <PlayCircle className="w-5 h-5 text-blue-600" />
                  رایگان شروع کن
                </Link>

                <Link
                  href={`/cart/${product?.id}`}
                  className="w-full h-12 bg-blue-600 font-bold hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 transition active:scale-[0.98]"
                >
                  <ShoppingBasket className="w-5 h-5" />
                  خرید محصول
                </Link>
              </>
            )}

          </div>
          
        </div>
      </div>
    </div>
  );
}
