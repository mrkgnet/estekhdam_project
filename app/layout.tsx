import type { Metadata } from "next";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Providers from "@/components/react-query/Providers";
import { LoadingProvider } from "@/providers/loading-provider";
import HomeLoaderEffect from "@/components/RouteChangeLoader";
import RouteChangeLoader from "@/components/RouteChangeLoader";






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
  title: "استخدام پرو",
  description: "استخدام پرو",
  other: {
    enamad: "28191248", // شماره صحیح خواسته‌شده
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${iransans.className}   text-13 sm:text-13 md:text-13 `} suppressHydrationWarning>

        <Providers>
          <NextTopLoader color="#ef4444" height={2} showSpinner={false} />

          <AuthProvider>
            <Toaster
              position="top-left"
              toastOptions={{
                style: { fontFamily: "inherit", direction: "rtl" },
              }}
            />

            {/* صفحه */}
            <div className="min-h-screen flex flex-col ">
              <LoadingProvider>
              
                <main className="bg-[#F8FAFC]  ">{children}</main>
              </LoadingProvider>
              <Footer />
            </div>
          </AuthProvider>
        </Providers>


      </body>
    </html>
  );
}
