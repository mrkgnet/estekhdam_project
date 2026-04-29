// فایل: components/ui/ThreeDotsLoader.tsx
import React from "react";

export const ThreeDotsLoader = () => {
  return (
    <div className="flex justify-center items-center py-20 gap-2 w-full">
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

      <div className="w-4 h-4 bg-red-500 rounded-full dot-smooth" style={{ animationDelay: '0ms' }}></div>
      <div className="w-4 h-4 bg-red-500 rounded-full dot-smooth" style={{ animationDelay: '200ms' }}></div>
      <div className="w-4 h-4 bg-red-500 rounded-full dot-smooth" style={{ animationDelay: '400ms' }}></div>
    </div>
  );
};
