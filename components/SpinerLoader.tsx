import { Loader2 } from 'lucide-react'
import React from 'react'

export default function SpinerLoader() {
    return (
        <div>
            <div className=" inset-0 z-[60] flex flex-col items-center justify-center w-full h-full bg-white/60 backdrop-blur-[2px] gap-3 text-slate-600 transition-all duration-300">
                <Loader2 className="w-10 h-10 animate-spin text-[#2b5c9e]" />
                <span className="text-sm font-medium">در حال دریافت اطلاعات...</span>
            </div>
        </div>
    )
}
