'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()

  return (
    <motion.button
      onClick={() => router.back()}
      // انیمیشن ورود ظریف
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0, ease: "easeOut" }}
      // انیمیشن‌های کلیک و هاور کلی دکمه
      whileHover="hover"
      whileTap="tap"
      variants={{
        hover: { scale: 1.02 },
        tap: { scale: 0.96 }
      }}
      className="group text-red-500 flex items-center cursor-pointer gap-2.5 px-5 py-2  bg-white border border-blue-200/80 rounded-full shadow-sm text-sm font-medium text-gray-600 transition-all hover:text-gray-900 hover:shadow-md hover:border-gray-300 hover:bg-gray-50 focus:outline-none"
    >
      <motion.div
        // انیمیشن اختصاصی برای آیکون (حرکت به سمت راست هنگام هاور)
        variants={{
          hover: { x: 4 },
        }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
      
      </motion.div>
      
      <span >بازگشت</span>
        <ArrowLeft className="w-4 h-4 text-red-500 text-gray-400 group-hover:text-blue-800 transition-colors duration-300" />
    </motion.button>
  )
}
