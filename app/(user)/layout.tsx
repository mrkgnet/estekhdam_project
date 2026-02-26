// app/(user)/layout.tsx

import { Toaster } from "react-hot-toast";
import SideBar from "@/components/Sidebar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { fontFamily: "inherit", direction: "rtl" },
        }}
      />

      <div className="min-h-screen flex flex-col">
        <div className="flex flex-1">
          <SideBar />

          <main className="flex-1 max-w-7xl mx-auto p-6 bg-slate-50 transition-all duration-300">{children}</main>
        </div>
      </div>
    </>
  );
}
