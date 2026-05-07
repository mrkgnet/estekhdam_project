import React from 'react';

const CustomLoader = () => {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4" dir="rtl">
      
      <div className="bg-white rounded-[24px] shadow-xl p-10 w-full max-w-[360px] flex flex-col items-center justify-center">

        {/* بخش نقطه‌های سبز رنگ با افکت پرش قطاری */}
        <div className="flex gap-2.5 mb-8 h-8 items-center">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="w-4 h-4 bg-[#398d75] rounded-full"
              style={{
                animation: `wave-bounce 1.2s infinite ease-in-out`,
                animationDelay: `${index * 0.1}s`, // تاخیر متوالی برای ایجاد حالت قطاری
              }}
            ></div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">روان درمان</h2>
        <p className="text-gray-700 text-base font-medium">از شکیبایی شما سپاسگزار است.</p>

        {/* کی‌فریم پرش به بالا و پایین */}
        <style jsx global>{`
          @keyframes wave-bounce {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.6;
            }
            50% {
              transform: translateY(-12px);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default CustomLoader;
