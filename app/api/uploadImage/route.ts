import { NextRequest, NextResponse } from "next/server";
import s3 from "@/arvanS3Client"; // مسیر فایل s3 خود را بر اساس ساختار پروژه‌تان اصلاح کنید

export async function POST(request: NextRequest) {
  try {
    // دریافت فرم‌دیتا در App Router
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "هیچ فایلی ارسال نشده است" }, { status: 400 });
    }

    // تبدیل فایل به Buffer برای ارسال به S3
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const key = Date.now() + "-" + file.name;

    const params = {
      Bucket: "mrkg",
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: "public-read",
    };

    // آپلود در آروان
    await s3.upload(params).promise();

    const fileUrl = `https://mrkg.s3.ir-thr-at1.arvanstorage.ir/${key}`;
    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
