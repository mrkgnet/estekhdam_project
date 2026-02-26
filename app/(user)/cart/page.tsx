// app/(user)/cart/page.tsx
"use client";

import { useCart } from "@/lib/cart";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

import { createCompletedOrderFromLocalCart } from "@/actions/order";
import toast from "react-hot-toast";

// تابع برای فرمت قیمت
function formatToman(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function CartPage() {
  const router = useRouter();

  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [payLoading, setPayLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center" dir="rtl">
        <h1 className="text-2xl font-bold text-zinc-800">سبد خرید شما خالی است</h1>
        <p className="mt-2 text-zinc-600">به نظر می‌رسد هنوز محصولی به سبد خود اضافه نکرده‌اید.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#fa7342] px-6 text-sm text-white transition-colors hover:bg-zinc-900"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  const handlePay = async () => {
    if (payLoading) return;

    setPayLoading(true);
    try {
      // ✅ چک واقعی لاگین از سرور
      const me = await axios.get("/api/auth/me");
      const serverLoggedIn = Boolean(me.data?.user);

      if (!serverLoggedIn) {
        router.push("/auth/login?next=/cart");
        return;
      }

      // ✅ ثبت سفارش
      const res = await createCompletedOrderFromLocalCart(
        items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      );

      if (res.ok === false) {
        alert(res.message || "خطا در ثبت سفارش");
        if (res.reason === "AUTH_REQUIRED") {
          router.push("/auth/login?next=/cart");
        }
        return;
      }

      // ✅ پاک کردن سبد برای جلوگیری از سفارش تکراری
    
     toast.success('سفارش شما تایید شد')

      // ✅ رفتن به داشبورد
      router.push("/dashboard");
       clearCart();
    } catch (e) {
      console.error(e);
     
      toast.error("مشکلی در ثبت سفارش پیش آمد. لطفاً دوباره تلاش کنید.")

    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6" dir="rtl">
      <h1 className="text-2xl font-bold text-zinc-900">سبد خرید ({totalItems()})</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        {/* لیست آیتم‌ها */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4">
              <Image
                src={item.image || "/images/sample/product-1.png"}
                alt={item.title}
                width={96}
                height={96}
                className="rounded-lg object-contain"
              />

              <div className="flex flex-grow flex-col">
                <h3 className="text-md font-semibold text-zinc-800">{item.title}</h3>
                <p className="mt-1 text-lg font-bold text-zinc-900">
                  {formatToman(item.price)} تومان
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-300 text-lg"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-300 text-lg"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* خلاصه */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">خلاصه سفارش</h2>

            <div className="mt-4 flex justify-between text-zinc-700">
              <span>مجموع قیمت:</span>
              <span className="font-semibold">{formatToman(totalPrice())} تومان</span>
            </div>

            <button
              disabled={payLoading}
              onClick={handlePay}
              className="mt-6 w-full rounded-xl bg-zinc-900 py-3 text-white transition-colors hover:bg-[#fa7342] disabled:opacity-60"
            >
              {payLoading ? "در حال ثبت سفارش..." : "پرداخت و ثبت سفارش"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
