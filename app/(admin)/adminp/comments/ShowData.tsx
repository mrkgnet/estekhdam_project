'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { addAdminReply } from '@/actions/comment/admin/addAdminReply/Actions';
import toast from 'react-hot-toast';
import { markCommentAsRead } from '@/actions/comment/admin/markAsRead/Actions';
import DeleteButton from '@/components/ui/DeleteButton';
import { deleteAdminComment } from '@/actions/comment/admin/delete/Actions';
import SearchBar from '@/components/ui/SearchBar';
// کامپوننت Pagination خود را اینجا ایمپورت کنید
// import Pagination from '@/components/Pagination';

interface ShowDataProps {
    initialComments: any[];
    totalPages: number;
    currentPage: number;
    limit: number;
    totalCount: number;
}

export default function ShowData({ 
    initialComments,
    totalPages,
    currentPage,
    limit,
    totalCount, 
}: ShowDataProps) {
    
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // خواندن استیت‌های اولیه از URL
    const [searchTerm, setSearchTerm] = useState(searchParams.get("query")?.toString() || "");
    const [showOnlyUnread, setShowOnlyUnread] = useState(searchParams.get("unread") === "true");

    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})

    // افکت Debounce برای ارسال استیت‌ها به URL
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            let changed = false;

            // بررسی تغییر در جستجو
            if (searchTerm !== (searchParams.get("query") || "")) {
                if (searchTerm) params.set("query", searchTerm);
                else params.delete("query");
                changed = true;
            }

            // بررسی تغییر در فیلتر خوانده نشده
            if (showOnlyUnread !== (searchParams.get("unread") === "true")) {
                if (showOnlyUnread) params.set("unread", "true");
                else params.delete("unread");
                changed = true;
            }

            // اگر تغییری داشتیم، صفحه را به 1 برگردان و URL را آپدیت کن
            if (changed) {
                params.set("page", "1");
                router.replace(`${pathname}?${params.toString()}`);
            }
        }, 500); // تاخیر 500 میلی‌ثانیه‌ای

        return () => clearTimeout(timer);
    }, [searchTerm, showOnlyUnread, pathname, router, searchParams]);


    const toggleAccordion = (commentId: string) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">تأیید شده</span>;
            case 'REJECTED':
                return <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold">رد شده</span>;
            default:
                return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">در انتظار</span>;
        }
    };

    const handleSubmitReply = async (commentId: string) => {
        if (!replyText.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await addAdminReply(commentId, replyText);
            if (res.success) {
                toast.success("پاسخ با موفقیت ثبت شد.")
                setReplyingToId(null);
                setReplyText("");
                router.refresh(); // رفرش دیتای سرور بعد از عملیات موفق
            }
        } catch (error) {
            toast.error("خطا در ثبت پاسخ");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            const res = await markCommentAsRead(id);
            if (res.success) {
                toast.success("به عنوان خوانده شده علامت‌گذاری شد.");
                router.refresh(); // آپدیت صفحه بعد از تغییر وضعیت
            } else {
                toast.error("خطا در انجام عملیات!");
            }
        } catch (error) {
            toast.error("خطای ارتباط با سرور");
        }
    };

    // اگر دیتایی یافت نشد
    if (!initialComments || initialComments.length === 0) {
        return (
            <div className="p-6">
                <div className="flex gap-3 mb-6 items-center">
                    <button
                        onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${showOnlyUnread
                            ? "bg-rose-500 hover:bg-rose-600 text-white shadow-sm"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                    >
                        {showOnlyUnread ? "نمایش همه دیدگاه‌ها" : "فیلتر پیام‌های جدید"}
                    </button>
                    <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="جستجو..." className="md:w-1/3" />
                </div>
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 font-medium text-lg">هیچ دیدگاهی یافت نشد.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">مدیریت دیدگاه‌ها</h2>

                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${showOnlyUnread
                            ? "bg-rose-500 hover:bg-rose-600 text-white shadow-sm"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                    >
                        {showOnlyUnread ? "نمایش همه دیدگاه‌ها" : "فیلتر پیام‌های جدید"}
                    </button>

                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="جستجو (شماره، ایمیل، متن)..."
                        className="md:w-1/3"
                    />

                    <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium text-sm">
                        کل نظرات: {totalCount}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                                <th className="p-4 font-semibold w-1/4">ردیف / کاربر</th>
                                <th className="p-4 font-semibold w-2/4">متن دیدگاه / محصول</th>
                                <th className="p-4 font-semibold text-center">وضعیت</th>
                                <th className="p-4 font-semibold text-center">عملیات</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            
                            {initialComments.map((comment, index) => {
                                // محاسبه ردیف
                                const rowIndex = ((currentPage - 1) * limit) + index + 1;

                                return (
                                <React.Fragment key={comment.id}>
                                    <tr className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4 align-top">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs text-slate-400 mb-1">ردیف: {rowIndex}</span>
                                                <span className="font-medium text-slate-700">
                                                    {comment.user?.phoneNumber || comment.user?.email || "کاربر ناشناس"}
                                                </span>

                                                {!comment.isRead && (
                                                    <button onClick={() => handleMarkAsRead(comment.id)} className="bg-red-500 hover:bg-blue-600 w-fit cursor-pointer text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse transition-colors" title="علامت‌گذاری به عنوان خوانده شده">
                                                        جدید
                                                    </button>
                                                )}
                                                <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                                            </div>
                                        </td>

                                        <td className="p-4 align-top">
                                            <div className="flex flex-col gap-2">
                                                <p className="text-slate-700 text-sm leading-relaxed">{comment.textComment}</p>
                                                {comment.product?.name && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-md">
                                                        {comment.product.name}
                                                    </span>
                                                )}
                                                {comment._count?.replies > 0 && (
                                                    <span className="text-xs text-slate-500">(دارای {comment._count.replies} پاسخ)</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="p-4 align-middle text-center">{getStatusBadge(comment.status)}</td>

                                        <td className="p-4 align-middle text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)} className={`p-2 rounded-lg transition-colors cursor-pointer ${replyingToId === comment.id ? 'bg-blue-600 text-white shadow-md' : 'text-blue-600 hover:bg-blue-50'}`}>
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                                </button>
                                                <DeleteButton id={comment.id} action={deleteAdminComment} itemName="این آیتم" className="p-1.5 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-colors">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </DeleteButton>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* بخش پاسخ‌ها (آکاردئون) */}
                                    {comment.replies && comment.replies.length > 0 && (
                                        <tr className="bg-slate-50/30 border-b border-slate-100">
                                            <td colSpan={4} className="p-0">
                                                <div className="mr-10 border-r-2 border-blue-200">
                                                    <button onClick={() => toggleAccordion(comment.id)} className="w-full flex items-center justify-between py-3 px-6 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-colors cursor-pointer">
                                                        <div className="flex items-center gap-2">
                                                            <span>مشاهده پاسخ‌ها ({comment.replies.length})</span>
                                                            {comment.replies.some((reply: any) => !reply.isRead) && (
                                                                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] animate-pulse">پاسخ جدید</span>
                                                            )}
                                                        </div>
                                                        <svg className={`w-5 h-5 transition-transform duration-300 ${expandedComments[comment.id] ? 'transform rotate-180 text-blue-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </button>
                                                    <div className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col gap-3 px-6 ${expandedComments[comment.id] ? 'max-h-[1500px] opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}`}>
                                                        {comment.replies.map((reply: any) => (
                                                            <div key={reply.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
                                                                <div className="flex flex-col gap-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-semibold text-blue-700">{reply.user?.phoneNumber || reply.user?.email || "ادمین"}</span>
                                                                        {!reply.isRead && (
                                                                            <button onClick={() => handleMarkAsRead(reply.id)} className="bg-red-500 hover:bg-blue-600 cursor-pointer text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse transition-colors">پاسخ جدید</button>
                                                                        )}
                                                                        <span className="text-xs text-slate-400">{formatDate(reply.createdAt)}</span>
                                                                    </div>
                                                                    <p className="text-sm text-slate-600 leading-relaxed">{reply.textComment}</p>
                                                                </div>
                                                                <DeleteButton id={reply.id} action={deleteAdminComment} itemName="این پاسخ" className="p-1.5 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                                </DeleteButton>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {/* بخش باز شدن ریپلای جدید */}
                                    {replyingToId === comment.id && (
                                        <tr>
                                            <td colSpan={4} className="p-0 border-t border-slate-100 overflow-hidden">
                                                <div className="bg-slate-50/80 p-4 flex flex-col gap-3">
                                                    <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg text-sm" autoFocus></textarea>
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setReplyingToId(null)} className="px-4 py-2 text-sm hover:bg-slate-200 rounded-lg">انصراف</button>
                                                        <button onClick={() => handleSubmitReply(comment.id)} disabled={isSubmitting} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg">{isSubmitting ? "در حال ارسال..." : "ارسال پاسخ"}</button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )})}
                        </tbody>
                    </table>
                </div>

                {/* محل قرارگیری کامپوننت صفحه‌بندی */}
                {totalPages > 1 && (
                   <div className="p-4 border-t border-slate-200 flex justify-center">
                       {/* کامپوننت شما: <Pagination totalPages={totalPages} currentPage={currentPage} /> */}
                       <div className="text-sm text-slate-500">صفحه {currentPage} از {totalPages}</div>
                   </div>
                )}
            </div>
        </div>
    )
}
