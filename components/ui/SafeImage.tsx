// components/ui/safe-image.tsx
'use client'; // این کامپوننت هیچ هوک یا تعاملی ندارد، اما برای سازگاری بهتر می‌توان آن را کلاینت در نظر گرفت.

import NextImage, { type ImageProps } from 'next/image';

// یک آدرس برای عکس پیش‌فرض یا جایگزین
// این فایل را در پوشه public/images خود قرار دهید
const FALLBACK_SRC = '/images/placeholder.png'; 

/**
 * یک تابع کمکی برای اعتبارسنجی و اصلاح آدرس عکس
 * @param src - آدرس ورودی از دیتابیس
 * @returns - آدرس اصلاح شده و امن یا آدرس عکس جایگزین
 */
const getSafeImageUrl = (src: string | null | undefined): string => {
  // 1. بررسی مقادیر نامعتبر
  if (!src || src === "null" || src === "###" || src.trim() === "") {
    return FALLBACK_SRC;
  }

  // 2. بررسی برای لینک‌های خارجی
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // 3. اصلاح لینک‌های داخلی که با / شروع نشده‌اند
  if (!src.startsWith('/')) {
    return `/${src}`;
  }

  // 4. اگر آدرس معتبر بود، همان را برمی‌گرداند
  return src;
};

// این تایپ تمام پراپ‌های کامپوننت Image اصلی Next.js را به ارث می‌برد
type SafeImageProps = ImageProps;

const SafeImage = ({ src, alt, ...props }: SafeImageProps) => {
  const safeSrc = getSafeImageUrl(src as string | null);

  return <NextImage  src={safeSrc} alt={alt} {...props} />;
};

export default SafeImage;
