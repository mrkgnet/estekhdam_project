"use server";

import fs from 'fs/promises';
import path from 'path';

export async function getGovernmentGalleryImages() {
  try {
    // پیدا کردن مسیر دقیق پوشه در سرور
    const dirPath = path.join(process.cwd(), 'public', 'images', 'government');
    
    // خواندن محتویات پوشه
    const files = await fs.readdir(dirPath);

    // فیلتر کردن فایل‌ها تا فقط عکس‌ها را برگردانیم
    // و ساختن مسیر نسبی (همان چیزی که مرورگر می‌فهمد)
    const imagePaths = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => `/images/government/${file}`);

    return { success: true, images: imagePaths };
  } catch (error) {
    console.error("خطا در خواندن پوشه گالری:", error);
    // اگر پوشه وجود نداشت یا خطایی رخ داد، یک آرایه خالی برمی‌گردانیم
    return { success: false, images: [] };
  }
}
