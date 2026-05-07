"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, CreditCard, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/modals/AuthModal";
import toast from "react-hot-toast";

type Product = {
  id: string;
  name: string;
  newPrice: number;
  oldPrice: number;
  description: string | null;
};

type Props = {
  productData: Product | null;
  productId: string;
};

const now = new Date();
const faDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(now);

const faTime = new Intl.DateTimeFormat("fa-IR", {
  hour: "2-digit",
  minute: "2-digit",
}).format(now);

export default function ShowDataCart({ productData, productId }: Props) {
  const router = useRouter();
  const { isLoading, isLoggedIn } = useAuth();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const proceedToCheckout = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId: productId, quantity: 1 }],
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        window.location.href = data.payUrl;
      } else {
        toast.error(data.message || "خطا در ایجاد تراکنش");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      proceedToCheckout();
    }
  };

  if (!productData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-3" dir="rtl">
        <ShoppingCart className="w-16 h-16 text-slate-300 mb-2" />
        <p className="font-bold text-lg text-slate-700">محصول مورد نظر یافت نشد!</p>
        <button onClick={() => router.back()} className="text-green-600 font-bold mt-2 hover:text-green-700 hover:underline transition-all">
          بازگشت به صفحه قبل
        </button>
      </div>
    );
  }

  const discountAmount = productData.oldPrice > productData.newPrice
    ? productData.oldPrice - productData.newPrice
    : 0;

  return (
    <div className="min-h-screen  text-right p-4 pb-20 md:py-10" dir="rtl">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={proceedToCheckout}
      />

      <div className="mx-auto max-w-3xl">
        {/* هدر صفحه */}
        <header className="mb-6 flex items-center gap-4 border border-slate-300 p-2 justify-between rounded shadow">
          <button
            onClick={() => router.back()}
            className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-600">فاکتور فروش</h1>
            <p className="text-14 text-slate-500 mt-1">تایید نهایی و پرداخت</p>
          </div>
        </header>

        {/* کارت اصلی فاکتور */}
        <div className="bg-white rounded shadow-lg shadow-slate-200/50 border border-slate-200 overflow-hidden">
          
          {/* هدر فاکتور (اطلاعات پایه) */}
          <div className="p-6 border-b border-slate-200 bg-white grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 md:col-span-1">
              <span className="block text-xs text-slate-600 mb-1">شماره فاکتور</span>
              <span className="block text-sm font-bold text-slate-600 tracking-wider">INV-{productId.slice(0, 6).toUpperCase()}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 mb-1">تاریخ</span>
              <span className="block text-sm font-bold text-slate-600">{faDate}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 mb-1">ساعت</span>
              <span className="block text-sm font-bold text-slate-600">{faTime}</span>
            </div>
          </div>

          {/* بخش جدول اقلام */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[600px]">
              {/* هدر جدول */}
              <div className="grid grid-cols-12 text-xs text-slate-500 bg-slate-50 border-b border-slate-200 py-3 px-6">
                <div className="col-span-1 font-bold text-center">ردیف</div>
                <div className="col-span-5 font-bold">شرح کالا</div>
                <div className="col-span-2 text-center font-bold">تعداد</div>
                <div className="col-span-2 text-center font-bold">تخفیف</div>
                <div className="col-span-2 text-left font-bold">مبلغ کل</div>
              </div>

              {/* ردیف محصول */}
              <div className="grid grid-cols-12 items-center py-5 px-6 border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <div className="col-span-1 text-center font-bold text-slate-600">۱</div>
                <div className="col-span-5 pr-2">
                  <div className="font-bold text-slate-600">{productData.name}</div>
                 
                </div>
                <div className="col-span-2 text-center font-bold text-slate-600">۱</div>
                <div className="col-span-2 text-center font-bold text-red-500">
                  {discountAmount > 0 ? `${discountAmount.toLocaleString()} -` : "-"}
                </div>
                <div className="col-span-2 text-left font-bold text-slate-600">
                  {productData.oldPrice.toLocaleString()} <span className="text-xs font-normal text-slate-500">تومان</span>
                </div>
              </div>
            </div>
          </div>

          {/* خلاصه مالی */}
          <div className="p-6 bg-white space-y-4">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-sm font-semibold">جمع کل کالاها:</span>
              <span className="font-bold text-slate-600">{productData.oldPrice.toLocaleString()} تومان</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-red-500">
                <span className="text-sm font-semibold">سود شما از این خرید:</span>
                <span className="font-bold">{discountAmount.toLocaleString()} تومان</span>
              </div>
            )}

            {/* خط چین جداکننده مبلغ نهایی */}
            <div className="border-t-2 border-dashed border-slate-200 pt-4 mt-2 flex items-center justify-between">
              <span className="text-base font-black text-slate-600">مبلغ قابل پرداخت:</span>
              <div className="text-left">
                <span className="text-xl font-black text-green-600">
                  {productData.newPrice.toLocaleString()}
                </span>
                <span className="text-slate-500 mr-1 text-sm font-bold">تومان</span>
              </div>
            </div>
          </div>
        </div>

        {/* دکمه عملیات */}
        <button
          onClick={handlePayment}
          disabled={isProcessing || isLoading}
          className="mt-6 w-full flex items-center justify-center gap-3 h-14 rounded-xl bg-green-600 text-white font-bold text-base hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-green-600/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isProcessing || isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <CreditCard className="w-6 h-6" />
              {isLoggedIn ? "تایید و پرداخت نهایی" : "برای پرداخت ابتدا وارد شوید"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
