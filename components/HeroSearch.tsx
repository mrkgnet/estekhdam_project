"use client"
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function QuickAccessHero() {
 const popularTags = [
    
    { name: "🏫 آموزش و پرورش", href: "/" },
    { name: "🏥 وزارت بهداشت", href: "/" },
    { name: "⚖️ قوه قضاییه", href: "/" },
    { name: "🛢️ شرکت نفت", href: "/" },
    { name: "🏢 تامین اجتماعی", href: "/" }
  ];

  // متنی که می‌خواهیم تایپ شود
  const fullText = "جامع‌ترین بانک سوالات و منابع استخدامی کشور";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // تنظیم سرعت تایپ و پاک کردن
    const typingSpeed = isDeleting ? 50 : 100;

    const handleTyping = () => {
      if (!isDeleting) {
        // در حال تایپ کردن
        if (displayText.length < fullText.length) {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        } else {
          // مکث بعد از اتمام تایپ، سپس شروع به پاک کردن
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // در حال پاک کردن
        if (displayText.length > 0) {
          setDisplayText(fullText.slice(0, displayText.length - 1));
        } else {
          // مکث بعد از پاک شدن کامل، سپس شروع مجدد تایپ
          setIsDeleting(false);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, fullText]);

  return (
    <div className="bg-white rounded p-8 border   border-slate-200 shadow-sm text-center mb-6 relative overflow-hidden">
        {/* یک دایره تزئینی محو در پس زمینه */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-blue-50 rounded-full blur-3xl z-0"></div>

        <div className="relative ">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
                <Briefcase size={32} />
            </div>
            
            <h1 className=" font-bold text-slate-600 text-15 sm:text-18 md:text-18 text-gray-800  mb-3 h-10 flex justify-center items-center ">
                {displayText}
                {/* نشانگر چشمک زن ماشین تحریر */}
                <span className="inline-block w-[3px] h-8 bg-blue-600 ml-1 animate-pulse"></span>
            </h1>
            
            <p className="text-slate-600  mb-8 max-w-xl mx-auto ">
                وقت خود را برای پیدا کردن منابع هدر ندهید. ما تمام سوالات ادوار گذشته را با پاسخ تشریحی برای شما آماده کرده‌ایم.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
                {popularTags.map((tag, index) => (
                    // تغییر button به Link
                    <Link 
                        key={index} 
                        href={tag.href}
                        className="px-4 py-2 text-slate-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200  hover:text-blue-700   rounded-xl transition-all cursor-pointer"
                    >
                       <span> {tag.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    </div>
  );
}
