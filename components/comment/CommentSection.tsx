"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, CheckCircle2, MessageSquare, Send, User, Reply, X } from "lucide-react";
import { addNewCommentUser } from "@/actions/comment/user/add/Actions"; // مسیر ایمپورت را چک کنید
import toast from "react-hot-toast";

interface Props {
    productId: string;
    initialComments: any[]; 
}

export default function CommentSectionUI({ productId, initialComments }: Props) {
    const [newComment, setNewComment] = useState("");
    const [replyText, setReplyText] = useState(""); 
    const formRef = useRef<HTMLFormElement>(null);

    const [showMessage, setShowMessage] = useState(false);
    const [state, formNewCommentAction, isPending] = useActionState(addNewCommentUser, null);
    const [commentsList, setCommentsList] = useState(initialComments);

    const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        setCommentsList(initialComments);
    }, [initialComments]);

    useEffect(() => {
        if (state?.success && state.data) {
            const isReply = state.isReply;
            const createdComment = state.data; // کامنت برگشتی از دیتابیس

            // ساخت یک آبجکت موقت برای نمایش فوری (اگر کاربر مهمان باشد user مقدار null دارد)
            const commentToAdd = {
                ...createdComment,
                user: createdComment.user || { firstName: "شما", lastName: "(مهمان)" },
                replies: [] 
            };

            if (isReply && replyingTo) {
                setCommentsList(prev => prev.map(comment => {
                    if (comment.id === replyingTo.id) {
                        return { 
                            ...comment, 
                            replies: [...(comment.replies || []), commentToAdd] 
                        };
                    }
                    return comment;
                }));
                setReplyText("");
                setReplyingTo(null);
            } else {
                setCommentsList(prev => [commentToAdd, ...prev]);
                setNewComment("");
                formRef.current?.reset();
            }

            toast.success(state.message || "دیدگاه شما ثبت شد");
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 5000);

        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    const handleReplyClick = (commentId: string, userName: string) => {
        if (replyingTo?.id === commentId) {
            setReplyingTo(null);
            setReplyText("");
        } else {
            setReplyingTo({ id: commentId, name: userName });
            setReplyText("");
        }
    };

    return (
        <div className="  text-[13px] md:text-[15px] w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-white/50 backdrop-blur-xl rounded shadow-sm border border-gray-100/80 my-10" dir="rtl">

            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-5">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 p-3 rounded text-indigo-600 shadow-inner">
                        <MessageSquare size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold text-gray-800 tracking-tight">دیدگاه کاربران</h2>
                        <p className=" text-gray-500 mt-1">نظرات و تجربیات خود را به اشتراک بگذارید</p>
                    </div>
                </div>
            </div>

            {/* فرم اصلی */}
            <form ref={formRef} action={formNewCommentAction} className="mb-10">
                <input type="hidden" name="productId" value={productId} />
                
                {/* پیام ثبت دیدگاه */}
                <AnimatePresence>
                    {showMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-3"
                        >
                            <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                            <p className="text-sm font-medium">دیدگاه شما با موفقیت ثبت شد.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-4 relative">
                    <div className="hidden sm:flex flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full items-center justify-center text-indigo-600 border border-white shadow-sm">
                        <User size={22} />
                    </div>

                    <div className="flex-1 relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            name="newComment"
                            placeholder="دیدگاه خود را اینجا بنویسید (نیاز به لاگین نیست)..."
                            className="w-full min-h-[130px] p-5 bg-white border border-gray-200 rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-gray-700"
                            disabled={isPending}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || isPending}
                            className="absolute bottom-4 left-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
                        >
                            {isPending && !replyingTo ? "در حال ارسال..." : "ارسال دیدگاه"}
                        </button>
                    </div>
                </div>
            </form>

            {/* لیست کامنت‌ها */}
            <div className="space-y-6">
                <h3 className="text-base font-bold text-gray-700 mb-6">
                    نظرات منتشر شده ({commentsList.length})
                </h3>

                {commentsList.map((comment: any) => {
                    // تعیین نام کاربر
                    const commenterName = comment.user?.firstName 
                        ? `${comment.user.firstName} ${comment.user.lastName || ""}` 
                        : comment.user?.username || "کاربر سایت";

                    return (
                    <div key={comment.id} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
                        
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                    <User size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800 ">
                                        {commenterName}
                                    </div>
                                    <div className=" text-gray-400 flex items-center gap-1 mt-1">
                                        <Calendar size={12} />
                                        {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleReplyClick(comment.id, commenterName)}
                                className=" flex items-center gap-1 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                                <Reply size={14} /> پاسخ
                            </button>
                        </div>
                        
                        <p className="text-gray-600  leading-relaxed mb-4">
                            {comment.textComment}
                        </p>

                        {(comment.replies?.length > 0 || replyingTo?.id === comment.id) && (
                            <div className="mt-4 mr-2 sm:mr-8 pr-4 border-r-2 border-indigo-50 space-y-4">
                                
                                {/* فرم پاسخ */}
                                <AnimatePresence>
                                    {replyingTo?.id === comment.id && (
                                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                            <form action={formNewCommentAction} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <input type="hidden" name="productId" value={productId} />
                                                <input type="hidden" name="parentId" value={comment.id} />
                                                <textarea
                                                    autoFocus
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    name="newComment"
                                                    placeholder={`در پاسخ به ${replyingTo.name}...`}
                                                    className="w-full min-h-[80px] p-3 bg-white border border-gray-200 rounded-lg  outline-none focus:border-indigo-400"
                                                />
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button type="button" onClick={() => setReplyingTo(null)} className=" text-gray-500 px-3 py-1">انصراف</button>
                                                    <button type="submit" disabled={isPending} className=" bg-indigo-600 text-white px-4 py-1.5 rounded-lg">
                                                        {isPending ? "..." : "ارسال پاسخ"}
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* لیست پاسخ‌ها */}
                                {comment.replies?.map((reply: any) => {
                                     const replyName = reply.user?.firstName 
                                        ? `${reply.user.firstName} ${reply.user.lastName || ""}` 
                                        : reply.user?.username || "کاربر مهمان";

                                    return (
                                    <div key={reply.id} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 relative">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-7 h-7 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                                                <User size={14} />
                                            </div>
                                            <div className=" font-bold text-gray-700">
                                                {replyName}
                                            </div>
                                        </div>
                                        <p className="text-gray-600  leading-relaxed">
                                            {reply.textComment}
                                        </p>
                                    </div>
                                )})}
                            </div>
                        )}
                    </div>
                )})}
            </div>
        </div>
    );
}
