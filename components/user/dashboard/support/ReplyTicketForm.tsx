"use client";

import React, { useEffect, useRef } from "react";
import { useActionState } from "react";
import { replyTicketUserAction } from "@/actions/user/dashboard/support/reply/Actions";
import { Send } from "lucide-react";

export default function ReplyTicketForm({ ticketId }: { ticketId: string }) {
  const [state, formAction, isPending] = useActionState(replyTicketUserAction, {
    success: false,
    message: "",
  });

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ریست کردن فرم و ارتفاع textarea در صورت موفقیت‌آمیز بودن ارسال
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // برگرداندن ارتفاع به حالت اولیه
      }
    }
  }, [state.timestamp, state.success]);

  // تغییر ارتفاع خودکار با توجه به محتوا (حداکثر 150 پیکسل)
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
  };

  // ارسال فرم با کلید Enter (بدون Shift)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // جلوگیری از ارسال فرم خالی یا در حال پردازش
      if (textareaRef.current?.value.trim() && !isPending) {
        formRef.current?.requestSubmit();
      }
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
      <form ref={formRef} action={formAction} className="flex flex-col gap-2">
        {/* فیلد مخفی برای ارسال آیدی تیکت */}
        <input type="hidden" name="ticketId" value={ticketId} />
        
        {/* کادر یکپارچه پیام */}
        <div className="relative flex items-end bg-white rounded-2xl border border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 shadow-sm transition-all duration-200 overflow-hidden">
          
          <textarea
            ref={textareaRef}
            name="message"
            rows={1}
            placeholder="پیام خود را بنویسید..."
            required
            disabled={isPending}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[56px] py-4 pr-4 pl-14 bg-transparent outline-none resize-none custom-scrollbar transition-opacity disabled:opacity-50 text-sm sm:text-base leading-relaxed text-slate-700 placeholder:text-slate-400"
          />
          
          {/* دکمه ارسال (در سمت چپ کادر قرار گرفت) */}
          <button
            type="submit"
            disabled={isPending || !state} // غیرفعال شدن موقت هنگام لودینگ
            className="absolute left-2 bottom-2 p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center shrink-0"
            title="ارسال پیام"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Send className="w-5 h-5 rtl:-scale-x-100" />
            )}
          </button>

        </div>

        {/* بخش راهنما و نمایش خطا */}
        <div className="flex items-center justify-between px-2 mt-1">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-block">
            ارسال با کلید <kbd className="bg-slate-200/60 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-sans mx-1">Enter</kbd> خط جدید <kbd className="bg-slate-200/60 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-sans mx-1">Shift + Enter</kbd>
          </span>
          
          {/* نمایش پیام خطا */}
          {state.message && !state.success && (
            <p className="text-red-500 text-xs sm:text-sm font-bold animate-pulse mr-auto">
              {state.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
