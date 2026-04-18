'use client';

// ۱. هوک useActionState را از react ایمپورت کنید
import React, { useActionState } from 'react';
// ۲. فقط useFormStatus از react-dom ایمپورت می‌شود
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
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{pending ? 'در حال ذخیره...' : 'ذخیره اطلاعات'}</span>
        </button>
    );
}

export default function ShowDataPU({ user }: { user: UserData }) {
    // ۳. تغییر نام useFormState به useActionState
    const [state, formAction] = useActionState(updateProfileAction, null);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* بردکرامب (Breadcrumb) */}
            <nav className="flex items-center gap-1.5 text-sm text-gray-500 p-3.5">
                <Link
                    href="/ddashboard"
                    className="flex items-center hover:text-blue-600 transition-colors"
                >
                    <Home size={16} className="ml-1" />
                    داشبورد
                </Link>
                <ChevronLeft size={16} className="text-gray-400" />
                <span className="text-gray-800 font-semibold">پروفایل کاربری</span>
            </nav>
            {/* هدر آواتار */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100 flex items-center gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                        <User className="w-12 h-12 text-gray-300" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-sm hover:bg-blue-700 transition-colors">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}` : 'کاربر عزیز'}
                    </h2>
                    <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full mt-2 inline-block">
                        کاربر عادی
                    </span>
                </div>
            </div>

            {/* فرم متصل به Server Action */}
            <form action={formAction} className="p-8">

                {/* نمایش پیام سرور */}
                {state?.message && (
                    <div className={`p-4 rounded-lg mb-6 text-sm flex items-center gap-2 ${state.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {state.message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    <div className="space-y-2">

                        <label className="text-sm font-medium text-gray-700">نام</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="firstName"
                                defaultValue={user.firstName || ''}
                                placeholder="مثال: علی"
                                className="block w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">نام خانوادگی</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="lastName"
                                defaultValue={user.lastName || ''}
                                placeholder="مثال: محمدی"
                                className="block w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">شماره موبایل</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={user.phoneNumber || ''}
                                disabled
                                dir="ltr"
                                className="block w-full text-right pr-10 pl-3 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 text-sm cursor-not-allowed outline-none"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">شماره موبایل غیرقابل تغییر است.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">کد ملی</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Fingerprint className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="nationalCode"
                                defaultValue={user.nationalCode || ''}
                                placeholder="0123456789"
                                dir="ltr"
                                maxLength={10}
                                className="block w-full text-right pr-10 pl-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">ایمیل</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                defaultValue={user.email || ''}
                                placeholder="example@mail.com"
                                dir="ltr"
                                className="block w-full text-right pr-10 pl-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">جنسیت</label>
                        <select
                            name="gender"
                            defaultValue={user.gender || 'UNKNOWN'}
                            className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none appearance-none"
                        >
                            <option value="UNKNOWN">انتخاب نشده</option>
                            <option value="MALE">مرد</option>
                            <option value="FEMALE">زن</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                    <SubmitButton />
                </div>

            </form>
        </div>
    );
}
