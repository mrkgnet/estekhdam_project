"use client";

import React, { useActionState, useState, useRef } from 'react';
import Link from 'next/link';
import {
    Send, MessageSquare, Type, CheckCircle2, AlertCircle,
    Loader2, ChevronLeft, Home, PhoneCall, Mail
} from 'lucide-react';
import { addContactAction } from '@/actions/user/contact/add/Actions';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/modals/AuthModal';

const initialState = {
    success: false,
    message: '',
};

// --- آیکون تلگرام ---
const TelegramIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.9993 4.31685C21.849 3.53592 20.8924 3.09062 20.1705 3.44754L2.83615 12.0255C2.10098 12.3892 2.15549 13.435 2.91572 13.7214L7.54512 15.4646L9.67384 21.8023C9.91494 22.5205 10.9388 22.6101 11.3197 21.9421L13.8863 17.4415L18.4116 20.8809C19.1025 21.4059 20.1116 20.9859 20.2662 20.1256L22.6989 6.58988C22.8465 5.76865 22.383 5.00693 21.9993 4.31685ZM8.28318 14.5126L17.728 8.01639C17.9892 7.8367 18.0673 8.21406 17.8422 8.40698L9.94828 15.1706L9.17646 18.3619L8.28318 14.5126Z" fill="currentColor" />
    </svg>
);

// --- آیکون ایتا ---
const EitaaIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M375.483,163.633 l-36.985,190.871c-3.159,16.516-15.656,20.134-28.796,12.721l-79.626-58.736l-38.416,36.945c-4.249,4.249-7.818,7.818-16.03,7.818 l5.727-81.085l147.668-133.407c6.417-5.71-1.396-8.887-9.967-3.175L136.56,251.055l-78.534-24.597 c-17.073-5.337-17.38-17.073,3.582-25.297l306.91-118.375C382.73,76.54,395.148,85.275,375.483,163.633z" />
    </svg>
);

export default function ContactPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction, isPending] = useActionState(addContactAction, initialState);
    const { isLoading, isLoggedIn } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleAuthCheck = () => {
        if (!isLoggedIn) {
            setIsAuthModalOpen(true);
        }
    };

    const handleAuthSuccess = () => {
        setIsAuthModalOpen(false);
        if (formRef.current) {
            if (formRef.current.checkValidity()) {
                formRef.current.requestSubmit();
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] py-5 px-4 sm:px-6">
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={handleAuthSuccess}
            />

            <div className="max-w-6xl mx-auto">

                {/* 1. Breadcrumb (مسیر راهنما) */}
                <nav className="flex mb-4 text-gray-500 text-bread " aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 space-x-reverse md:space-x-2">
                        <li className="inline-flex items-center">
                            <Link href="/" className="inline-flex px-2 items-center hover:text-emerald-600 transition-colors border p-1 rounded-full bg-gray-100">
                                <Home className="w-3.5 h-3.5 ml-1.5 mb-0.5" />
                                <span>خانه</span>
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <ChevronLeft className="w-4 h-4 text-gray-400 mx-1" />
                                <span className="text-gray-800 border px-2 p-1 rounded-full bg-gray-100">تماس با ما</span>
                            </div>
                        </li>
                    </ol>
                </nav>
                {/* Grid Layout: فرم و راه‌های ارتباطی */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* ستون راست (فرم تماس) - 7 ستون از 12 */}
                    <div className="lg:col-span-7 bg-white rounded shadow-sm border border-slate-100 p-6 sm:p-10">
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-3 justify-center w-60 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
                                <MessageSquare className="w-7 h-7" />
                                <h1 className="h1-fontsize text-bodyh1">ثبت تیکت و پیام</h1>
                            </div>

                            <p className="  text-slate-500 leading-relaxed text-bodyall ">
                                اگر نیاز به راهنمایی دارید یا با مشکلی در سایت مواجه شدید، فرم زیر را پر کنید تا کارشناسان ما در اسرع وقت رسیدگی کنند.
                            </p>
                        </div>

                        {/* هشدارهای موفقیت / خطا */}
                        {state?.success && (
                            <div className="mb-8 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 animate-in fade-in slide-in-from-top-4">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                                <span className=" ">{state.message}</span>
                            </div>
                        )}

                        {state?.success === false && state.message && (
                            <div className="mb-8 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 animate-in fade-in slide-in-from-top-4">
                                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                                <span className=" ">{state.message}</span>
                            </div>
                        )}

                        <form ref={formRef} action={formAction} className="space-y-6 text-bodyall">
                            <div className="space-y-2.5">
                                <label htmlFor="title" className="block    font-bold text-slate-700">
                                    موضوع پیام
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                                        <Type className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        required
                                        placeholder="مثلاً: مشکل در دانلود فایل"
                                        className="w-full  pl-4 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl  focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label htmlFor="message" className="block font-bold  text-slate-700">
                                    شرح کامل پیام
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    placeholder="توضیحات خود را اینجا بنویسید..."
                                    className="w-full p-4 bg-slate-50/50  border border-slate-200 rounded-2xl  focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none leading-relaxed"
                                />
                            </div>

                            <button
                                type={isLoggedIn ? "submit" : "button"}
                                disabled={isPending || isLoading}
                                onClick={handleAuthCheck}
                                className="w-full flex  items-center justify-center gap-3 h-14 rounded-2xl bg-blue-800 text-white  hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
                            >
                                {isPending || isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        {isLoggedIn ? (
                                            <>
                                                <Send className="w-5 h-5 ml-1 dir-ltr transform -rotate-90 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                <span className='font-bold'>ارسال پیام پشتیبانی</span>
                                            </>
                                        ) : (
                                            <span className='font-bold'>ابتدا وارد حساب کاربری شوید</span>
                                        )}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* ستون چپ (ارتباط سریع و شبکه‌های اجتماعی) - 5 ستون از 12 */}
                    <div className="lg:col-span-5 space-y-6 text-bodyall">

                        {/* کارت شبکه‌های اجتماعی */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
                            <h3 className="  text-bodyh text-slate-800 mb-2 font-bold">پاسخگویی سریع‌تر</h3>
                            <p className="  text-slate-500 mb-6 leading-relaxed">
                                برای دریافت پاسخ فوری و مستقیم، می‌توانید از طریق پیام‌رسان‌های زیر با کارشناسان ما در ارتباط باشید.
                            </p>

                            <div className="space-y-3.5">
                                {/* دکمه تلگرام */}
                                <Link
                                    href="https://t.me/YOUR_ID" // لینک آیدی تلگرام خود را جایگزین کنید
                                    target="_blank"
                                    className="flex text-bodyall items-center gap-4 w-full p-4 rounded-2xl bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <TelegramIcon className="w-6 h-6 text-[#229ED9]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold ">پشتیبانی در تلگرام</span>
                                        <span className=" opacity-80 mt-0.5">پاسخگویی سریع (پبشنهاد ما)</span>
                                    </div>
                                </Link>

                                {/* دکمه ایتا */}
                                <Link
                                    href="https://eitaa.com/YOUR_ID" // لینک آیدی ایتا خود را جایگزین کنید
                                    target="_blank"
                                    className="flex  text-bodyall items-center gap-4 w-full p-4 rounded-2xl bg-[#E47A2E]/10 text-[#E47A2E] hover:bg-[#E47A2E] hover:text-white transition-all duration-300 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <EitaaIcon className="w-6 h-6 text-[#E47A2E]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold ">پشتیبانی در ایتا</span>
                                        <span className=" opacity-80 mt-0.5 ">پاسخگویی سریع </span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* کارت اطلاعات تماس (اختیاری - می‌توانید ایمیل یا شماره خود را بگذارید) */}
                        <div className="bg-slate-900  rounded-3xl shadow-lg border border-slate-800 p-6 sm:p-8 text-white relative overflow-hidden">
                            {/* دایره‌های تزئینی پس‌زمینه */}
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>

                            <h3 className="text-bodyh mb-6 relative z-10">اطلاعات تماس</h3>

                            <div className="space-y-5 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <PhoneCall className="w-5 h-5 text-indigo-300" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className=" span-fontsize text-slate-400 font-bold">تلفن پشتیبانی</span>
                                        <span className=" span-fontsize  mt-0.5 dir-ltr text-right">021 - 1234 5678</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-indigo-300" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className=" span-fontsize text-slate-400 font-bold">ایمیل سازمانی</span>
                                        <span className="  span-fontsize mt-0.5 dir-ltr text-right">info@yourwebsite.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
