import HeaderTopComponnet from "@/components/header/HeaderTopComponnet";
import NavbarUser from "@/components/navbar/Navbar";

import SideBarUserComponent from "@/components/user/sidebar-user/SideBarUserComponent";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderTopComponnet />
        <NavbarUser />
      <div className="flex flex-1">
         <SideBarUserComponent />
        <main className="flex-1 max-w-7xl mx-auto p-6  transition-all duration-300 text-13 sm:text-14 md:text-15">{children}</main>
      </div>
    </div>
  );
}
