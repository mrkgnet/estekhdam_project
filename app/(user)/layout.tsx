// app/(user)/layout.tsx


import HeaderTopComponnet from "@/components/header/HeaderTopComponnet";
import NavbarUser from "@/components/navbar/Navbar";
import Sidebar from "@/components/user/Sidebar";
import ShowDataSideBarUser from "@/components/user/sidebar-user/ShowDataSideBarUser";
import SideBarUserComponent from "@/components/user/sidebar-user/SideBarUserComponent";


export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>


      <div className="min-h-screen flex flex-col   ">
        <HeaderTopComponnet />
        <NavbarUser />
        <div className="flex flex-1">

          {/* <Sidebar /> */}
          <SideBarUserComponent />
          <main className=" w-full  mx-auto  sm:px-6 lg:px-8    min-w-0 flex-1 flex flex-col">{children}</main>
        </div>
      </div>
    </>
  );
}
