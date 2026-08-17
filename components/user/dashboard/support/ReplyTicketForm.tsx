"use client";

import React, { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { replyTicketUserAction } from "@/actions/user/dashboard/support/reply/Actions";
import { Send, CircleCheck, AlertCircle } from "lucide-react";

const MAX_LENGTH = 2000;
const MAX_TEXTAREA_HEIGHT = 180;

export default function ReplyTicketForm({ ticketId }: { ticketId: string }) {
  const [state, formAction, isPending] = useActionState(replyTicketUserAction, {
    success: false,
    message: "",
    timestamp: 0,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // ریست فرم بعد از ارسال موفق
  useEffect(() => {
    if (state.success) {
      setMessage("");
      setLocalError(null);
      formRef.current?.reset();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [state.success, state.timestamp]);

  // تغییر اندازه خودکار textarea
  const resizeTextarea = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    if (localError && value.trim().length > 0) {
      setLocalError(null);
    }
    resizeTextarea(e.target);
  };

  // کنترل ارسال فرم
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isPending) {
      e.preventDefault();
      return;
    }

    // اگر کاربر متنی وارد نکرده بود
    if (!message.trim()) {
      e.preventDefault();
      setLocalError("لطفاً متن پیام خود را بنویسید.");
      textareaRef.current?.focus();
      return;
    }

    if (message.trim().length > MAX_LENGTH) {
      e.preventDefault();
      setLocalError(`حداکثر طول پیام ${MAX_LENGTH} کاراکتر است.`);
      return;
    }

    setLocalError(null);
  };

  // ارسال با Enter و رفتن به سطر بعد با Shift+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="mt-auto border-t border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 p-3 sm:p-4">
      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleSubmit}
        className="space-y-2.5"
        noValidate
      >
        <input type="hidden" name="ticketId" value={ticketId} />

        <label htmlFor="reply-message" className="sr-only">
          پیام پاسخ
        </label>

        <div
          className="
            relative flex items-end overflow-hidden rounded-2xl border-2 bg-white shadow-sm
            transition-all duration-200
            border-slate-200
            focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10
          "
        >
          <textarea
            id="reply-message"
            ref={textareaRef}
            name="message"
            value={message}
            rows={2}
            maxLength={MAX_LENGTH}
            disabled={isPending}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="پاسخ خود را بنویسید..."
            aria-invalid={Boolean((state.message && !state.success) || localError)}
            aria-describedby="reply-hint reply-feedback"
            className="
              w-full min-h-[56px] max-h-[180px] resize-none bg-transparent
              py-4 pr-4 pl-16 text-sm sm:text-[15px] leading-7 text-slate-700 placeholder:text-slate-400
              outline-none disabled:cursor-not-allowed disabled:opacity-60 custom-scrollbar
            "
          />

          {/* 🟢 دکمه ارسال؛ همیشه روشن و فعال، تنها زمان ارسال غیرفعال می‌شود */}
          <button
            type="submit"
            disabled={isPending}
            title="ارسال پیام"
            aria-label="ارسال پیام"
            className="
              absolute bottom-2 left-2 inline-flex items-center justify-center gap-1.5
              rounded-xl px-3.5 py-2.5 text-sm font-bold text-white shadow-sm
              transition-all duration-200 cursor-pointer
              bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0
              disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0
            "
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span className="hidden sm:inline">در حال ارسال</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 rtl:-scale-x-100" />
                <span className="hidden sm:inline">ارسال</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 px-1">
          <p id="reply-hint" className="hidden sm:block text-[11px] text-slate-500 font-medium">
            ارسال سریع با{" "}
            <kbd className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[10px]">
              Enter
            </kbd>{" "}
            و خط جدید با{" "}
            <kbd className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 text-[10px]">
              Shift + Enter
            </kbd>
          </p>

          <div className="mr-auto flex items-center gap-2">
            <span
              className={`text-[11px] font-bold ${
                message.length > MAX_LENGTH * 0.9
                  ? "text-amber-600"
                  : "text-slate-400"
              }`}
            >
              {message.length}/{MAX_LENGTH}
            </span>
          </div>
        </div>

        {/* پیام‌های وضعیت و خطاها */}
        <div id="reply-feedback" aria-live="polite">
          {(localError || (state.message && !state.success)) && (
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs sm:text-sm font-bold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{localError || state.message}</span>
            </div>
          )}

          {state.success && !localError && (
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs sm:text-sm font-bold text-emerald-700">
              <CircleCheck className="h-4 w-4 shrink-0" />
              <span>پیام شما با موفقیت ارسال شد.</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}