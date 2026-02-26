import type { Metadata } from "next";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";


import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import SideBar from "@/components/Sidebar";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={` bg-slate-50 text-slate-900`}>
        <NextTopLoader color="#ef4444" height={3} showSpinner={false} />

        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: { fontFamily: "inherit", direction: "rtl" },
            }}
          />

          {/* صفحه */}
          <div className="min-h-screen flex flex-col">
            

            <div className="flex flex-1">
         
              <main className="flex-1 container mx-auto p-6 bg-slate-50 transition-all duration-300">{children}</main>
            </div>

           
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
