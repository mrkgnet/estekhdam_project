import { NextResponse } from 'next/server';
import { removeBackground } from '@imgly/background-removal-node';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    if (!file) return NextResponse.json({ error: 'تصویری ارسال نشده است.' }, { status: 400 });

    const originalBuffer = Buffer.from(await file.arrayBuffer());

    // مرحله ۱: تصویر اصلی رو به 1500px upscale کن تا AI بک‌گراند رو روی تصویر بزرگتر حذف کنه
    const upscaledBuffer = await sharp(originalBuffer)
      .resize({ 
        width: 1500, 
        height: 1500, 
        fit: 'inside',       // نسبت تصویر حفظ میشه
        withoutEnlargement: false,  // اجازه upscale
        kernel: sharp.kernel.lanczos3 
      })
      .png()  // حتماً PNG چون background-removal به PNG نیاز داره
      .toBuffer();

    // مرحله ۲: حذف بک‌گراند روی تصویر بزرگتر
    const blob = new Blob([upscaledBuffer], { type: 'image/png' });
    const noBgBlob = await removeBackground(blob, {
      publicPath: `file://${path.join(process.cwd(), 'node_modules/@imgly/background-removal-node/dist/')}`
    });
    const noBgBuffer = Buffer.from(await noBgBlob.arrayBuffer());

    // مرحله ۳: پردازش نهایی با کیفیت حداکثر
    const finalImageBuffer = await sharp(noBgBuffer)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .resize({ 
        width: 1500, 
        height: 1500, 
        fit: 'contain', 
        background: { r: 255, g: 255, b: 255 },
        kernel: sharp.kernel.lanczos3
      })
      .sharpen({ sigma: 1.0, m1: 0.8, m2: 0.3 })
      .modulate({ brightness: 1.02, saturation: 1.05 })
      .jpeg({ quality: 100, chromaSubsampling: '4:4:4', mozjpeg: true })
      .toBuffer();

    const fileName = `product-${Date.now()}.jpg`;
    const savePath = path.join(process.cwd(), 'public', 'products', fileName);
    await fs.mkdir(path.dirname(savePath), { recursive: true });
    await fs.writeFile(savePath, finalImageBuffer);

    return NextResponse.json({ success: true, url: `/products/${fileName}` });

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'خطا در پردازش تصویر رخ داد.' }, { status: 500 });
  }
}
