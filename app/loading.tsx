'use client'
import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 rounded-2xl bg-black/40 flex justify-center items-center z-50 p-4" dir="rtl">
      <div className="bg-white shadow-xl rounded p-10 w-full max-w-[360px] flex flex-col items-center text-center">
        <div className="spinner-ring mb-6"></div>

        <h2 className="text-lg font-semibold text-slate-800 mb-2 text-red-500">استخدام پرو</h2>
        <p className="text-sm text-slate-600">در حال بارگذاری...</p>
      </div>
    </div>
  );
}
