"use client"
import React from 'react'

export default function Loading() {
  return (
    <div>
      <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4" dir="rtl">
      
        <div className="bg-white rounded-[24px] shadow-xl p-10 w-full max-w-[360px] flex flex-col items-center justify-center">

          {/* بخش نقطه‌ها با افکت شلیک (پالس) */}
          <div className="flex gap-2.5 mb-8 h-8 items-center">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="w-4 h-4 bg-[#398d75] rounded-full"
                style={{
                  animation: `bullet-fire 1.2s infinite ease-in-out`,
                  animationDelay: `${index * 0.15}s`, // تاخیر برای ایجاد موج پالسی
                }}
              ></div>
            ))}
          </div>

        
          <p className="text-gray-700 text-base font-medium">از شکیبایی شما سپاسگزار است.</p>

          {/* کی‌فریم برای افکت پالس (بزرگ و کوچک شدن) */}
          <style jsx global>{`
            @keyframes bullet-fire {
              0%, 100% {
                transform: scale(1);
                opacity: 0.5;
              }
              50% {
                transform: scale(1.6);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  )
}
