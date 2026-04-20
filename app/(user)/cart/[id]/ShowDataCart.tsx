"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, CreditCard, ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/modals/AuthModal";
import toast from "react-hot-toast";

// ۱. تایپ‌ها بر اساس دیتابیس شما اصلاح شدند
type Product = {
  id: string;
  name: string;          // تغییر از title به name
  newPrice: number;      // تغییر از price به newPrice
  oldPrice: number;      // اضافه شدن oldPrice
  description: string | null;
};

type Props = {
  productData: Product | null;
  productId: string;
};

export default function ShowDataCart({ productData, productId }: Props) {
  const router = useRouter();
  const { isLoading, isLoggedIn } = useAuth();
  
  // استیت برای کنترل باز و بسته بودن مدال لاگین
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 👇 تابع انتقال به صفحه پرداخت (که در کد شما جا افتاده بود)
// 👇 تغییر منطق این تابع برای اتصال به API درگاه
  const proceedToCheckout = async () => {
    try {
      setIsProcessing(true);
      
      // ارسال درخواست به API سمت سرور
      const res = await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // اطلاعات محصول را طبق فرمتی که در API تعریف کردید می‌فرستیم
        body: JSON.stringify({
          items: [{ productId: productId, quantity: 1 }] 
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        // اگر موفقیت‌آمیز بود، کاربر را مستقیم به زرین‌پال هدایت کن
        window.location.href = data.payUrl;
      } else {
        // نمایش خطای برگشتی از سمت سرور
        toast.error(data.message || "خطا در ایجاد تراکنش");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
      setIsProcessing(false);
    }
  };

  // منطق کلیک روی دکمه پرداخت
  const handlePayment = () => {
    if (!isLoggedIn) {
      // اگر لاگین نبود، مدال رو باز کن
      setIsAuthModalOpen(true);
    } else {
      // اگر لاگین بود، برو برای پرداخت
      proceedToCheckout();
    }
  };

  if (!productData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-slate-500 gap-3" dir="rtl">
        <ShoppingCart className="w-12 h-12 text-slate-300" />
        <p className="font-bold  text-slate-700">محصول مورد نظر یافت نشد!</p>
        <button onClick={() => router.back()} className="text-green-600 font-bold mt-2 hover:underline">بازگشت به صفحه قبل</button>
      </div>
    );
  }

  // محاسبه مبلغ تخفیف (در صورت وجود)
  const discountAmount = productData.oldPrice > productData.newPrice
    ? productData.oldPrice - productData.newPrice
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-right p-4 pb-20 md:py-10" dir="rtl">

      {/* قرار دادن کامپوننت مدال */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        // در صورت لاگین موفق، تابع proceedToCheckout صدا زده می‌شود تا مستقیم برود برای پرداخت
        onSuccess={proceedToCheckout}
      />

      <div className="mx-auto max-w-lg">
        <header className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <h1 className=" font-black text-slate-800">تایید و پرداخت</h1>
        </header>

        <div className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 mb-6">
          <div className="flex items-start gap-4 mb-6 border-b border-slate-100 pb-6">
            <div className="bg-blue-50 p-4 rounded-2xl shrink-0">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className=" font-bold text-slate-800 leading-relaxed mb-2">
                {productData.name}
              </h2>
              {productData.description && (
                <p className=" text-slate-500 leading-6">
                  {productData.description}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-slate-600">
              <span className=" font-semibold">مبلغ کل:</span>
              <span className="font-bold">{productData.oldPrice.toLocaleString()} تومان</span>
            </div>

            {/* نمایش تخفیف اگر وجود داشته باشد */}
            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-red-500">
                <span className=" font-semibold">تخفیف:</span>
                <span className="font-bold">{discountAmount.toLocaleString()} تومان</span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
              <span className=" font-black text-slate-800">مبلغ قابل پرداخت:</span>
              <span className=" font-black text-slate-900">
                {productData.newPrice.toLocaleString()} <span className=" text-slate-500 font-bold">تومان</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8 text-slate-400">
          <ShieldCheck className="w-5 h-5" />
          <span className=" font-bold">پرداخت امن از طریق درگاه‌های معتبر بانکی</span>
        </div>

        {/* 👇 فقط یک دکمه قرار می‌دهیم و متن آن را داینامیک می‌کنیم */}
        <button
          onClick={handlePayment}
          disabled={isProcessing || isLoading}
          className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/30 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing || isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <CreditCard className="w-6 h-6" />
              {/* اگر لاگین بود "پرداخت نهایی"، در غیر این صورت "ابتدا ثبت نام کنید" */}
              {isLoggedIn ? "پرداخت نهایی" : "ابتدا ثبت نام کنید"}
            </>
          )}
        </button>

      </div>
    </div>
  );
}
