// components/Footer.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import {
  Home,
  BookOpen,
  BriefcaseBusiness,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Phone,
  MapPin,
  ArrowUpLeft,
  Rss,
} from "lucide-react";

const WHATSAPP_URL = "https://eitaa.com/estekhdampro"; 
const SUPPORT_PHONE = "09134373234";
const ADDRESS = "چهارمحال و بختیاری - شهرستان فارسان - بلوار طبیعت بلوک سی 4 واحد 101";

export default function Footer() {
  return (
    <footer dir="rtl" className="relative overflow-hidden border-t bg-white font-sans">
      {/* soft background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.04),transparent_55%)]" />
      </div>

      {/* Top CTA */}
      <div className="relative flex flex-col md:flex-row justify-between gap-6 mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex-1 border border-slate-200 bg-white/80 p-5 backdrop-blur sm:p-6 rounded-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-bold text-blue-700 text-right">
                  فرصت‌های استخدامی + منابع آزمون‌ها، یکجا و همیشه به‌روز
                </div>
                <div className="mt-1 text-sm text-slate-600 text-right">
                  آگهی‌های جدید، زمان‌بندی آزمون‌ها، دفترچه‌ها و منابع مطالعاتی را سریع پیدا کن.
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row shrink-0">
              <Link
                href="/jobnews/government"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-900"
              >
                <BriefcaseBusiness className="h-4 w-4" />
                مشاهده فرصت‌های شغلی
                <ArrowUpLeft className="h-4 w-4 opacity-80" />
              </Link>

              <Link
                href="/resources/main-resource"
                className="inline-flex font-bold items-center bg-blue-600 justify-center gap-2 rounded-2xl border border-transparent px-5 py-3 text-sm text-white transition hover:bg-blue-700"
              >
                <BookOpen className="h-4 w-4" />
                آزمون‌ها و منابع بروز
              </Link>
            </div>

          </div>
          
          {/* quick chips */}
          <div className="mt-4 flex flex-wrap gap-2 justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
              <Rss className="h-3.5 w-3.5 text-slate-400" /> آپدیت روزانه
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" /> منابع معتبر
            </span>
          </div>
        </div>

        {/* zarinpal and image */}
        <div className="shrink-0">
          <FooterTrustBadges />
        </div>
      </div>

      {/* Main */}
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 text-right">
          
          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm font-black">
                  <span>پرو</span>
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">استخدام‌پرو</div>
                  <div className="text-xs text-slate-500 font-medium">مرجع تخصصی آزمون‌ها و فرصت‌های شغلی</div>
                </div>
              </div>

              <p className="mt-4 text-xs md:text-sm leading-7 text-slate-600">
                استخدام‌پرو، مرجع تخصصی شما برای موفقیت در آزمون‌های استخدامی و یافتن بهترین
                فرصت‌های شغلی است. ما به‌روزترین آگهی‌ها و معتبرترین منابع را در اختیار شما
                قرار می‌دهیم.
              </p>

              {/* آدرس رسمی */}
              <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-6">{ADDRESS}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-2.5 text-center shadow-sm">
                <div className="text-[11px] text-slate-400 font-medium">ویژگی</div>
                <div className="mt-0.5 text-xs font-bold text-slate-800">به‌روز</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-2.5 text-center shadow-sm">
                <div className="text-[11px] text-slate-400 font-medium">تمرکز</div>
                <div className="mt-0.5 text-xs font-bold text-slate-800">تخصصی</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-2.5 text-center shadow-sm">
                <div className="text-[11px] text-slate-400 font-medium">منابع</div>
                <div className="mt-0.5 text-xs font-bold text-slate-800">معتبر</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-4">
            <div className="text-sm font-bold text-slate-900 mb-4">دسترسی سریع</div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="group inline-flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="inline-flex items-center gap-2 font-medium text-xs md:text-sm">
                    <Home className="h-4 w-4 text-slate-400" />
                    خانه
                  </span>
                  <ArrowUpLeft className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </Link>
              </li>

              <li>
                <Link
                  href="/jobnews/government"
                  className="group inline-flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="inline-flex items-center gap-2 font-medium text-xs md:text-sm">
                    <BriefcaseBusiness className="h-4 w-4 text-slate-400" />
                    فرصت‌های شغلی
                  </span>
                  <ArrowUpLeft className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </Link>
              </li>

              <li>
                <Link
                  href="/resources"
                  className="group inline-flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-2.5 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="inline-flex items-center gap-2 font-medium text-xs md:text-sm">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    آزمون‌ها و منابع
                  </span>
                  <ArrowUpLeft className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-4">
            <div className="text-sm font-bold text-slate-900 mb-4">پشتیبانی و ارتباط</div>

            <div className="space-y-3">
              {/* دکمه تماس مستقیم تلفنی */}
              <a
                href={`tel:${SUPPORT_PHONE}`}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white shadow-sm shrink-0">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">تماس تلفنی مستقیم</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{SUPPORT_PHONE}</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors">تماس بگیر</span>
              </a>

              {/* دکمه پیام‌رسان ایتا */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shrink-0">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">پشتیبانی ایتا</div>
                    <div className="text-xs text-slate-500 mt-0.5">پاسخگویی سریع و آنلاین</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors">چت کن</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="relative border-t bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>© {new Date().getFullYear()} استخدام‌پرو — تمام حقوق محفوظ است.</div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-500">به‌روز</span>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-500">منابع معتبر</span>
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-500">پشتیبانی سریع</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FooterTrustBadges() {
  return (
    <div className="font-bold bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm w-full md:w-auto">
      <h4 className="text-xs md:text-sm text-slate-700 mb-3 text-right">با خیال راحت خرید کنید</h4>

      <div className="flex sm:grid sm:grid-cols-2 gap-4 max-w-xs justify-center items-center">
        <a
          referrerPolicy="origin"
          target="_blank"
          rel="noreferrer"
          href="https://trustseal.enamad.ir/?id=726282&Code=lFABKJYOh6iJxU0CU2uOAlIYw7gtwEnp"
          className="border border-slate-100 rounded-xl p-1 bg-slate-50/50 hover:bg-white transition-colors"
        >
          <img
            referrerPolicy="origin"
            src="https://trustseal.enamad.ir/logo.aspx?id=726282&Code=lFABKJYOh6iJxU0CU2uOAlIYw7gtwEnp"
            alt="اینماد"
            className="w-20 h-20 object-contain mx-auto"
            style={{ cursor: "pointer" }}
          />
        </a>

        <div className="border border-slate-100 rounded-xl p-1 bg-slate-50/50 hover:bg-white transition-colors flex items-center justify-center">
          <Image
            src="/images/footer/zrinpal.png"
            alt="زرین‌پال"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}