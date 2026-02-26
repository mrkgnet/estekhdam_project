// components/Footer.tsx
import Link from "next/link";
import {
  Home,
  Search,
  BookOpen,
  BriefcaseBusiness,
  FileText,
  ShieldCheck,
  Sparkles,
  Send,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ArrowUpLeft,
  Rss,
} from "lucide-react";

const TELEGRAM_URL = "https://t.me/YourTelegramID";
const WHATSAPP_URL = "https://wa.me/989123456789"; // 989... بدون +
const SUPPORT_PHONE = "09123456789";
const SUPPORT_EMAIL = "support@example.com";

export default function Footer() {
  return (
    <footer dir="rtl" className="relative overflow-hidden border-t bg-white ">
      {/* soft background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.04),transparent_55%)]" />
      </div>

      {/* Top CTA */}
      <div className="relative mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-extrabold text-slate-900">
                  فرصت‌های استخدامی + منابع آزمون‌ها، یکجا و همیشه به‌روز
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  آگهی‌های جدید، زمان‌بندی آزمون‌ها، دفترچه‌ها و منابع مطالعاتی را سریع پیدا کن.
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800"
              >
                <BriefcaseBusiness className="h-4 w-4" />
                مشاهده فرصت‌های شغلی
                <ArrowUpLeft className="h-4 w-4 opacity-80" />
              </Link>

              <Link
                href="/recruitment-government-agencies"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
              >
                <BookOpen className="h-4 w-4" />
                آزمون‌ها و منابع
              </Link>
            </div>
          </div>

          {/* quick chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
              <Rss className="h-3.5 w-3.5" /> آپدیت روزانه
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5" /> منابع معتبر
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700">
              <Search className="h-3.5 w-3.5" /> جستجوی سریع
            </span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <span className="text-sm font-extrabold">JOB</span>
              </div>
              <div>
                <div className="text-lg font-extrabold text-slate-900">BazareHoosh</div>
                <div className="text-xs text-slate-500">
                  کاریابی • استخدام • آزمون‌ها • منابع و دفترچه‌ها
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              اینجا همه چیز برای مسیر شغلی‌ات آماده است: از پیدا کردن فرصت‌های استخدامی تا
              دنبال کردن زمان‌بندی آزمون‌ها و دانلود منابع مطالعاتی.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                <div className="text-xs text-slate-500">ویژگی</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">به‌روز</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                <div className="text-xs text-slate-500">تمرکز</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">استخدام</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                <div className="text-xs text-slate-500">منابع</div>
                <div className="mt-1 text-sm font-extrabold text-slate-900">معتبر</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <div className="text-sm font-extrabold text-slate-900">دسترسی سریع</div>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="group inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    خانه
                  </span>
                  <ArrowUpLeft className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                </Link>
              </li>

              <li>
                <Link
                  href="/jobs"
                  className="group inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <BriefcaseBusiness className="h-4 w-4" />
                    فرصت‌های شغلی
                  </span>
                  <ArrowUpLeft className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                </Link>
              </li>

              <li>
                <Link
                  href="/recruitment-government-agencies"
                  className="group inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    آزمون‌ها و منابع
                  </span>
                  <ArrowUpLeft className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                </Link>
              </li>

              <li>
                <Link
                  href="/resume-builder"
                  className="group inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    رزومه‌ساز
                  </span>
                  <ArrowUpLeft className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <div className="text-sm font-extrabold text-slate-900">منابع محبوب</div>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  دفترچه‌ها و اصلاحیه‌ها
                </div>
                <div className="mt-1 text-xs text-slate-500">دسترسی سریع به فایل‌ها</div>
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  نمونه سوالات
                </div>
                <div className="mt-1 text-xs text-slate-500">مرتب‌شده بر اساس آزمون</div>
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  شرایط و مدارک
                </div>
                <div className="mt-1 text-xs text-slate-500">چک‌لیست آماده‌سازی</div>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3">
            <div className="text-sm font-extrabold text-slate-900">پشتیبانی</div>

            <div className="mt-4 space-y-3">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500 text-white">
                    <Send className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">تلگرام</div>
                    <div className="text-xs text-slate-500">پشتیبانی مستقیم</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">پیام بده</span>
              </a>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">واتساپ</div>
                    <div className="text-xs text-slate-500">پاسخگویی سریع</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">چت کن</span>
              </a>

              <div className="grid gap-1 sm:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="h-4 w-4" />
                    تماس
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900">{SUPPORT_PHONE}</div>
                </div>

                
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="h-4 w-4" />
                  مرکز کمک
                </div>
                <div className="mt-1 text-sm text-slate-700">
                  سوالات متداول و راهنمای استفاده از سایت
                </div>
                <Link href="/help" className="mt-2 inline-flex text-sm font-extrabold text-slate-900 hover:underline">
                  مشاهده راهنما
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative border-t bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>© {new Date().getFullYear()} BazareHoosh — تمام حقوق محفوظ است.</div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-2 py-1">به‌روز</span>
            <span className="rounded-full border border-slate-200 bg-white px-2 py-1">منابع معتبر</span>
            <span className="rounded-full border border-slate-200 bg-white px-2 py-1">پشتیبانی سریع</span>
          </div>
        </div>
      </div>
    </footer>
  );
}