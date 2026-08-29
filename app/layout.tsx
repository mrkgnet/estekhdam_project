import type { Metadata } from "next";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";

import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleAnalytics } from '@next/third-parties/google' // <--- ایمپورت

import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Providers from "@/components/react-query/Providers";
import { LoadingProvider } from "@/providers/loading-provider";
import TopBanner from "@/components/topBanner/TopBanner";
import FetchDataTopBanner from "@/components/topBanner/FetchDataTopBanner";

// ایمپورت کردن کامپوننت بنر


const iransans = localFont({
  src: [
    {
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
    enamad: "28191248",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${iransans.className} !bg-[#F8FAFC] dark:bg-slate-900 text-13 sm:text-13 md:text-13`} suppressHydrationWarning>
        <Providers>
          <NextTopLoader color="#ef4444" height={2} showSpinner={true} />

          <AuthProvider>
            <Toaster
              position="top-left"
              toastOptions={{
                style: { fontFamily: "inherit", direction: "rtl" },
              }}
            />
              <GoogleAnalytics gaId="G-WG5HJVGCMR" />

            {/* صفحه */}
            <div className="min-h-screen flex flex-col">
              
              {/* قرار دادن بنر در بالاترین قسمت صفحه */}
              <FetchDataTopBanner />

              <LoadingProvider>
                <main className="bg-white flex-1 dark:bg-slate-900">{children}</main>
               
              </LoadingProvider>
              <Footer />
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
