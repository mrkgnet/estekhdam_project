'use client'


import React, { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // اضافه کردن ایمپورت Link
import toast from 'react-hot-toast';
import { addTicketUserAction } from '@/actions/user/dashboard/support/addTicket/Actions';

export default function NewTicketPage() {
  const router = useRouter();
  
  // استفاده از هوک مدرن ریکت برای مدیریت فرم‌های سمت سرور
  const [state, formAction, isPending] = useActionState(addTicketUserAction, null);

  // بررسی وضعیت پس از اجرای اکشن
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      // router.push('/user/tickets'); // کاربر را به صفحه لیست تیکت‌ها هدایت می‌کنیم
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-gray-100 mt-10">
      
      {/* بخش بردکرامب (Breadcrumb) */}
      <nav className="flex mb-5 text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 space-x-reverse md:space-x-2">
          
          <li>
            <div className="flex items-center">
              {/* آیکون فلش (چپ) برای راست‌چین */}
              <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
              </svg>
              <Link href="/ddashboard" className="mr-1 hover:text-blue-600 transition-colors md:mr-2">
               پنل کاربری
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
              </svg>
              <span className="mr-1 font-medium text-gray-800 md:mr-2">ثبت تیکت جدید</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* هدر فرم */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h1 className="text-xl font-bold text-gray-800">ثبت تیکت پشتیبانی جدید</h1>
        <p className="text-sm text-gray-500 mt-1">لطفاً مشکل یا سوال خود را با جزئیات بنویسید تا در اسرع وقت پاسخ دهیم.</p>
      </div>

      {/* اتصال formAction به فرم */}
      <form action={formAction} className="space-y-5">
        
        {/* موضوع تیکت */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            موضوع تیکت <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            placeholder="مثال: مشکل در پرداخت سفارش"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          />
        </div>

        {/* اولویت */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            اولویت <span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
          >
            <option value="LOW">کم (سوالات عمومی)</option>
            <option value="MEDIUM">متوسط (نیاز به پیگیری عادی)</option>
            <option value="HIGH">زیاد (مشکلات فوری و قطعی)</option>
          </select>
        </div>

        {/* متن پیام */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            متن پیام <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder="توضیحات کامل مشکل یا درخواست خود را اینجا بنویسید..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-y"
          ></textarea>
        </div>

        {/* دکمه ارسال */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending} // استفاده از isPending به جای isSubmitting دستی
            className={`w-full md:w-auto px-8 py-2.5 rounded-lg text-white font-medium transition-all ${
              isPending 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200'
            }`}
          >
            {isPending ? 'در حال ارسال...' : 'ارسال تیکت'}
          </button>
        </div>

      </form>
    </div>
  )
}
