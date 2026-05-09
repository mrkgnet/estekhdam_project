"use client"

import { createContext, useContext, useState } from "react"
import GlassLoader from "@/components/GlassLoader"

type LoadingContextType = {
  show: () => void
  hide: () => void
}

const LoadingContext = createContext<LoadingContextType | null>(null)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider
      value={{
        show: () => setLoading(true),
        hide: () => setLoading(false),
      }}
    >
      {children}
      {loading && <GlassLoader />}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const ctx = useContext(LoadingContext)
  if (!ctx) throw new Error("useLoading must be used inside LoadingProvider")
  return ctx
}
