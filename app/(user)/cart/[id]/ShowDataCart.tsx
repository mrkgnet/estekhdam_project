"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, CreditCard, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/modals/AuthModal";
import toast from "react-hot-toast";

// --- Type Definitions ---
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

// --- Helper for Date/Time ---
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

// --- Component ---
export default function ShowDataCart({ productData, productId }: Props) {
  const router = useRouter();
  const { isLoading: isAuthLoading, isLoggedIn } = useAuth();
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
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
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

  // --- Loading State ---
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
      </div>
    );
  }

  // --- Not Found State ---
  if (!productData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 p-4" dir="rtl">
        <ShoppingCart className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="font-bold text-xl text-slate-800">محصول یافت نشد</h2>
        <p className="text-slate-500 mt-1">متاسفانه محصولی با این مشخصات وجود ندارد.</p>
        <button onClick={() => router.back()} className="text-green-600 font-bold mt-6 hover:underline transition-all">
          بازگشت به صفحه قبل
        </button>
      </div>
    );
  }

  const discountAmount = productData.oldPrice > productData.newPrice
    ? productData.oldPrice - productData.newPrice
    : 0;
  
  const isLoading = isProcessing || isAuthLoading;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" dir="rtl">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={proceedToCheckout}
      />

      <div className="mx-auto max-w-3xl p-4 md:py-10 pb-28 md:pb-10">
        {/* Page Header */}
        <header className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">تایید و پرداخت</h1>
            <p className="text-sm text-slate-500 mt-1">لطفا جزئیات فاکتور را بررسی و پرداخت را نهایی کنید.</p>
          </div>
        </header>

        {/* Invoice Card */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          
          {/* Invoice Meta Data */}
          <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 border-b border-slate-200">
            <div>
              <span className="block text-xs text-slate-500">شماره فاکتور</span>
              <span className="block text-sm font-semibold tracking-wider mt-1">INV-{productId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500">تاریخ</span>
              <span className="block text-sm font-semibold mt-1">{faDate}</span>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="block text-xs text-slate-500">وضعیت</span>
              <span className="inline-flex items-center bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full mt-1">
                در انتظار پرداخت
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right font-semibold">شرح محصول</th>
                  <th scope="col" className="px-6 py-3 text-center font-semibold">تعداد</th>
                  <th scope="col" className="px-6 py-3 text-left font-semibold">مبلغ (تومان)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-800">{productData.name}</td>
                  <td className="px-6 py-4 text-center font-medium">۱</td>
                  <td className="px-6 py-4 text-left font-medium">{productData.oldPrice.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="p-6 bg-slate-50/70 border-t border-slate-200">
            <div className="max-w-sm ml-auto space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">جمع کل:</span>
                <span className="font-semibold">{productData.oldPrice.toLocaleString()} تومان</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-red-600">
                  <span className="text-sm font-semibold">تخفیف:</span>
                  <span className="font-semibold">{discountAmount.toLocaleString()} تومان</span>
                </div>
              )}
              <div className="border-t border-slate-200 my-2"></div>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-800">مبلغ نهایی:</span>
                <span className="text-xl font-extrabold text-green-600">{productData.newPrice.toLocaleString()} تومان</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Footer for Action Button (Mobile) */}
      <footer className="fixed bottom-0 left-0 right-0 md:static bg-white border-t border-slate-200 p-3 md:p-0 md:bg-transparent md:border-none md:mt-6">
        <div className="mx-auto max-w-3xl flex items-center justify-between md:justify-end">
            <div className="md:hidden">
                <span className="text-xs text-slate-500">مبلغ قابل پرداخت</span>
                <p className="font-extrabold text-lg text-green-600">{productData.newPrice.toLocaleString()} تومان</p>
            </div>
            <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-auto md:w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-green-600 text-white font-bold text-base hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-green-500/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <>
                    <CreditCard className="w-6 h-6" />
                    <span>{isLoggedIn ? "پرداخت نهایی" : "ورود و پرداخت"}</span>
                    </>
                )}
            </button>
        </div>
      </footer>
    </div>
  );
}
