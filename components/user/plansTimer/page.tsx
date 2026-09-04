"use client";

import CountdownTimer from "@/components/CountdownTimer";
import React from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PlansOffer() {
  // دیتای استاتیک
  const staticData = {
    text: "استفاده از تمامی خدمات سایت با خرید اشتراک با تخفیف",
    endAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    buttonText: "رایگان(دسترسی به تمامی امکانات سایت)",
    link: "/plans",
  };

  return (
    <div className="w-full  mx-auto  p-4  bg-amber-50/80 border border-amber-200/80 flex  sm:flex-row items-center justify-end gap-4 text-amber-950 font-medium text-13 sm:text-14 shadow-sm">
      
    
      

      {/* سمت چپ: دکمه اکشن نارنجی رنگ */}
      <Link
        href={staticData.link}
        className=" sm:w-auto shrink-0 flex items-end justify-start gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors duration-150 active:scale-98"
      >
        <span>
          رایگان(دسترسی به تمامی امکانات سایت)
        </span>
        
        <ArrowLeft size={18} />
      </Link>

    </div>
  );
}