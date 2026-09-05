"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  BookOpen,
  Instagram,
  Send,
  ChevronUp,
  ArrowLeft,
} from "lucide-react";
import { useFooterCategories } from "@/hooks/useFooterCategories";

/* ----------------------------------
 * تایپ‌های مربوط به دسته‌بندی‌ها
 * ---------------------------------- */
export interface CategoryChildItem {
  id: string;
  catName: string;
  catSlug: string;
}

export interface CategoryParentItem {
  id: string;
  catName: string;
  catSlug: string;
  children?: CategoryChildItem[];
}

interface FooterProps {
  initialCategories?: CategoryParentItem[];
}

/* ----------------------------------
 * ثابت‌ها و لینک‌ها
 * ---------------------------------- */
const EITAA_URL = "https://eitaa.com/estekhdampro";
const TELEGRAM_URL = "https://t.me/your_channel";
const INSTAGRAM_URL = "https://instagram.com/your_page";

const ENAMAD_URL =
  "https://trustseal.enamad.ir/?id=726282&Code=lFABKJYOh6iJxU0CU2uOAlIYw7gtwEnp";

const ENAMAD_IMG =
  "https://trustseal.enamad.ir/logo.aspx?id=726282&Code=lFABKJYOh6iJxU0CU2uOAlIYw7gtwEnp";

/* ----------------------------------
 * دکمه شناور بازگشت به بالا
 * ---------------------------------- */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
      aria-label="بازگشت به بالای صفحه"
      className="fixed bottom-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/90 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400"
    >
      <ChevronUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

/* ----------------------------------
 * کامپوننت اصلی فوتر (با ری‌اکت کوئری)
 * ---------------------------------- */
export default function Footer({ initialCategories = [] }: FooterProps) {
  const currentYear = 1405;

  // استفاده از کش هوشمند React Query
  const { data: dynamicCategories = [] } = useFooterCategories(initialCategories);

  return (
    <>
      <ScrollToTopButton />

      <footer
        dir="rtl"
        className="mt-6 w-full border-t border-slate-700/50 bg-[#34464E] font-sans text-white"
      >
        {/* بنر دکمه وسط‌چین بازگشت به بالا */}
        <div className="flex justify-center border-b border-white/10 bg-slate-600/60 py-3">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-1.5 text-xs font-medium text-white transition-all hover:border-white/40 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
            <span>بازگشت به بالا</span>
          </button>
        </div>

        <div className="mx-auto w-full px-4 py-8 sm:px-6">
          {/* گرید ستون‌ها */}
          <div className="grid grid-cols-2 items-start gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            
            {/* ستون ۱: برند و معرفی */}
            <div className="flex flex-col gap-3">
              <span className="text-xl font-black tracking-tight text-white">
                استخدام‌پرو
              </span>
              <p className="text-xs leading-6 text-slate-300">
                شیوه نوین برای مطالعه دروس استخدامی. ارائه‌دهنده جامع‌ترین
                منابع آزمون‌های سراسری، اختصاصی، نمونه سوالات و جزوات استاندارد.
              </p>
            </div>

            {/* ستون ۲: نمادهای اعتماد + شبکه‌های اجتماعی زیر آن‌ها */}
            <div className="flex flex-col gap-3">
              <h3 className="border-r-2 border-emerald-400 pr-2 text-sm font-bold text-white">
                نمادهای اعتماد
              </h3>

              {/* لوگوهای اعتماد */}
              <div className="flex flex-row items-center gap-3 pt-1">
                {/* اینماد */}
                <a
                  href={ENAMAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="origin"
                  aria-label="نماد اعتماد الکترونیکی"
                  className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/95 p-1.5 shadow-sm transition-all hover:scale-105 hover:border-emerald-400"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ENAMAD_IMG}
                    alt="نماد اعتماد الکترونیکی اینماد"
                    width={48}
                    height={48}
                    className="h-11 w-11 object-contain"
                    loading="lazy"
                  />
                </a>

                {/* زرین‌پال */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/95 p-1.5 shadow-sm transition-all hover:scale-105">
                  <Image
                    src="/images/footer/zrinpal.png"
                    alt="نشان پرداخت امن زرین‌پال"
                    width={48}
                    height={48}
                    className="h-11 w-11 object-contain"
                  />
                </div>
              </div>

              {/* شبکه‌های اجتماعی زیر نمادها */}
              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href={EITAA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="کانال ایتا"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs font-bold text-white shadow-sm transition-all hover:scale-110 hover:border-emerald-400 hover:bg-emerald-500"
                >
                  ایتا
                </a>

                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="کانال تلگرام"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white shadow-sm transition-all hover:scale-110 hover:border-sky-400 hover:bg-sky-500"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </a>

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="صفحه اینستاگرام"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white shadow-sm transition-all hover:scale-110 hover:border-pink-500 hover:bg-pink-600"
                >
                  <Instagram className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* ستون ۳: پیوندها */}
            <div className="flex flex-col gap-3">
              <h3 className="border-r-2 border-emerald-400 pr-2 text-sm font-bold text-white">
                پیوندها
              </h3>

              <ul className="flex flex-col gap-2.5 text-xs text-slate-200">
                <li>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                  >
                    <Home className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden="true" />
                    <span className="border-b border-transparent hover:border-white">
                      خانه
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/plans"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                  >
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden="true" />
                    <span className="border-b border-transparent hover:border-white">
                      خرید اشتراک
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources/free-questions"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                  >
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden="true" />
                    <span className="border-b border-transparent hover:border-white">
                      نمونه سوالات رایگان
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources/free-booklets"
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                  >
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden="true" />
                    <span className="border-b border-transparent hover:border-white">
                      دفترچه‌های رایگان
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* ستون‌های ۴ و بعد: دسته‌بندی‌های داینامیک از کش ری‌اکت کوئری */}
            {dynamicCategories.map((parent) => (
              <div key={parent.id} className="flex flex-col gap-3">
                {/* عنوان دسته والد */}
                <h3 className="border-r-2 border-emerald-400 pr-2 text-sm font-bold text-white">
                  {parent.catName}
                </h3>

                {/* زیردسته‌ها */}
                <ul className="relative mr-0.5 flex flex-col gap-2.5 border-r border-dashed border-slate-400/50 pr-3.5 text-xs text-slate-200">
                  {parent.children && parent.children.length > 0 ? (
                    <>
                      {parent.children.map((child) => (
                        <li key={child.id} className="relative min-w-0">
                          <span
                            aria-hidden="true"
                            className="absolute right-[-15px] top-[9px] h-px w-2.5 border-t border-dashed border-slate-400/50"
                          />
                          <Link
                            href={`/resources/main-resource?category=${encodeURIComponent(
                              child.catSlug
                            )}`}
                            className="inline-flex max-w-full items-center gap-1.5 transition-colors hover:text-emerald-300"
                          >
                            <BookOpen
                              className="h-3 w-3 shrink-0 text-slate-400"
                              aria-hidden="true"
                            />
                            <span className="truncate border-b border-transparent hover:border-emerald-300">
                              {child.catName}
                            </span>
                          </Link>
                        </li>
                      ))}

                      {/* دکمه دایره‌ای مشاهده همه */}
                      <li className="relative min-w-0 pt-1.5">
                        <span
                          aria-hidden="true"
                          className="absolute right-[-15px] top-[17px] h-px w-2.5 border-t border-dashed border-slate-400/50"
                        />
                        <Link
                          href={`/resources/main-resource?parent=${encodeURIComponent(
                            parent.catSlug
                          )}`}
                          className="group inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white transition-all hover:border-white hover:bg-white hover:text-slate-900"
                        >
                          <span>مشاهده همه</span>
                          <ArrowLeft className="h-2.5 w-2.5 transition-transform group-hover:-translate-x-0.5" />
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li className="text-[11px] text-slate-400">بدون زیردسته</li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          {/* نوار پایین: کپی‌رایت */}
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-4 sm:flex-row">
            <p className="text-center text-[11px] text-slate-300 sm:text-right">
              © {currentYear} کپی‌رایت، کلیه حقوق برای سامانه{" "}
              <strong className="font-bold text-white">استخدام‌پرو</strong> محفوظ است.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}