// api/payment/jwtVerify/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const VERIFY_URL = "https://api.zarinpal.com/pg/v4/payment/verify.json";

export async function POST(req: Request) {
  try {
    const { orderId, authority } = await req.json();

    if (!orderId || !authority) {
        return NextResponse.json({ ok: false, message: "اطلاعات سفارش یا کد تایید یافت نشد." }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      select: { id: true, pricePaid: true, status: true, refId: true },
    });

    if (!order) {
      return NextResponse.json({ ok: false, message: "سفارش یافت نشد." }, { status: 404 });
    }

    if (order.status === "SUCCESS") {
      return NextResponse.json({ ok: true, refId: order.refId });
    }

    const merchant_id = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchant_id) {
      return NextResponse.json({ ok: false, message: "تنظیمات درگاه (Merchant ID) انجام نشده است." }, { status: 500 });
    }

    // ارسال درخواست تایید به زرین‌پال
    const zpRes = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        merchant_id,
        amount: order.pricePaid * 10, 
        authority: authority,
      }),
    });

    const zp = await zpRes.json();
    
    const code = zp?.data?.code;
    const refId = zp?.data?.ref_id;

    if (code === 100 || code === 101) {
      // آپدیت موفقیت آمیز سفارش در دیتابیس (بدون paidAt)
      await db.order.update({
        where: { id: orderId },
        data: {
          status: "SUCCESS",
          refId: refId ? String(refId) : (order.refId || null),
          // paidAt حذف شد چون در دیتابیس شما وجود ندارد
        },
      });
      return NextResponse.json({ ok: true, refId: refId || order.refId });
    }

    // اگر تراکنش ناموفق بود
    await db.order.update({ where: { id: orderId }, data: { status: "FAILED" } });
    
    const errorMessage = zp?.errors?.message || "تایید پرداخت توسط بانک انجام نشد.";
    return NextResponse.json({ ok: false, message: errorMessage }, { status: 400 });
    
  } catch (e) {
    console.error("Payment verify error:", e); // این لاگ الان دارد خطای Prisma را نشان می‌دهد
    return NextResponse.json({ ok: false, message: "خطای داخلی سرور" }, { status: 500 });
  }
}
