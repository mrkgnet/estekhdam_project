"use client";

import React from "react";
import { ResumeData } from "./ResumeBuilder"; // مطمئن شوید مسیر تایپ درست است

// ─── Resume Preview Helpers ───────────────────────────────────────────────────

const ResumeSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{title}</span>
      <div className="flex-1 h-px bg-indigo-100" />
    </div>
    {children}
  </div>
);

const ResumeRow = ({ label, value }: { label: string; value: string }) => (
  value ? (
    <div className="text-slate-700">
      <span className="text-slate-400 text-[9px]">{label}: </span>
      <span className="font-semibold">{value}</span>
    </div>
  ) : null
);

// ─── Main Component ───────────────────────────────────────────────────────────

interface ResumePreviewProps {
  data: ResumeData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <div className="hidden lg:flex w-[400px] xl:w-[450px] flex-shrink-0 flex-col bg-slate-800 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden sticky top-8">
      {/* Preview header */}
      <div className="flex items-center justify-between px-5 py-4 bg-slate-900/80 border-b border-slate-700/50 backdrop-blur-sm">
        <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">پیش‌نمایش زنده</span>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-indigo-900/50">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          دانلود PDF
        </button>
      </div>

      {/* Resume paper container */}
      <div className="p-6 flex justify-center bg-slate-800/40 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-none">
        <div
          dir="rtl"
          className="bg-white w-full rounded-xl shadow-xl overflow-hidden text-slate-800 text-[11px] leading-relaxed flex flex-col"
          style={{ minHeight: 580 }}
        >
          {/* Resume top band */}
          <div className="bg-indigo-600 px-6 pt-6 pb-5 text-white text-center">
            {/* اصلاح خطای تصویر با رندر شرطی */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 shadow-lg mx-auto mb-3 flex items-center justify-center bg-indigo-500/50">
              {data.avatar ? (
                <img src={data.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            
            <h2 className="text-sm font-black tracking-wide">
              {data.firstName || "نام"} {data.lastName || "نام خانوادگی"}
            </h2>
            <p className="text-indigo-200 text-[10px] mt-0.5 leading-snug px-2">{data.jobTitle || "عنوان شغلی"}</p>
          </div>

          {/* Contact strip */}
          <div className="bg-indigo-50/80 border-b border-indigo-100/50 px-5 py-3 flex flex-wrap gap-x-4 gap-y-1 justify-center text-[9.5px] text-indigo-700">
            {data.phone && <span>📞 {data.phone}</span>}
            {data.email && <span dir="ltr">✉ {data.email}</span>}
            {data.city && <span>📍 {data.city}</span>}
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-4 flex-1">
            {/* Personal info section */}
            <ResumeSection title="اطلاعات شخصی">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <ResumeRow label="جنسیت" value={data.gender} />
                <ResumeRow label="وضعیت تأهل" value={data.marital} />
                <ResumeRow label="تاریخ تولد" value={data.birthDate} />
                <ResumeRow label="وضعیت سربازی" value={data.military} />
                <ResumeRow label="آدرس" value={data.address} />
              </div>
            </ResumeSection>

            {/* Placeholder sections */}
            {[
              { title: "سوابق تحصیلی", placeholder: "اطلاعات تحصیلی اضافه نشده" },
              { title: "سوابق شغلی", placeholder: "سابقه کاری اضافه نشده" },
              { title: "مهارت‌ها", placeholder: "مهارتی اضافه نشده" },
            ].map((s) => (
              <ResumeSection key={s.title} title={s.title}>
                <p className="text-slate-400 text-[9.5px] italic">{s.placeholder}</p>
              </ResumeSection>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}