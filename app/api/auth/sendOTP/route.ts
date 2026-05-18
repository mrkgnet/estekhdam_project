// مسیر فایل: app/api/auth/route.ts
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone , email } = body;

    // Generate a random 5-digit code
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    // Set the expiration time to 120 seconds from now
    const expireTime = new Date(Date.now() + 120 * 1000);

    // ارسال درخواست به سرویس جدید (ایران پیامک)
    const response = await fetch("https://api.iranpayamak.com/ws/v1/sms/pattern", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Api-Key": "nh9BKMXx8UYHsqjOHSWCS00ENsDs8BEDcXk84yGy6FCEud89Sn", // API Key ایران پیامک
      },
      body: JSON.stringify({
        code: "RIB0GQlZa9", // کد الگوی پیامک (مثلا SJ3FgPrE0C)
        attributes: {
          code: code // نام متغیر در پترن شما (ممکن است var1 یا هرچیزی باشد، طبق پنل تنظیم کنید)
        },
        recipient: phone, // در سرویس جدید به صورت رشته است نه آرایه
        line_number: "50002178584000", // شماره خط ارسال کننده
        number_format: "english"
      }),
    });

    if (response.ok) {
      console.log("OTP sent successfully.......");
      const existingUser = await db.user.findUnique({
        where: { phoneNumber: phone },
      });
      let saveUser: User;
      
      if(existingUser){
        saveUser = await db.user.update({
          where: { phoneNumber: phone},
          data: { otpCode: code, email:email , otpExpires: expireTime },
        });
      }else{
        saveUser = await db.user.create({
          data: { phoneNumber: phone, email:email , otpCode: code, otpExpires: expireTime },
        });
      }

      return NextResponse.json({
        status: "success",
        message: "شماره با موفقیت در دیتابیس ذخیره شد",
        user: saveUser,
      });
    } else {
      console.error("Failed to send OTP:", response.statusText);
      return NextResponse.json({ error: "خطا در ارسال پیامک از سمت سرویس دهنده" }, { status: 500 });
    }
  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json({ error: "خطا در ارسال لطفا 2 دقیقه دیگه مجدد امتحان کنید" }, { status: 500 });
  }
}
