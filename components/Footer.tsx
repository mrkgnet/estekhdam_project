// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
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

// TODO: لطفا اطلاعات تماس واقعی خود را جایگزین کنید
const TELEGRAM_URL = "https://t.me/YourTelegramID";
const WHATSAPP_URL = "https://wa.me/989123456789"; // فرمت صحیح: 989...
const SUPPORT_PHONE = "09123456789";
const SUPPORT_EMAIL = "support@estekhdampro.ir"; // ایمیل با دامنه جدید

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
      <div className="relative flex-col md:flex  justify-between mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className=" border border-slate-200 bg-white/80 p-5  backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base  text-blue-700">
                  فرصت‌های استخدامی + منابع آزمون‌ها، یکجا و همیشه به‌روز
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  آگهی‌های جدید، زمان‌بندی آزمون‌ها، دفترچه‌ها و منابع مطالعاتی را سریع پیدا کن.
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/jobnews/government"
                className="inline-flex items-center text-12 sm:text-13 lg:text-13 justify-center gap-2 rounded-2xl bg-blue-900 px-5 py-3  text-white transition "
              >
                <BriefcaseBusiness className="h-4 w-4" />
                مشاهده فرصت‌های شغلی
                <ArrowUpLeft className="h-4 w-4 opacity-80" />
              </Link>

              <Link
                href="/resources"
                className="inline-flex font-bold items-center text-12 sm:text-13 lg:text-13 bg-blue-800 justify-center gap-2 rounded-2xl border border-slate-200  px-5 py-3   text-white transition "
              >
                <BookOpen className="h-4 w-4" />
                آزمون‌ها و منابع بروز
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

          </div>


        </div>

        {/*zarinpal and image  */}

        <div className="">
          <FooterTrustBadges />
        </div>
      </div>
      {/* Main */}
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm">
                {/* تغییر لوگو */}
                <span className="text-sm ">پرو</span>
              </div>
              <div>
                {/* تغییر نام برند */}
                <div className="text-lg  text-slate-900">استخدام‌پرو</div>
                {/* تغییر شعار */}
                <div className="text-xs text-slate-500">
                  مرجع تخصصی آزمون‌ها و فرصت‌های شغلی
                </div>
              </div>
            </div>

            {/* تغییر متن توضیحات */}
            <p className="mt-4 text-sm leading-7 text-slate-600">
              استخدام‌پرو، مرجع تخصصی شما برای موفقیت در آزمون‌های استخدامی و یافتن بهترین
              فرصت‌های شغلی است. ما به‌روزترین آگهی‌ها و معتبرترین منابع را در اختیار شما
              قرار می‌دهیم.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                <div className="text-xs text-slate-500">ویژگی</div>
                <div className="mt-1 text-sm  text-slate-900">به‌روز</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                <div className="text-xs text-slate-500">تمرکز</div>
                <div className="mt-1 text-sm  text-slate-900">تخصصی</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
                <div className="text-xs text-slate-500">منابع</div>
                <div className="mt-1 text-sm  text-slate-900">معتبر</div>
              </div>
            </div>


            {/* E-namad */}

          </div>

          {/* Quick Links */}
          <div className="lg:col-span-4">
            <div className="text-sm  text-slate-900">دسترسی سریع</div>
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
                  href="/jobnews/government"
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
                  href="/resources"
                  className="group inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    آزمون‌ها و منابع
                  </span>
                  <ArrowUpLeft className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                </Link>
              </li>


            </ul>
          </div>



          {/* Support */}
          <div className="lg:col-span-4">
            <div className="text-sm  text-slate-900">پشتیبانی</div>

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
                    <div className="text-sm  text-slate-900">تلگرام</div>
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
                    <div className="text-sm  text-slate-900">ایتا</div>
                    <div className="text-xs text-slate-500">پاسخگویی سریع</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">چت کن</span>
              </a>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Phone className="h-4 w-4" />
                  تماس تلفنی
                </div>
                <div className="mt-1 text-sm  text-slate-900">{SUPPORT_PHONE}</div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="h-4 w-4" />
                  مرکز کمک
                </div>
                <div className="mt-1 text-sm text-slate-700">
                  سوالات متداول و راهنمای استفاده از سایت
                </div>
                <Link href="/help" className="mt-2 inline-flex text-sm  text-slate-900 hover:underline">
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
          {/* تغییر کپی رایت */}
          <div>© {new Date().getFullYear()} استخدام‌پرو — تمام حقوق محفوظ است.</div>

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


export function FooterTrustBadges() {
  return (
    <div className="mt-4 md:mt-0 font-bold bg-white rounded-lg p-3.5">
      <h4 className="text-sm text-slate-700 mb-2">با خیال راحت خرید کنید</h4>

      <div className="grid grid-cols-2 gap-4 max-w-xs justify-center items-center ">


        <a
          referrerPolicy="origin"
          target="_blank"
          rel="noreferrer"
          href="https://trustseal.enamad.ir/?id=726282&Code=lFABKJYOh6iJxU0CU2uOAlIYw7gtwEnp"
        >
          <img
            referrerPolicy="origin"
            src="https://trustseal.enamad.ir/logo.aspx?id=726282&Code=lFABKJYOh6iJxU0CU2uOAlIYw7gtwEnp"
            alt="اینماد"
            style={{ cursor: "pointer" }}
          />
        </a>







        <Image
          src="/images/footer/zrinpal.png"
          alt="زرین‌پال"
          width={140}
          height={140}
          className=""
        />
      </div>
    </div>
  );
}