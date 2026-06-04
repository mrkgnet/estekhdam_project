"use client";
import React, { useState } from "react";

import { ResumeData } from "./types";
import PersonalInfo, { defaultData } from "@/components/user/resume-builder/PersonalInfo"; // ایمپورت PersonalInfo و defaultData
import StepperHeaderResume from "@/components/user/resume-builder/StepperHeaderResume";
import StepperNavigation from "@/components/user/resume-builder/StepperNavigation";
import ResumePreview from "@/components/user/resume-builder/ResumePreview"; // مسیر کامپوننت پیش‌نمایش را چک کنید

// ─── Constants ────────────────────────────────────────────────────────────────
const steps = [
  { label: "اطلاعات پایه", icon: "👤" },
  { label: "تحصیلی", icon: "🎓" },
  { label: "شغلی", icon: "💼" },
  { label: "مهارت", icon: "⚡" },
  { label: "پروژه", icon: "🚀" },
  { label: "تحقیقات", icon: "🔬" },
  { label: "سایر", icon: "📎" },
];

// ─── Root Component ───────────────────────────────────────────────────────────
export default function ResumeBuilder() {
  const [activeStep, setActiveStep] = useState(0);
  // استفاده از defaultData که از فایل PersonalInfo ایمپورت شده است
  const [data, setData] = useState<ResumeData>(defaultData);

  // تابع آپدیت مستقیم برای پاس دادن به PersonalInfo
  const updateField = (field: keyof ResumeData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-50/40 font-sans antialiased text-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ── RIGHT: Form Container ── */}
        <div className="w-full lg:flex-1 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-slate-800">ساخت رزومه</h1>
              <p className="text-xs text-slate-400 mt-0.5">مرحله {activeStep + 1} از {steps.length}</p>
            </div>
            {/* Mobile preview toggle */}
            <button className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              پیش‌نمایش
            </button>
          </div>

          {/* Stepper Component */}
          <StepperHeaderResume steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />

          {/* Content */}
          <div className="p-6 md:p-8 bg-slate-50/40 flex-1">
            {activeStep === 0 ? (
              <PersonalInfo data={data} update={updateField} />
            ) : (
              <EmptySection label={steps[activeStep].label} icon={steps[activeStep].icon} />
            )}
          </div>

          {/* Navigation Component */}
          <StepperNavigation activeStep={activeStep} setActiveStep={setActiveStep} totalSteps={steps.length} />
        </div>

        {/* ── LEFT: Sticky Live Preview Component ── */}
        <ResumePreview data={data} />
        
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────
const EmptySection = ({ label, icon }: { label: string; icon: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[450px] border-2 border-dashed border-slate-200 rounded-2xl bg-white text-center p-6">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-slate-700 mb-1">بخش {label}</h3>
    <p className="text-sm text-slate-400 max-w-xs">این بخش در حال توسعه است و به زودی فرم‌های مربوطه اضافه می‌شود.</p>
  </div>
);