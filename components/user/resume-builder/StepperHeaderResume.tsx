"use client";
import React from "react";

export interface StepItem {
  label: string;
  icon: string;
}

// ─── انتقال آیتم‌های مراحل به این فایل ──────────────────────────────
export const steps: StepItem[] = [
  { label: "اطلاعات پایه", icon: "👤" },
  { label: "تحصیلی", icon: "🎓" },
  { label: "شغلی", icon: "💼" },
  { label: "مهارت", icon: "⚡" },
  { label: "پروژه", icon: "🚀" },
  { label: "تحقیقات", icon: "🔬" },
  { label: "سایر", icon: "📎" },
];

interface StepperProps {
  steps: StepItem[];
  activeStep: number;
  setActiveStep: (step: number) => void;
}

export default function StepperHeaderResume({ steps, activeStep, setActiveStep }: StepperProps) {
  return (
    <div className="bg-white border-b border-slate-100 px-6 py-6">
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex items-center min-w-[650px] md:min-w-0 px-2">
          {steps.map((step, index) => {
            const isCompleted = activeStep > index;
            const isActive = activeStep === index;
            return (
              <React.Fragment key={index}>
                <div
                  className="flex flex-col items-center cursor-pointer flex-shrink-0 group select-none"
                  onClick={() => setActiveStep(index)}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[#3b5998] text-white shadow-lg shadow-indigo-200 scale-110 ring-4 ring-indigo-50"
                        : isCompleted
                        ? "bg-[#3b5998] text-white shadow-sm"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    }`}
                  >
                    {isCompleted ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2.5 text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      isActive ? "text-[#3b5998] font-bold" : isCompleted ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-[2px] mx-2 mb-6 rounded-full overflow-hidden bg-slate-100">
                    <div
                      className="h-full bg-[#3b5998] rounded-full transition-all duration-500"
                      style={{ width: activeStep > index ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}