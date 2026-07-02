// components/Footer.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import {
  Home,
  BookOpen,
  BriefcaseBusiness,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Send, // برای تلگرام
} from "lucide-react";

const WHATSAPP_URL = "https://eitaa.com/estekhdampro"; 
const SUPPORT_PHONE = "09134373234";
const ADDRESS = "چهارمحال و بختیاری - شهرستان فارسان - بلوار طبیعت بلوک سی 4 واحد 101";

export default function Footer() {
  return (
    <footer dir="rtl" className="relative w-full bg-[#3A4D56] text-white font-sans mt-12">
      
      {/* بخش موج‌دار بالای فوتر */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-[99%]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px] fill-[#3A4D56]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,4.75,55.05,12.72,83.93,20.26,179.91,45.4,228.4,66.82,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* محتوای اصلی فوتر */}
      <div className="mx-auto max-w-7xl px-6 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 text-right items-start">
          
          {/* ستون اول (راست): لوگو و معرفی برند */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {/* <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#3A4D56] shadow-md font-black text-xl">
                <span>پرو</span>
              </div> */}
              <div>
                <h3 className="text-xl font-black text-white">استخدام‌پرو</h3>
                {/* <p className="text-xs text-slate-300 font-medium mt-1">مرجع تخصصی آزمون‌ها و فرصت‌های شغلی</p> */}
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-200 max-w-sm">
              شیوه نوین برای مطالعه دروس استخدامی 
            </p>
          </div>

          {/* ستون دوم: ارتباط با ما */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-base font-bold text-white border-r-4 border-emerald-400 pr-2">ارتباط با ما</h4>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <a href={`tel:${SUPPORT_PHONE}`} className="dir-ltr font-mono hover:text-white transition">
                  {SUPPORT_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="hover:text-white transition">info@estekhdam.pro</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-1" />
                <span className="leading-6 text-xs">{ADDRESS}</span>
              </li>
            </ul>
          </div>

          {/* ستون سوم: دسترسی سریع / پیوندها */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-base font-bold text-white border-r-4 border-emerald-400 pr-2">پیوندها</h4>
            <ul className="grid grid-cols-1 gap-2.5 text-sm text-slate-200">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5" /> خانه
                </Link>
              </li>
              <li>
                <Link href="/jobnews/government" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <BriefcaseBusiness className="h-3.5 w-3.5" /> فرصت‌های شغلی
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> آزمون‌ها و منابع
                </Link>
              </li>
            </ul>
          </div>

          {/* ستون چهارم (چپ): اینماد و مجوزها */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <FooterTrustBadges />
          </div>

        </div>

        {/* نوار پایین کپسولی (مشابه تصویر الگو) */}
        <div className="mt-12 rounded-2xl bg-[#24333A] p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-700/30 shadow-inner">
          
          {/* متن کپی رایت */}
          <div className="text-xs text-slate-300 text-center md:text-right">
            © {new Date().getFullYear()} کپی‌رایت، کلیه حقوق برای سایت <span className="text-white font-bold">استخدام‌پرو</span> محفوظ است.
          </div>

          {/* شبکه‌های اجتماعی پیاده‌سازی شده بر اساس آیکون‌های گرد در تصویر */}
          <div className="flex flex-wrap items-center gap-2">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#24333A] hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
              <span className="text-xs font-bold">ایتا</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#24333A] hover:bg-sky-500 hover:text-white transition-all shadow-sm">
              <Send className="h-4 w-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#24333A] hover:bg-pink-600 hover:text-white transition-all shadow-sm">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#24333A] hover:bg-blue-700 hover:text-white transition-all shadow-sm">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#24333A] hover:bg-sky-400 hover:text-white transition-all shadow-sm">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#24333A] hover:bg-blue-600 hover:text-white transition-all shadow-sm">
              <Facebook className="h-4 w-4" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}

export function FooterTrustBadges() {
  return (
    <div className="bg-white/95 rounded-2xl p-4 border border-slate-200/20 shadow-lg w-full max-w-[260px]">
      <h4 className="text-xs font-bold text-slate-800 mb-3 text-center">با خیال راحت خرید کنید</h4>

      <div className="grid grid-cols-2 gap-3 justify-center items-center">
        <a
          referrerPolicy="origin"
          target="_blank"
          rel="noreferrer"
          href="https://trustseal.enamad.ir/?id=726282&Code=lFABKJYOh6iJxU0CU2uOAlIYw7gtwEnp"
          className="border border-slate-100 rounded-xl p-1 bg-slate-50 hover:bg-white transition-all shadow-sm flex items-center justify-center"
        >
          <img
            referrerPolicy="origin"
            src="https://trustseal.enamad.ir/logo.aspx?id=726282&Code=lFABKJYOh6iJxU0CU2uOAlIYw7gtwEnp"
            alt="اینماد"
            className="w-16 h-16 object-contain mx-auto"
            style={{ cursor: "pointer" }}
          />
        </a>

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