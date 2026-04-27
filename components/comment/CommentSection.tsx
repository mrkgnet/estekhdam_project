"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, CheckCircle2, MessageSquare, Send, User, Reply, X } from "lucide-react";
import { addNewCommentUser } from "@/actions/comment/user/add/Actions";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation"; // اضافه شد

interface Props {
  targetId: string;
  targetType: string;
  initialComments: any[];
}

export default function CommentSectionUI({ targetId, targetType, initialComments }: Props) {
  const pathname = usePathname(); // گرفتن آدرس فعلی صفحه

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
      const createdComment = state.data;

      const commentToAdd = {
        ...createdComment,
        replies: [],
      };

      if (isReply && replyingTo) {
        setCommentsList((prev) =>
          prev.map((comment) => {
            if (comment.id === replyingTo.id) {
              return {
                ...comment,
                replies: [...(comment.replies || []), commentToAdd],
              };
            }
            return comment;
          })
        );
        setReplyText("");
        setReplyingTo(null);
      } else {
        setCommentsList((prev) => [commentToAdd, ...prev]);
        setNewComment("");
        formRef.current?.reset();
      }

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

  const getUserInfo = (comment: any) => {
    if (!comment.userId) {
      return { name: "مهمان", type: "GUEST" };
    }
    if (comment.user?.role === "admin") {
      const name = comment.user.firstName
        ? `${comment.user.firstName} ${comment.user.lastName || ""}`
        : comment.user.username || "ادمین";
      return { name, type: "admin" };
    }
    const name = comment.user?.firstName
      ? `${comment.user.firstName} ${comment.user.lastName || ""}`
      : comment.user?.username || "کاربر سایت";
    return { name, type: "USER" };
  };

  const Badge = ({ type }: { type: string }) => {
    switch (type) {
      case "admin":
        return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">ادمین</span>;
      case "user":
        return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">کاربر</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl border border-gray-300 mx-auto p-4 sm:p-6 lg:p-8 bg-white/50 backdrop-blur-xl shadow-sm  my-5" dir="rtl">
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-3 rounded text-indigo-600 shadow-inner">
            <MessageSquare size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-base text-slate-800 tracking-tight">دیدگاه کاربران</h2>
            <p className="text-slate-500 mt-1">نظرات و تجربیات خود را به اشتراک بگذارید</p>
          </div>
        </div>
      </div>

      <form ref={formRef} action={formNewCommentAction} className="mb-10">
        {/* فیلدهای مخفی کاملا عمومی شده‌اند */}
        <input type="hidden" name="targetId" value={targetId} />
        <input type="hidden" name="targetType" value={targetType} />
        <input type="hidden" name="pathname" value={pathname} />

        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded flex items-center gap-3"
            >
              <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
              <p className="font-medium">دیدگاه شما با موفقیت ثبت شد.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 relative">
          <div className="hidden sm:flex flex-shrink-0 w-10 h-10 bg-indigo-100 rounded items-center justify-center text-indigo-600 border border-white shadow-sm">
            <User size={22} />
          </div>

          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              name="newComment"
              placeholder="دیدگاه خود را اینجا بنویسید (نیاز به لاگین نیست)..."
              className="w-full min-h-[130px] p-5 bg-white border border-slate-200 rounded focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none text-slate-700"
              disabled={isPending}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isPending}
              className="absolute bottom-4 left-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white px-6 py-2 rounded-xl transition-all"
            >
              {isPending && !replyingTo ? "در حال ارسال..." : "ارسال دیدگاه"}
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        <h3 className="text-slate-700 mb-6">نظرات منتشر شده ({commentsList.length})</h3>

        {commentsList.map((comment: any) => {
          const { name: commenterName, type: commenterType } = getUserInfo(comment);

          return (
            <div key={comment.id} className="bg-white border border-slate-100 rounded p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="font-medium">{commenterName}</span>
                      <Badge type={commenterType} />
                    </div>
                    <div className="text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar size={12} />
                      {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleReplyClick(comment.id, commenterName)}
                  className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded hover:bg-indigo-100 transition-colors"
                >
                  <Reply size={14} /> پاسخ
                </button>
              </div>

              <p className="text-slate-600 leading-relaxed mb-4 break-words whitespace-pre-wrap">{comment.textComment}</p>

              {(comment.replies?.length > 0 || replyingTo?.id === comment.id) && (
                <div className="mt-4 mr-2 sm:mr-8 pr-4 border-r-2 border-indigo-50 space-y-4">
                  <AnimatePresence>
                    {replyingTo?.id === comment.id && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <form action={formNewCommentAction} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {/* اصلاح فرم ریپلای */}
                          <input type="hidden" name="targetId" value={targetId} />
                          <input type="hidden" name="targetType" value={targetType} />
                          <input type="hidden" name="pathname" value={pathname} />
                          <input type="hidden" name="parentId" value={comment.id} />
                          <textarea
                            autoFocus
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            name="newComment"
                            placeholder={`در پاسخ به ${replyingTo.name}...`}
                            className="w-full min-h-[80px] p-3 bg-white border border-slate-200 rounded outline-none focus:border-indigo-400"
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => setReplyingTo(null)}
                              className="text-slate-500 px-3 py-1"
                            >
                              انصراف
                            </button>
                            <button
                              type="submit"
                              disabled={isPending}
                              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg"
                            >
                              {isPending ? "..." : "ارسال پاسخ"}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {comment.replies?.map((reply: any) => {
                    const { name: replyName, type: replyType } = getUserInfo(reply);
                    return (
                      <div key={reply.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 bg-purple-50 rounded flex items-center justify-center text-purple-500">
                            <User size={14} />
                          </div>
                          <div className="flex items-center gap-2 text-slate-700">
                            <span>{replyName}</span>
                            <Badge type={replyType} />
                          </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-4 break-words whitespace-pre-wrap">{reply.textComment}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
