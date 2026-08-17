'use client'

import React, { useActionState, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { addTicketUserAction } from '@/actions/user/dashboard/support/addTicket/Actions';
import BackButton from '@/components/ui/BackButton';
import { AlertCircle } from 'lucide-react';

// تایپ برای خطاها
interface FormErrors {
  subject?: string;
  priority?: string;
  message?: string;
}

export default function NewTicketPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(addTicketUserAction, null);
  
  // 🟢 State برای خطاهای کلاینتی
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Refs برای فوکوس خودکار روی اولین فیلد خطادار
  const subjectRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      setErrors({});
      
      // 🟢 ریدایرکت به لیست تیکت‌ها بعد از ۱.۵ ثانیه (برای نمایش toast)
      const redirectTimer = setTimeout(() => {
        router.push('/ddashboard/support/tickets');
      }, 1000);
      
      // Cleanup timer در صورت unmount شدن کامپوننت
      return () => clearTimeout(redirectTimer);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state, router]);

  // 🟢 تابع اعتبارسنجی
  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {};
    
    const subject = (formData.get('subject') as string)?.trim();
    const priority = formData.get('priority') as string;
    const message = (formData.get('message') as string)?.trim();

    // اعتبارسنجی موضوع
    if (!subject) {
      newErrors.subject = 'لطفاً موضوع تیکت را وارد کنید';
    } else if (subject.length < 3) {
      newErrors.subject = 'موضوع باید حداقل ۳ کاراکتر باشد';
    } else if (subject.length > 100) {
      newErrors.subject = 'موضوع نباید بیشتر از ۱۰۰ کاراکتر باشد';
    }

    // اعتبارسنجی اولویت
    if (!priority) {
      newErrors.priority = 'لطفاً اولویت تیکت را انتخاب کنید';
    }

    // اعتبارسنجی پیام
    if (!message) {
      newErrors.message = 'لطفاً متن پیام را وارد کنید';
    } else if (message.length < 10) {
      newErrors.message = 'متن پیام باید حداقل ۱۰ کاراکتر باشد';
    } else if (message.length > 2000) {
      newErrors.message = 'متن پیام نباید بیشتر از ۲۰۰۰ کاراکتر باشد';
    }

    setErrors(newErrors);

    // اگر خطایی وجود دارد، فوکوس روی اولین فیلد خطادار
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.subject) {
        subjectRef.current?.focus();
      } else if (newErrors.priority) {
        priorityRef.current?.focus();
      } else if (newErrors.message) {
        messageRef.current?.focus();
      }
      return false;
    }

    return true;
  };

  // 🟢 هندلر ارسال فرم با اعتبارسنجی
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    
    if (!validateForm(formData)) {
      event.preventDefault();
      return;
    }
    
    // اگر معتبر بود، فرم به صورت عادی ارسال می‌شود (formAction اجرا می‌شود)
  };

  // 🟢 پاک کردن خطا هنگام تایپ کاربر
  const handleInputChange = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className='px-4'>
      <div className="max-w-2xl border-2 border-slate-300 mb-7 rounded-lg mx-auto p-4 md:p-5 bg-white shadow-sm mt-6">
        
        <div className="flex justify-end mb-3.5">
          <BackButton />
        </div>

        {/* بخش بردکرامب */}
        <nav className="flex mb-4 text-xs text-slate-500" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 space-x-reverse md:space-x-2">
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 mx-1 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                </svg>
                <Link href="/ddashboard" className="mr-1 hover:text-blue-600 transition-colors md:mr-2">
                  پنل کاربری
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 mx-1 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                </svg>
                <span className="mr-1 font-medium text-slate-800 md:mr-2">ثبت تیکت جدید</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* هدر فرم */}
        <div className="mb-5 border-b-2 border-slate-200 pb-3">
          <h1 className="text-base md:text-lg font-medium text-slate-800">ثبت تیکت پشتیبانی جدید</h1>
          <p className="text-xs text-slate-500 mt-1">لطفاً مشکل یا سوال خود را با جزئیات بنویسید تا در اسرع وقت پاسخ دهیم.</p>
        </div>

        {/* فرم با هندلر اعتبارسنجی */}
        <form action={formAction} onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* موضوع تیکت */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1.5">
              موضوع تیکت <span className="text-red-500">*</span>
            </label>
            <input
              ref={subjectRef}
              type="text"
              id="subject"
              name="subject"
              onChange={() => handleInputChange('subject')}
              placeholder="مثال: مشکل در پرداخت سفارش"
              className={`w-full px-4 py-2.5 bg-slate-50 border-2 rounded-md focus:ring-2 transition-all outline-none text-sm ${
                errors.subject
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/50'
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "subject-error" : undefined}
            />
            {errors.subject && (
              <div 
                id="subject-error"
                className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 animate-fadeIn"
                role="alert"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.subject}</span>
              </div>
            )}
          </div>

          {/* اولویت */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-1.5">
              اولویت <span className="text-red-500">*</span>
            </label>
            <select
              ref={priorityRef}
              id="priority"
              name="priority"
              defaultValue="MEDIUM"
              onChange={() => handleInputChange('priority')}
              className={`w-full px-4 py-2.5 bg-slate-50 border-2 rounded-md focus:ring-2 transition-all outline-none text-sm ${
                errors.priority
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/50'
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              aria-invalid={!!errors.priority}
              aria-describedby={errors.priority ? "priority-error" : undefined}
            >
              <option value="">-- انتخاب کنید --</option>
              <option value="LOW">کم (سوالات عمومی)</option>
              <option value="MEDIUM">متوسط (نیاز به پیگیری عادی)</option>
              <option value="HIGH">زیاد (مشکلات فوری و قطعی)</option>
            </select>
            {errors.priority && (
              <div 
                id="priority-error"
                className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 animate-fadeIn"
                role="alert"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.priority}</span>
              </div>
            )}
          </div>

          {/* متن پیام */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
              متن پیام <span className="text-red-500">*</span>
            </label>
            <textarea
              ref={messageRef}
              id="message"
              name="message"
              rows={5}
              onChange={() => handleInputChange('message')}
              placeholder="توضیحات کامل مشکل یا درخواست خود را اینجا بنویسید..."
              className={`w-full px-4 py-2.5 bg-slate-50 border-2 rounded-md focus:ring-2 transition-all outline-none resize-y text-sm leading-relaxed ${
                errors.message
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/50'
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
            ></textarea>
            {errors.message && (
              <div 
                id="message-error"
                className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 animate-fadeIn"
                role="alert"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.message}</span>
              </div>
            )}
          </div>

          {/* دکمه ارسال */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className={`w-full md:w-auto px-6 py-2.5 rounded-md text-white font-medium transition-all border-2 ${
                isPending
                  ? 'bg-blue-400 border-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700 shadow-sm'
              }`}
            >
              {isPending ? 'در حال ارسال...' : 'ارسال تیکت'}
            </button>
          </div>

        </form>
      </div>

      {/* انیمیشن fadeIn برای پیام‌های خطا */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}