
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
} from "lucide-react";

/* ----------------------------------
 * ثابت‌ها و لینک‌ها
 * ---------------------------------- */

const EITAA_URL = "https://eitaa.com/estekhdampro";
const TELEGRAM_URL = "https://t.me/your_channel"; // جایگزین با آدرس واقعی
const INSTAGRAM_URL = "https://instagram.com/your_page"; // جایگزین با آدرس واقعی

const ENAMAD_URL =
  "https://trustseal.enamad.ir/?id=726282&Code=lFABKJYOh6iJxU0CU2uOAlIYw7gtwEnp";

const ENAMAD_IMG =
  "https://trustseal.enamad.ir/logo.aspx?id=726282&Code=lFABKJYOh6iJxU0CU2uOAlIYw7gtwEnp";

/* ----------------------------------
 * زیرآیتم‌های بانک سوالات
 *
 * برای اضافه کردن آیتم جدید فقط
 * یک object جدید به این آرایه اضافه کن.
 * ---------------------------------- */

const QUESTION_BANK_ITEMS = [
  {
    title: " آموزش و پرورش",
    href: "/resources/main-resource?category=بانک-سوالات-آموزش-و-پرورش",
  },
  {
    title: " دستگاه‌های اجرایی",
    href: "/resources/question-bank/executive",
  },
  {
    title: "بانک‌ها",
    href: "/resources/question-bank/banks",
  },
  {
    title: "وزارت بهداشت",
    href: "/resources/question-bank/health",
  },
];

/* ----------------------------------
 * زیرآیتم‌های دفترچه‌های استخدامی
 *
 * برای اضافه کردن آیتم جدید فقط
 * یک object جدید به این آرایه اضافه کن.
 * ---------------------------------- */

const BOOKLET_ITEMS = [
  {
    title: "آموزش و پرورش",
    href: "/resources/booklets/education",
  },
  {
    title: " دستگاه‌های اجرایی",
    href: "/resources/booklets/executive",
  },
  {
    title: "بانک‌ها",
    href: "/resources/booklets/banks",
  },
  {
    title: " وزارت بهداشت",
    href: "/resources/booklets/health",
  },
];

/* ----------------------------------
 * کامپوننت دکمه شناور بازگشت به بالا
 * ---------------------------------- */

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      aria-label="بازگشت به بالای صفحه"
      className="fixed bottom-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
    >
      <ChevronUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}

/* ----------------------------------
 * دکمه وسط‌چین بازگشت به بالا
 * ---------------------------------- */

function ScrollToTopBanner() {
  return (
    <div className="flex justify-center border-b border-white/10 bg-slate-600 py-4">
      <button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        <ChevronUp className="h-4 w-4" aria-hidden="true" />

        <span className="border-b border-transparent pb-0.5 hover:border-white">
          بازگشت به بالا
        </span>
      </button>
    </div>
  );
}

/* ----------------------------------
 * کامپوننت نشان‌های اعتماد
 *
 * اینماد و زرین‌پال عمودی و زیر هم
 * ---------------------------------- */

export function FooterTrustBadges() {
  return (
    <div className="w-full max-w-[220px] rounded-2xl border border-slate-200/20 bg-white/95 p-3 shadow-lg">
      <p className="mb-3 text-center text-xs font-bold text-slate-800">
        با خیال راحت خرید کنید
      </p>

      <div className="flex flex-col items-center gap-3">
        {/* اینماد */}

        <a
          href={ENAMAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="origin"
          aria-label="نماد اعتماد الکترونیکی"
          className="flex h-[76px] w-full items-center justify-center rounded-xl bg-slate-50 p-1.5 shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ENAMAD_IMG}
            alt="نماد اعتماد الکترونیکی اینماد"
            width={64}
            height={64}
            className="h-16 w-16 object-contain"
            loading="lazy"
          />
        </a>

        {/* زرین‌پال */}

        <div className="flex h-[76px] w-full items-center justify-center rounded-xl bg-slate-50 p-1.5 shadow-sm">
          <Image
            src="/images/footer/zrinpal.png"
            alt="نشان پرداخت امن زرین‌پال"
            width={64}
            height={64}
            className="h-16 w-16 object-contain"
          />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------
 * کامپوننت اصلی فوتر
 * ---------------------------------- */

export default function Footer() {
  const currentYear = 1403;

  return (
    <>
      <ScrollToTopButton />

      <footer
        dir="rtl"
        className="mt-4 w-full bg-[#3A4D56] font-sans text-white"
      >
        <ScrollToTopBanner />

        {/* ----------------------------------
         * محتوای اصلی فوتر
         * ---------------------------------- */}

        <div className="mx-auto w-full max-w-7xl px-4 pb-6 pt-8 sm:px-6">
          <div className="grid grid-cols-2 items-start gap-x-6 gap-y-10 text-right sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-6">

            {/* ----------------------------------
             * ستون برند
             * ---------------------------------- */}

            <div className="flex min-w-0 flex-col gap-4 sm:col-span-2 lg:col-span-3">
              <span className="text-xl font-black text-white">
                استخدام‌پرو
              </span>

              <p className="max-w-sm text-sm leading-7 text-slate-200">
                شیوه نوین برای مطالعه دروس استخدامی. ارائه‌دهنده جامع‌ترین
                منابع آزمون‌های سراسری و اختصاصی.
              </p>
            </div>

            {/* ----------------------------------
             * ستون پیوندها
             * ---------------------------------- */}

            <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
              <h3 className="border-r-4 border-emerald-400 pr-2 text-base font-bold text-white">
                پیوندها
              </h3>

              <ul className="grid grid-cols-1 gap-2.5 text-sm text-slate-200">
                <li>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5"
                  >
                    <Home
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />

                    <span className="border-b border-transparent pb-0.5 hover:border-white">
                      خانه
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/plans"
                    className="inline-flex items-center gap-1.5"
                  >
                    <BookOpen
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />

                    <span className="border-b border-transparent pb-0.5 hover:border-white">
                      خرید اشتراک
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/resources/free-questions"
                    className="inline-flex items-center gap-1.5"
                  >
                    <BookOpen
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />

                    <span className="border-b border-transparent pb-0.5 hover:border-white">
                      نمونه سوالات رایگان
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/resources/free-booklets"
                    className="inline-flex items-center gap-1.5"
                  >
                    <BookOpen
                      className="h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />

                    <span className="border-b border-transparent pb-0.5 hover:border-white">
                      دفترچه‌های رایگان
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* ----------------------------------
             * ستون بانک سوالات
             *
             * خط عمودی dashed برای مشخص کردن
             * ارتباط دسته با زیرآیتم‌ها
             * ---------------------------------- */}

            <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
              <h3 className="border-r-4 border-emerald-400 pr-2 text-base font-bold text-white">
                بانک سوالات
              </h3>

              <ul className="relative mr-1 flex flex-col gap-2.5 border-r border-dashed border-slate-400/60 pr-4 text-sm text-slate-200">
                {QUESTION_BANK_ITEMS.map((item, index) => (
                  <li
                    key={`${item.href}-${index}`}
                    className="relative min-w-0"
                  >
                    {/* اتصال کوچک زیرآیتم به خط اصلی */}

                    <span
                      aria-hidden="true"
                      className="absolute right-[-17px] top-[10px] h-px w-3 border-t border-dashed border-slate-400/60"
                    />

                    <Link
                      href={item.href}
                      className="inline-flex max-w-full items-start gap-1.5"
                    >
                      <BookOpen
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />

                      <span className="break-words border-b border-transparent pb-0.5 hover:border-white">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ----------------------------------
             * ستون دفترچه‌های استخدامی
             *
             * خط عمودی dashed برای مشخص کردن
             * ارتباط دسته با زیرآیتم‌ها
             * ---------------------------------- */}

            <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
              <h3 className="border-r-4 border-emerald-400 pr-2 text-base font-bold text-white">
                دفترچه‌های استخدامی
              </h3>

              <ul className="relative mr-1 flex flex-col gap-2.5 border-r border-dashed border-slate-400/60 pr-4 text-sm text-slate-200">
                {BOOKLET_ITEMS.map((item, index) => (
                  <li
                    key={`${item.href}-${index}`}
                    className="relative min-w-0"
                  >
                    {/* اتصال کوچک زیرآیتم به خط اصلی */}

                    <span
                      aria-hidden="true"
                      className="absolute right-[-17px] top-[10px] h-px w-3 border-t border-dashed border-slate-400/60"
                    />

                    <Link
                      href={item.href}
                      className="inline-flex max-w-full items-start gap-1.5"
                    >
                      <BookOpen
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />

                      <span className="break-words border-b border-transparent pb-0.5 hover:border-white">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ----------------------------------
             * ستون نشان‌های اعتماد
             * ---------------------------------- */}

            <div className="flex min-w-0 justify-center lg:col-span-3 lg:justify-end">
              <FooterTrustBadges />
            </div>
          </div>

          {/* ----------------------------------
           * نوار پایین
           * ---------------------------------- */}

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-700/30 bg-[#24333A] p-4 shadow-inner md:flex-row">

            {/* کپی‌رایت */}

            <p className="text-center text-sm leading-6 text-slate-300 md:text-right">
              © {currentYear} کپی‌رایت، کلیه حقوق برای سایت{" "}
              <strong className="font-bold text-white">
                استخدام‌پرو
              </strong>{" "}
              محفوظ است.
            </p>

            {/* شبکه‌های اجتماعی */}

            <div className="flex flex-wrap items-center justify-center gap-4">

              {/* ایتا */}

              <a
                href={EITAA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white"
                aria-label="کانال ایتا"
              >
                <span className="border-b border-transparent pb-0.5 text-xs font-bold hover:border-white">
                  ایتا
                </span>
              </a>

              {/* تلگرام */}

              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white"
                aria-label="کانال تلگرام"
              >
                <Send
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span className="border-b border-transparent pb-0.5 text-xs hover:border-white">
                  تلگرام
                </span>
              </a>

              {/* اینستاگرام */}

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white"
                aria-label="صفحه اینستاگرام"
              >
                <Instagram
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span className="border-b border-transparent pb-0.5 text-xs hover:border-white">
                  اینستاگرام
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

