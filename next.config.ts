import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ۱. نادیده گرفتن خطاهای تایپ‌اسکریپت در زمان بیلد (فقط در صورت ضرورت)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ۲. تنظیمات تصاویر
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["trustseal.enamad.ir"],
    remotePatterns: [
      { protocol: "https", hostname: "account4all.ir" },
      {
        protocol: "https",
        hostname: "estekhdampro.hot.ir-central1.arvanstorage.ir",
        port: "",
        pathname: "/**",
      },
      { protocol: "https", hostname: "mrkg.s3.ir-thr-at1.arvanstorage.ir" },
      {
        protocol: "https",
        hostname: "fm-2dnm-estekhdamt.runflare.run",
        pathname: "/data/**",
      },
      // 👇 این بخش برای رفع خطای عکس‌های جدید اضافه شد 👇
      {
        protocol: "https",
        hostname: "s3.ir-tbz-sh1.arvanstorage.ir",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // ۳. فعال کردن حالت standalone برای استقرار در لیارا یا داکر
  //output: 'standalone',

  // ۴. فعال‌سازی آدرس‌دهی تایپ‌دار (بسیار مهم برای امنیت مسیرها)
  experimental: {
    typedRoutes: true,
  },

  // ۵. جلوگیری از نمایش هشدارهای غیرضروری در کنسول (اختیاری)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
