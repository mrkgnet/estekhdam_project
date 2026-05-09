"use client"

import { motion } from "framer-motion"

export default function GlassLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
      <div
        className="
          flex flex-col items-center gap-4
          rounded-2xl
          bg-white/20
          backdrop-blur-md
          px-14 py-12
          border border-white/30
          shadow-lg
        "
      >
        {/* dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="h-3 w-3 rounded-full bg-black/80"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <span className="text-sm font-bold">
          استخدام پرو
        </span>
      </div>
    </div>
  )
}
