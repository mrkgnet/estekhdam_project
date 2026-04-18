// // مسیر: components/GlobalLoader.tsx
// "use client";

// import React, { useState, useEffect } from 'react';

// export default function GlobalLoader() {
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         // این کد چک می‌کند که آیا کل صفحه (شامل عکس‌ها و اسکریپت‌ها) لود شده است یا خیر
//         const handleLoad = () => {
//             setIsLoading(false);
//         };

//         if (document.readyState === 'complete') {
//             setIsLoading(false);
//         } else {
//             window.addEventListener('load', handleLoad);
//             // به عنوان احتیاط، اگر لود صفحه خیلی طول کشید، بعد از 5 ثانیه لودینگ را بردار
//             const timeout = setTimeout(() => setIsLoading(false), 3000); 
            
//             return () => {
//                 window.removeEventListener('load', handleLoad);
//                 clearTimeout(timeout);
//             };
//         }
//     }, []);

//     if (!isLoading) return null; // وقتی لود تمام شد، کامپوننت محو می‌شود

//     return (
//         <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-500/40 backdrop-blur-[2px]">
//             <div className="bg-white text-xs md:text-sm w-48 h-48 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6 transform scale-100 animate-in zoom-in-95 duration-200">
//                 <div className="text-slate-700 mb-4 text-center leading-tight flex flex-col items-center">
//                     <p>در حال بارگذاری...</p>
//                     <img src="/logo.svg" alt="Logo" className="w-20 mb-2 mt-2" />
//                 </div>

//                 <div className="flex gap-1.5 mt-2" dir="ltr">
//                     <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//                     <div className="w-2.5 h-2.5 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//                     <div className="w-2.5 h-2.5 bg-red-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//                 </div>
//             </div>
//         </div>
//     );
// }
