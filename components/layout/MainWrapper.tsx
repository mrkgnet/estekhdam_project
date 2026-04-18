"use client";

import React from "react";
import { useUiStore } from "@/store/useUiStore";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useUiStore();

  return (
    <main
      className={`flex-1 w-full transition-all duration-300 ease-in-out mx-auto ${
        isSidebarOpen ? "max-w-7xl" : "max-w-full px-4"
      }`}
    >
      {children}
    </main>
  );
}
