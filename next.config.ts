import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ۱. نادیده گرفتن خطاهای تایپ‌اسکریپت در زمان بیلد (فقط در صورت ضرورت)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ۲. تنظیمات تصاویر
  images: {
    // فعال کردن فرمت‌های مدرن برای فشرده‌سازی حداکثری (اول AVIF، بعد WebP)
    formats: ['image/avif', 'image/webp'],
    
    // اجازه لود عکس از دامنه‌های خارجی
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'account4all.ir',
      },
      {
        protocol: 'https',
        hostname: 'mrkg.s3.ir-thr-at1.arvanstorage.ir',
      },
    ],
    
    // ❌ این خط باید حذف شود تا تبدیل به WebP کار کند!
    // unoptimized: true, 
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
