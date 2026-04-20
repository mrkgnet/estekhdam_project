"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import markAllIssuesRead from "@/actions/admin/issu-question/update/Actions";

type Status = "idle" | "loading" | "success" | "error";

export default function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Status>("idle");
  const router = useRouter();

  const handleClick = () => {
    setStatus("loading");
    startTransition(async () => {
      const res = await markAllIssuesRead();
      if (res?.success) {
        setStatus("success");
        router.refresh();
      } else {
        setStatus("error");
        alert(res?.message ?? "خطا در بروزرسانی");
      }
    });
  };

  const isLoading = isPending || status === "loading";
  const isSuccess = status === "success";

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || isSuccess}
      aria-busy={isLoading}
      aria-live="polite"
      className={[
        "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400",
        isSuccess
          ? "border border-emerald-200 bg-emerald-50 text-emerald-700 cursor-not-allowed"
          : "bg-blue-800 text-white shadow-sm hover:bg-slate-700 hover:shadow-md",
        isLoading ? "opacity-70 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {isLoading ? (
        <>
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          در حال انجام...
        </>
      ) : isSuccess ? (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          همه موارد اصلاح شد
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ثبت همه به‌عنوان خوانده‌شده
        </>
      )}
    </button>
  );
}
