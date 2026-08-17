'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { User, Mail, Phone, Fingerprint, Save, Camera, Loader2, Home, ChevronLeft } from 'lucide-react';
import { updateProfileAction } from '@/actions/user/dashboard/profile/update/Actions';
import Link from 'next/link';

type UserData = {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber: string;
    nationalCode?: string | null;
    email?: string | null;
    gender: string;
};

// کامپوننت دکمه سابمیت برای مدیریت حالت Loading
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-md border-2 border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="text-sm font-medium">{pending ? 'در حال ذخیره...' : 'ذخیره اطلاعات'}</span>
        </button>
    );
}

export default function ShowDataPU({ user }: { user: UserData }) {
    const [state, formAction] = useActionState(updateProfileAction, null);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border-2 border-slate-300 dark:border-slate-700 overflow-hidden">
            {/* بردکرامب (Breadcrumb) */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 p-3.5 border-b-2 border-slate-200 dark:border-slate-800">
                <Link
                    href="/ddashboard"
                    className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    <Home size={14} className="ml-1" />
                    داشبورد
                </Link>
                <ChevronLeft size={14} className="text-slate-400" />
                <span className="text-slate-800 dark:text-slate-200 font-medium">پروفایل کاربری</span>
            </nav>

            {/* هدر آواتار */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/50 px-6 md:px-8 py-5 border-b-2 border-slate-200 dark:border-slate-800 flex items-center gap-5">
                <div className="relative">
                    <div className="w-20 h-20 rounded-md bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-center overflow-hidden">
                        <User className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-md text-white shadow-sm hover:bg-blue-700 transition-colors border-2 border-white dark:border-slate-800">
                        <Camera className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div>
                    <h2 className="text-base font-medium text-slate-800 dark:text-slate-100">
                        {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}` : 'کاربر عزیز'}
                    </h2>
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/50 border-2 border-blue-300 dark:border-blue-800 px-2.5 py-0.5 rounded-md mt-2 inline-block">
                        کاربر عادی
                    </span>
                </div>
            </div>

            {/* فرم متصل به Server Action */}
            <form action={formAction} className="p-5 md:p-8">

                {/* نمایش پیام سرور */}
                {state?.message && (
                    <div className={`p-3.5 rounded-md mb-5 text-xs flex items-center gap-2 border-2 ${
                        state.type === 'success' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' 
                            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800'
                    }`}>
                        {state.message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">

                    {/* نام */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">نام</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                name="firstName"
                                defaultValue={user.firstName || ''}
                                placeholder="مثال: علی"
                                className="block w-full pr-10 pl-3 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* نام خانوادگی */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">نام خانوادگی</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <User className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                name="lastName"
                                defaultValue={user.lastName || ''}
                                placeholder="مثال: محمدی"
                                className="block w-full pr-10 pl-3 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* شماره موبایل */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">شماره موبایل</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Phone className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                value={user.phoneNumber || ''}
                                disabled
                                dir="ltr"
                                className="block w-full text-right pr-10 pl-3 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-500 text-sm cursor-not-allowed outline-none font-mono"
                            />
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">شماره موبایل غیرقابل تغییر است.</p>
                    </div>

                    {/* کد ملی */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">کد ملی</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Fingerprint className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                name="nationalCode"
                                defaultValue={user.nationalCode || ''}
                                placeholder="0123456789"
                                dir="ltr"
                                maxLength={10}
                                className="block w-full text-right pr-10 pl-3 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 font-mono"
                            />
                        </div>
                    </div>

                    {/* ایمیل */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ایمیل</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                defaultValue={user.email || ''}
                                placeholder="example@mail.com"
                                dir="ltr"
                                className="block w-full text-right pr-10 pl-3 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 font-mono"
                            />
                        </div>
                    </div>

                    {/* جنسیت */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">جنسیت</label>
                        <select
                            name="gender"
                            defaultValue={user.gender || 'UNKNOWN'}
                            className="block w-full px-3 py-2.5 border-2 border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none appearance-none text-slate-800 dark:text-slate-200 cursor-pointer"
                        >
                            <option value="UNKNOWN">انتخاب نشده</option>
                            <option value="MALE">مرد</option>
                            <option value="FEMALE">زن</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end pt-5 border-t-2 border-slate-200 dark:border-slate-800">
                    <SubmitButton />
                </div>

            </form>
        </div>
    );
}