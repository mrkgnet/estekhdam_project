// app/(user)/products/[slug]/ProductDetailPageClient.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { FetchedProduct } from "@/actions/get_product_by_slug";
import { useCart } from "@/lib/cart"; // ✨ تغییر ۱: ایمپورت کردن هوک useCart
import toast from "react-hot-toast";

// ====================================================================
// کامپوننت اصلی (گارسون)
// وظیفه: نمایش UI و مدیریت تعاملات کاربر (گالری، تب‌ها، دکمه افزودن به سبد)
// داده‌ها را به صورت آماده از طریق props دریافت می‌کند.
// ====================================================================

export default function ProductDetailPageClient({ product }: { product: NonNullable<FetchedProduct> }) {
  const router = useRouter();
  const { addToCart } = useCart(); // ✨ تغییر ۲: فراخوانی هوک برای دسترسی به addToCart

  // state های تعاملی که فقط در مرورگر کاربر معنا دارند

  const images = (product.images?.length ? product.images : ["/images/sample/product-1.png"]).map((u) =>
    u.startsWith("http") ? normalizeImageUrl(u) : u,
  );

  const [activeImg, setActiveImg] = useState(images[0]);

  const [tab, setTab] = useState<"desc" | "specs" | "reviews">("desc");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6" dir="rtl">
      {/* Breadcrumb */}
      <nav className="text-xs text-zinc-500">
        <Link href="/" className="hover:text-zinc-800">
          خانه
        </Link>
        <span className="mx-2">›</span>
        <Link href="/products" className="hover:text-zinc-800">
          محصولات
        </Link>
        <span className="mx-2">›</span>
        <span className="text-zinc-800">{product.title}</span>
      </nav>

      {/* Top section */}
      <div className="mt-4 grid gap-6 lg:grid-cols-12">
        {/* Gallery */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-zinc-200 bg-white p-3">
            <div className="relative flex w-full justify-center overflow-hidden rounded-xl bg-zinc-50">
              <Image
                src={activeImg}
                alt={product.title}
                width={360}
                height={360}
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
                unoptimized
                className="h-auto w-auto"
              />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((src) => (
                <button
                  key={src}
                  onClick={() => setActiveImg(src)}
                  className={[
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white",
                    src === activeImg ? "border-zinc-900" : "border-zinc-200 hover:border-zinc-400",
                  ].join(" ")}
                  aria-label="thumbnail"
                >
                  <Image src={src} alt="" fill unoptimized className="object-contain p-1" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h1 className="text-lg leading-8 text-zinc-900">{product.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <StarRating value={product.rating ?? 0} />
                {(product.rating ?? 0).toFixed(1)}
              </div>
              <span className="text-zinc-300">|</span>
              <span>دیدگاه {product.reviewsCount ?? 0}</span>
              <span className="text-zinc-300">|</span>
              <span>علاقه‌مندی {product.likesCount ?? 0}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              {product.features.map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <span className="text-emerald-600">●</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Buy box */}
        <div className="lg:col-span-3">
          <div className="sticky top-4 rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-500">قیمت</div>
              <div className="text-xs text-zinc-500">تومان</div>
            </div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">{formatToman(product.price)}</div>
            <button
              onClick={() => {
                addToCart({
                  productId: product.id,
                  title: product.title,
                  price: product.price,
                  image:product.images?.[0] ? normalizeImageUrl(product.images[0]) : undefined,
                });
                toast.success("محصول به سبد خرید اضافه شد");

                router.push("/cart");
              }}
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#fa7342] text-sm text-white transition-colors hover:bg-zinc-900"
            >
              افزودن به سبد خرید
            </button>
          </div>
        </div>
      </div>

      {/* Tabs section */}
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white">
        <div className="flex flex-wrap gap-2 border-b border-zinc-200 p-3">
          <TabButton active={tab === "desc"} onClick={() => setTab("desc")}>
            معرفی محصول
          </TabButton>
          <TabButton active={tab === "specs"} onClick={() => setTab("specs")}>
            مشخصات
          </TabButton>
          <TabButton active={tab === "reviews"} onClick={() => setTab("reviews")}>
            دیدگاه‌ها
          </TabButton>
        </div>
        <div className="p-5">
          {tab === "desc" && (
            <div className="prose prose-zinc max-w-none leading-8">
              <p className="text-sm text-zinc-700">{product.description ?? "توضیحات این محصول هنوز ثبت نشده است."}</p>
            </div>
          )}
          {tab === "specs" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {(product.specs ?? []).map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm"
                >
                  <span className="text-zinc-600">{s.label}</span>
                  <span className="text-zinc-900">{s.value}</span>
                </div>
              ))}
              {!product.specs?.length && (
                <div className="text-sm text-zinc-600">مشخصاتی برای این محصول ثبت نشده است.</div>
              )}
            </div>
          )}
          {tab === "reviews" && <div className="text-sm text-zinc-600">هنوز دیدگاهی برای این محصول ثبت نشده است.</div>}
        </div>
      </div>
    </div>
  );
}

// ====================================================================
// کامپوننت‌های کمکی
// ====================================================================

function formatToman(n: number) {
  if (n === null || n === undefined) return "0";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`rating ${value}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= full;
        const isHalf = !filled && half && idx === full + 1;
        return (
          <span key={i} className={filled || isHalf ? "text-amber-500" : "text-zinc-300"}>
            ★
          </span>
        );
      })}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={[
        "h-10 rounded-xl px-4 text-sm transition-colors",
        active ? "bg-zinc-900 text-white" : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function normalizeImageUrl(url: string) {
  return url
    .replace(/[?&]versionId=(?=&|$)/, "") // versionId خالی رو حذف کن
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");
}
