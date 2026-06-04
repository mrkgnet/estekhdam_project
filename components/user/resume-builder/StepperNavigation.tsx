"use client";
import React from "react";

interface StepperNavigationProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  totalSteps: number;
}

export default function StepperNavigation({ activeStep, setActiveStep, totalSteps }: StepperNavigationProps) {
  return (
    <div className="bg-white border-t border-slate-100 px-6 py-5 flex items-center justify-between">
      <button
        onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
        disabled={activeStep === 0}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 rotate-180">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        قبلی
      </button>
      
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i)}
            className={`rounded-full transition-all duration-300 ${
              i === activeStep ? "w-6 h-2 bg-[#3b5998]" : i < activeStep ? "w-2 h-2 bg-indigo-300" : "w-2 h-2 bg-slate-200"
            }`}
          />
        ))}
      </div>
      
      <button
        onClick={() => setActiveStep((s) => Math.min(totalSteps - 1, s + 1))}
        disabled={activeStep === totalSteps - 1}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#3b5998] text-white hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-100"
      >
        بعدی
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>
    </div>
  );
}