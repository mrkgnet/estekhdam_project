import React from 'react';
import Link from 'next/link';
import { Hammer, ArrowRight } from 'lucide-react';

export default function UnderConstructionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      
      {/* بخش آیکون با یک پس‌زمینه ملایم و انیمیشن ظریف */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
        <div className="relative bg-slate-100/80 p-5 rounded-full border border-slate-200/50 shadow-sm">
          <Hammer className="w-10 h-10 text-slate-500 animate-pulse" strokeWidth={1.5} />
        </div>
      </div>

      {/* تایپوگرافی و متن‌ها */}
      <h1 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">
        در حال تکمیل و بروزرسانی
      </h1>
      
      <p className="text-sm md:text-base text-slate-500 max-w-md leading-relaxed mb-8">
        این بخش از وب‌سایت در حال توسعه و بهبود است و به زودی با امکانات جدید در دسترس شما قرار خواهد گرفت. از شکیبایی شما متشکریم.
      </p>

      {/* دکمه بازگشت برای جلوگیری از بن‌بست شدن کاربر */}
      <Link 
        href="/" 
        className="group flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all duration-300 shadow-sm hover:shadow"
      >
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
        بازگشت به صفحه اصلی
      </Link>

    </div>
  );
}
