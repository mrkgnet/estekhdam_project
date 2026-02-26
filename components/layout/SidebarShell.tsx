"use client";

import SideBar from "@/components/Sidebar";
import { useUiStore } from "@/store/useUiStore";

export default function SidebarShell() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const closeSidebar = useUiStore((s) => s.closeSidebar);

  return (
    <>
      {/* Overlay فقط موبایل */}
      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar: موبایل کشویی، دسکتاپ ثابت و همیشه باز */}
      <div
        className={[
          "fixed top-0 right-0 h-full w-[260px] bg-white z-50",
          "transform transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "translate-x-full",
          "lg:static lg:translate-x-0 lg:h-auto lg:block", // ✅ دسکتاپ همیشه باز
        ].join(" ")}
      >
        <SideBar />
      </div>
    </>
  );
}