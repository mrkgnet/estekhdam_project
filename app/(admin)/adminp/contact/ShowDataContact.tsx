"use client";

import React, { useState, useEffect } from 'react';
import {
    MessageSquare, User, Calendar, CheckCircle2, Clock, Inbox, Eye, X, Phone, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteButton from '@/components/ui/DeleteButton';
import { deleteContactAction } from '@/actions/admin/contact/delete/Actions';
// ایمپورت کردن اکشن سروری برای آپدیت وضعیت (مسیر ایمپورت را با پروژه خود چک کنید)
import { markAsReadAction } from '@/actions/admin/contact/update/Actions';
import toast from 'react-hot-toast';

type ContactType = {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
    user?: {
        name: string | null;
        phone: string | null;
        phoneNumber?: string | null; // اضافه شده برای رفع خطای تایپ در بخش شماره تلفن
    } | null;
};

export default function ShowDataContact({ response }: { response: ContactType[] }) {
    // 🛠️ تغییر ۱: انتقال اطلاعات پراپ به استیت برای آپدیت سریع (Optimistic Update)
    const [contacts, setContacts] = useState<ContactType[]>(response);

    const [selectedContact, setSelectedContact] = useState<ContactType | null>(null);

    // 🛠️ تغییر ۲: همگام سازی استیت با پراپ در صورت رفرش شدن اطلاعات از سمت سرور
    useEffect(() => {
        setContacts(response);
    }, [response]);

    const formatPersianDate = (date: Date) => {
        return new Intl.DateTimeFormat('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    const unreadCount = contacts.filter((c) => !c.isRead).length;

    // 🛠️ تغییر ۳: ساخت تابع برای باز کردن مدال و تغییر وضعیت همزمان
    const handleOpenModal = async (contact: ContactType) => {
        // ۱. اگر پیام خوانده نشده است، وضعیت آن را لوکال تغییر می‌دهیم
        if (!contact.isRead) {
            const updatedContact = { ...contact, isRead: true };

            // آپدیت مدال (تا داخل مدال هم تیک سبز خوانده شده بیاید)
            setSelectedContact(updatedContact);

            // آپدیت لیست جدول (تا تگ در انتظار از بین برود)
            setContacts(prev => prev.map(c => c.id === contact.id ? updatedContact : c));

            // ۲. ارسال درخواست به دیتابیس در بک‌گراند
            try {
                await markAsReadAction(contact.id);
            } catch (error) {
               toast.error("خطا در آپدیت وضعیت خوانده شده")
            }
        } else {
            // اگر از قبل خوانده شده بود فقط مدال را باز کن
            setSelectedContact(contact);
        }
    };

    return (
        <div className="p-6  mx-auto space-y-8 relative">

            {/* هدر صفحه */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <MessageSquare className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-800">پیام‌های تماس با ما</h1>
                        <p className="text-sm text-slate-500 mt-1">مدیریت و بررسی نظرات و پیشنهادات کاربران</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-center min-w-[120px]">
                        <span className="block text-2xl font-bold text-slate-700">{contacts.length}</span>
                        <span className="text-xs text-slate-500 font-medium">کل پیام‌ها</span>
                    </div>
                    <div className="px-4 py-3 bg-rose-50 rounded-2xl border border-rose-100 text-center min-w-[120px]">
                        <span className="block text-2xl font-bold text-rose-600">{unreadCount}</span>
                        <span className="text-xs text-rose-500 font-medium">خوانده نشده</span>
                    </div>
                </div>
            </div>

            {/* جدول پیام‌ها */}
            {contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                        <Inbox className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">صندوق پیام‌ها خالی است</h3>
                    <p className="text-slate-500">تا کنون هیچ پیامی از سمت کاربران دریافت نشده است.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-sm">
                                    <th className="py-4 px-6 font-semibold w-1/4">عنوان پیام</th>
                                    <th className="py-4 px-6 font-semibold">فرستنده</th>
                                    <th className="py-4 px-6 font-semibold">تاریخ</th>
                                    <th className="py-4 px-6 font-semibold text-center">وضعیت</th>
                                    <th className="py-4 px-6 font-semibold text-center">عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map((contact) => (
                                    <tr
                                        key={contact.id}
                                        className={`border-b last:border-0 border-slate-50 hover:bg-slate-50 transition-colors ${!contact.isRead ? 'bg-indigo-50/30' : ''
                                            }`}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {!contact.isRead && (
                                                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                                                    </span>
                                                )}
                                                <span className="font-medium text-slate-800 line-clamp-1">{contact.title}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-slate-700 block">
                                                {contact.user ? (contact.user.name || "بدون نام") : "کاربر مهمان"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-600">
                                            {formatPersianDate(contact.createdAt)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {contact.isRead ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    خوانده شده
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    در انتظار
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-center flex gap-2 items-center  justify-center">
                                            {/* 🛠️ تغییر ۴: اتصال تابع جدید به دکمه مشاهده */}
                                            <button
                                                onClick={() => handleOpenModal(contact)}
                                                className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all text-sm font-medium"
                                            >
                                                <Eye className="w-4 h-4" />
                                                مشاهده
                                            </button>
                                            <DeleteButton
                                                id={contact.id}
                                                action={deleteContactAction}
                                                itemName="این آگهی"
                                                className="inline-flex cursor-pointer text-red-500 items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200  hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all text-sm font-medium"
                                            >
                                                <Trash2 size={14} />
                                                حذف
                                            </DeleteButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* مودال نمایش جزئیات با Framer Motion */}
            <AnimatePresence>
                {selectedContact && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedContact(null)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="text-xl font-bold text-slate-800">جزئیات پیام</h2>
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-6">
                                <div className="flex flex-wrap gap-4 justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-slate-800">
                                                {selectedContact.user ? selectedContact.user.name || "کاربر بدون نام" : "کاربر مهمان"}
                                            </span>
                                            <div className="flex items-center gap-1 text-base text-slate-500 mt-1">
                                                <Phone className="w-3 h-3" />
                                                <span dir="ltr">{selectedContact.user?.phoneNumber || selectedContact.user?.phone || "شماره ثبت نشده"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{formatPersianDate(selectedContact.createdAt)}</span>
                                        </div>
                                        {selectedContact.isRead ? (
                                            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>خوانده شده</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>در انتظار بررسی</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-b border-slate-100 pb-3">
                                        {selectedContact.title}
                                    </h3>
                                    <div className="bg-indigo-50/30 p-5 rounded-2xl border border-indigo-50 leading-loose text-slate-700 whitespace-pre-wrap">
                                        {selectedContact.message}
                                    </div>
                                </div>

                            </div>

                            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="px-5 py-2.5 bg-slate-800 text-white hover:bg-slate-700 rounded-xl font-medium transition-colors text-sm"
                                >
                                    بستن
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}
