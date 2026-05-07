import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-[24px] shadow-xl p-10 w-full max-w-[360px] flex flex-col items-center justify-center">
        <div className="flex gap-2.5 mb-8 h-8 items-center">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="loading-dot w-3 h-3 bg-[#398d75] rounded-full"
              style={{ ["--i" as any]: index }}
            />
          ))}
        </div>

        <p className="text-gray-700 text-base font-medium">
          درحال دریافت اطلاعات
        </p>
      </div>
    </div>
  );
}
