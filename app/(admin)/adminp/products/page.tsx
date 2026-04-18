import React from 'react';
import Link from 'next/link';

export default function ProductsDashboardPage() {
  return (
    <div className=" bg-gray-50 flex flex-col items-center justify-center p-6" dir="rtl">
      
      {/* عنوان بالای صفحه */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-black text-gray-800 mb-3">مدیریت محصولات</h1>
        <p className="text-gray-500 text-lg">لطفاً یکی از بخش‌های زیر را برای ادامه انتخاب کنید</p>
      </div>

      {/* نگهدارنده کارت‌ها (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* کارت 1: افزودن محصول */}
        <Link 
          href="./products/government/addproduct"
          className="group bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* افکت پس‌زمینه موقع هاور */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* آیکون */}
          <div className="relative w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          
          {/* متن */}
          <h2 className="relative text-2xl font-bold text-gray-800 mb-4">افزودن محصول جدید</h2>
          <p className="relative text-gray-500 leading-relaxed">
            ثبت محصول جدید در سیستم شامل نام، قیمت، تصاویر و دسته‌بندی‌ها.
          </p>
          
          {/* دکمه راهنما (ظاهری) */}
          <div className="relative mt-8 text-blue-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
            ورود به بخش
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </div>
        </Link>

        {/* کارت 2: ویرایش محصولات */}
        {/* آدرس لینک زیر را به صفحه‌ای که لیست محصولات برای ویرایش در آن است تغییر دهید */}
        <Link 
          href="./products/government/editproduct" 
          className="group bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* افکت پس‌زمینه موقع هاور */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* آیکون */}
          <div className="relative w-24 h-24 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          
          {/* متن */}
          <h2 className="relative text-2xl font-bold text-gray-800 mb-4">ویرایش محصولات</h2>
          <p className="relative text-gray-500 leading-relaxed">
            مشاهده لیست تمامی محصولات ثبت شده، ویرایش اطلاعات یا حذف آن‌ها.
          </p>

          {/* دکمه راهنما (ظاهری) */}
          <div className="relative mt-8 text-amber-600 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
            ورود به بخش
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </div>
        </Link>

      </div>
    </div>
  );
}
