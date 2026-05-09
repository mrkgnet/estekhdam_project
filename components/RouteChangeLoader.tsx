"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useLoading } from "@/providers/loading-provider"

export default function RouteChangeLoader() {
  const pathname = usePathname()
  const { show, hide } = useLoading()

  useEffect(() => {
    show()

    const t = setTimeout(() => {
      hide()
    }, 800) // کوتاه و شیک

    return () => clearTimeout(t)
  }, [pathname])

  return null
}
