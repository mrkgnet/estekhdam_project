// فایل: components/ui/ThreeDotsLoader.tsx
import React from "react";

export const ThreeDotsLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center py-20 gap-3 w-full">
      <style>{`
        @keyframes smoothBounce {
          0%, 100% { 
            transform: translateY(0); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-12px); 
            opacity: 1;
          }
        }
        .dot-smooth {
          animation: smoothBounce 0.6s infinite ease-in-out;
        }
      `}</style>

      <div className="text-sm text-slate-600 my-3 font-bold">در حال دریافت اطلاعات</div>

      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full dot-smooth" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-red-500 rounded-full dot-smooth" style={{ animationDelay: '200ms' }}></div>
        <div className="w-3 h-3 bg-red-500 rounded-full dot-smooth" style={{ animationDelay: '400ms' }}></div>
      </div>
    </div>
  );
};
