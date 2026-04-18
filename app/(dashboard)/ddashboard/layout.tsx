import Sidebar from "@/components/user/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 max-w-7xl mx-auto p-6 bg-slate-50 transition-all duration-300">{children}</main>
      </div>
    </div>
  );
}
