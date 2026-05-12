import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { infoCurentUser } from "@/lib/auth";

const REQUEST_URL = "https://api.zarinpal.com/pg/v4/payment/request.json";
const STARTPAY_BASE = "https://www.zarinpal.com/pg/StartPay/";

export async function POST(req: Request) {
  try {
    const currentUser = await infoCurentUser();

    // بررسی دسترسی کاربر
    // if (!currentUser || currentUser.role !== "user" ) {
    //   console.log("❌ Access denied: User");
    //   // ✅ مشکل اول رفع شد: استفاده از NextResponse
    //   return NextResponse.json({ success: false, message: "دسترسی غیرمجاز. لطفا وارد شوید." }, { status: 401 });
    // }

    // ✅ مشکل دوم رفع شد: استخراج userId از توکنی که در بالا گرفتیم
    const userId = currentUser.userId;

    const { items } = (await req.json()) as {
      items: { productId: string; quantity: number }[];
    };

    const firstItem = items && items.length > 0 ? items[0] : null;

    if (!firstItem || !firstItem.productId) {
      return NextResponse.json({ ok: false, message: "سبد خرید نامعتبر است." }, { status: 400 });
    }

    // بررسی محصول در دیتابیس
    const product = await db.product.findUnique({
      where: { id: firstItem.productId },
      select: { id: true, name: true, newPrice: true },
    });

    if (!product) {
      return NextResponse.json({ ok: false, message: `محصول یافت نشد.` }, { status: 400 });
    }

    // محاسبه قیمت (تعداد * قیمت محصول)
    const quantity = Math.max(1, Math.floor(firstItem.quantity || 1));
    const pricePaid = product.newPrice * quantity;

    if (pricePaid <= 0) {
      return NextResponse.json({ ok: false, message: "مبلغ نامعتبر است." }, { status: 400 });
    }

    // ایجاد سفارش بر اساس مدل Prisma شما
    const order = await db.order.create({
      data: {
        userId, // ✅ الان این متغیر مقدار دارد و ارور نمی‌دهد
        productId: product.id,
        status: "PENDING",
        pricePaid: pricePaid,
      },
      select: { id: true, pricePaid: true },
    });

    // 👈 ۲. ثبت نوتیفیکیشن با استفاده از متغیرهای صحیح
    await db.notification.create({
      data: {
        // نکته: اگر در Prisma Enum شما مقدار TICKET است، اینجا را TICKET بنویسید
        type: "NEW_ORDER",
        message: `سفارش جدید ثبت شد`, // استفاده از subject به جای title
        referenceId: order.id, // گرفتن آیدی از تیکتی که در بالا ساخته شد
        isRead: false,
      },
    });

    const merchant_id = process.env.ZARINPAL_MERCHANT_ID;
    const callbackBase = process.env.ZARINPAL_CALLBACK_URL;

    if (!merchant_id || !callbackBase) {
      return NextResponse.json({ ok: false, message: "تنظیمات درگاه انجام نشده است." }, { status: 500 });
    }

    const callback_url = `${callbackBase}?orderId=${order.id}`;

    // درخواست به زرین پال
    const zpRes = await fetch(REQUEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id,
        amount: order.pricePaid,
        callback_url,
        description: `پرداخت سفارش ${order.id}`,
      }),
    });

    const zp = await zpRes.json();
    const code = zp?.data?.code;
    const authority = zp?.data?.authority as string | undefined;

    if (code !== 100 || !authority) {
      await db.order.update({ where: { id: order.id }, data: { status: "FAILED" } }).catch(() => {});
      return NextResponse.json({ ok: false, message: "خطا در ایجاد تراکنش از سمت بانک", zp }, { status: 400 });
    }

    // ذخیره authority
    await db.order.update({
      where: { id: order.id },
      data: { authority },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      payUrl: `${STARTPAY_BASE}${authority}`,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
