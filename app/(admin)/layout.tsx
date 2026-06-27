import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";
import NavbarAdmin from "@/components/admin/NavbarAdmin";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  description: "مدیریت سایت",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // کل صفحه به صورت یک ستون با حداقل ارتفاع کل صفحه
    <div className="flex flex-col  bg-slate-100">
      
      {/* ردیف بالا: نوبار */}
      <NavbarAdmin />

      {/* ردیف پایین: شامل سایدبار و محتوای اصلی */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* سایدبار در سمت راست (در صورت راست‌چین بودن سایت) */}
        <aside className="z-40">
          <Sidebar />
        </aside>
        
        {/* محتوای اصلی که بقیه فضای باقیمانده را پر می‌کند */}
        <main className=" min-w-0  m-auto flex-1 flex flex-col ">
          {children}
        </main>

      </div>
    </div>
  );
}
