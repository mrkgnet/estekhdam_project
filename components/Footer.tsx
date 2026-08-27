"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Home,
  BookOpen,
  Instagram,
  Send,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";

/* ----------------------------------
 * تنظیمات و ثابت‌ها
 * ---------------------------------- */

const EITAA_URL = "https://eitaa.com/estekhdampro";
const TELEGRAM_URL = "#";
const INSTAGRAM_URL = "#";

/* ----------------------------------
 * کامپوننت دکمه بازگشت به بالا
 * ---------------------------------- */

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      aria-label="بازگشت به بالا"
      className={`fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full
        bg-emerald-500 hover:bg-emerald-600
        text-white flex items-center justify-center
        shadow-lg shadow-emerald-500/30
        transition-all duration-300
        ${
          visible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}

/* ----------------------------------
 * کامپوننت اصلی فوتر
 * ---------------------------------- */

export default function Footer() {
  return (
    <>
      <ScrollToTop />

      {/* فوتر ساده - بدون موج */}
      <footer
        dir="rtl"
        className="w-full bg-[#3A4D56] text-white font-sans mt-4"
      >
        {/* ----------------------------------
         * محتوای اصلی فوتر
         * ---------------------------------- */}

        <div className="mx-auto max-w-7xl px-6 pt-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-right items-start">
            {/* ----------------------------------
             * ستون برند
             * ---------------------------------- */}

            <div className="lg:col-span-4 flex flex-col gap-4">
              <h3 className="text-xl font-black text-white">
                استخدام‌پرو
              </h3>

              <p className=" leading-7 text-slate-200 max-w-sm">
                شیوه نوین برای مطالعه دروس استخدامی. ارائه‌دهنده جامع‌ترین
                منابع آزمون‌های سراسری و اختصاصی.
              </p>
            </div>

            {/* ----------------------------------
             * ستون پیوندها
             * ---------------------------------- */}

            <div className="lg:col-span-2 flex flex-col gap-4">
              <h4 className="text-base font-bold text-white border-r-4 border-emerald-400 pr-2">
                پیوندها
              </h4>

              <ul className="grid grid-cols-1 gap-2.5  text-slate-200">
                <li>
                  <Link
                    href="/"
                    className="hover:text-emerald-400 transition flex items-center gap-1.5"
                  >
                    <Home className="h-3.5 w-3.5" />
                    خانه
                  </Link>
                </li>

                <li>
                  <Link
                    href="/resources/main-resource"
                    className="hover:text-emerald-400 transition flex items-center gap-1.5"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    بانک سوالات
                  </Link>
                </li>

                <li>
                  <Link
                    href="/resources/main-resource"
                    className="hover:text-emerald-400 transition flex items-center gap-1.5"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    دفترچه‌های استخدامی
                  </Link>
                </li>

                <li>
                  <Link
                    href="/plans"
                    className="hover:text-emerald-400 transition flex items-center gap-1.5"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    خرید اشتراک
                  </Link>
                </li>
              </ul>
            </div>

            {/* ----------------------------------
             * ستون منابع رایگان
             * ---------------------------------- */}

            <div className="lg:col-span-3 flex flex-col gap-4">
              <h4 className="text-base font-bold text-white border-r-4 border-emerald-400 pr-2">
                منابع رایگان
              </h4>

              <ul className="grid grid-cols-1 gap-2.5  text-slate-200">
                <li>
                  <Link
                    href="/resources/free-resources"
                    className="hover:text-emerald-400 transition flex items-center gap-1.5"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    نمونه سوالات رایگان
                  </Link>
                </li>

                <li>
                  <Link
                    href="/resources/free-resources"
                    className="hover:text-emerald-400 transition flex items-center gap-1.5"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    دفترچه‌های رایگان
                  </Link>
                </li>
              </ul>
            </div>

            {/* ----------------------------------
             * ستون نشان‌های اعتماد
             * ---------------------------------- */}

            <div className="lg:col-span-3 flex justify-center lg:justify-end">
              <FooterTrustBadges />
            </div>
          </div>

          {/* ----------------------------------
           * نوار پایین
           * ---------------------------------- */}

          <div className="mt-10 rounded-2xl bg-[#24333A] p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700/30 shadow-inner">
            {/* کپی‌رایت */}

            <div className="text-xs text-slate-300 text-center md:text-right">
              © {new Date().getFullYear()} کپی‌رایت، کلیه حقوق برای سایت{" "}
              <span className="text-white font-bold">
                استخدام‌پرو
              </span>{" "}
              محفوظ است.
            </div>

            {/* ----------------------------------
             * شبکه‌های اجتماعی
             * ---------------------------------- */}

            <div className="flex flex-wrap items-center gap-2">
              {/* ایتا */}

              <a
                href={EITAA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#24333A] hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                aria-label="ایتا"
              >
                <span className="text-xs font-bold">
                  ایتا
                </span>
              </a>

              {/* تلگرام */}

              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#24333A] hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                aria-label="تلگرام"
              >
                <Send className="h-4 w-4" />
              </a>

              {/* اینستاگرام */}

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#24333A] hover:bg-pink-600 hover:text-white transition-all shadow-sm"
                aria-label="اینستاگرام"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ----------------------------------
 * کامپوننت نشان‌های اعتماد
 * ---------------------------------- */

export function FooterTrustBadges() {
  return (
    <div className="bg-white/95 rounded-2xl p-4 border border-slate-200/20 shadow-lg w-full max-w-[260px]">
      <h4 className="text-xs font-bold text-slate-800 mb-3 text-center">
        با خیال راحت خرید کنید
      </h4>

      <div className="grid grid-cols-2 gap-3 justify-center items-center">
        {/* ----------------------------------
         * اینماد
         * ---------------------------------- */}

        <a
          referrerPolicy="origin"
          target="_blank"
          rel="noopener noreferrer"
          href="https://trustseal.enamad.ir/?id=726282&Code=lFABKJYOh6iJxU0CU2uOAlIYw7gtwEnp"
          className="border border-slate-100 rounded-xl p-1 bg-slate-50 hover:bg-white transition-all shadow-sm flex items-center justify-center"
          aria-label="نشان اعتماد الکترونیکی"
        >
          <img
            referrerPolicy="origin"
            src="https://trustseal.enamad.ir/logo.aspx?id=726282&Code=lFABKJYOh6iJxU0CU2uOAlIYw7gtwEnp"
            alt="اینماد"
            className="w-16 h-16 object-contain mx-auto"
          />
        </a>

        {/* ----------------------------------
         * زرین‌پال
         * ---------------------------------- */}

        <div className="border border-slate-100 rounded-xl p-1 bg-slate-50 hover:bg-white transition-all shadow-sm flex items-center justify-center h-18">
          <Image
            src="/images/footer/zrinpal.png"
            alt="زرین‌پال"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}