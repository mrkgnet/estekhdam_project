import type { Metadata } from "next";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import SideBar from "@/components/user/Sidebar";




const iransans = localFont({
  src: [
    {
      // path: "./fonts/IRANSansWeb_FaNum.ttf",
       path: "./fonts/IRANSansWeb_Medium_FaNum.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-iransans",
  display: "swap",
});




export const metadata: Metadata = {
  title: "فروشگاه بازار هوش",
  description: "فروشگاه بازار هوش",
  other: {
    enamad: "61003738",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${iransans.className} bg-white text-slate-900`} suppressHydrationWarning>


        <NextTopLoader color="#ef4444" height={2} showSpinner={false} />

        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: { fontFamily: "inherit", direction: "rtl" },
            }}
          />

          {/* صفحه */}
          <div className="min-h-screen flex flex-col">
           
            <main className="  ">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
