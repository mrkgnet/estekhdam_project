import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { infoCurentUser } from "@/lib/auth";

const REQUEST_URL = "https://api.zarinpal.com/pg/v4/payment/request.json";
const STARTPAY_BASE = "https://www.zarinpal.com/pg/StartPay/";

export async function POST(req: Request) {
  try {
    // ۱. بررسی ورود کاربر
    let currentUser;
    try {
      currentUser = await infoCurentUser();
    } catch (e) {
      console.error("Auth Exception:", e);
    }

    if (!currentUser || !currentUser.userId) {
      return NextResponse.json(
        { ok: false, message: "لطفا ابتدا وارد حساب کاربری خود شوید." },
        { status: 401 }
      );
    }

    const userId = currentUser.userId;

    // ۲. دریافت و بررسی ورودی‌ها
    const body = await req.json().catch(() => null);
    if (!body || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "سبد خرید نامعتبر است." },
        { status: 400 }
      );
    }

    const firstItem = body.items[0];
    const itemId = firstItem.planId || firstItem.productId;

    if (!firstItem || !itemId) {
      return NextResponse.json(
        { ok: false, message: "شناسه پلن مورد نظر ارسال نشده است." },
        { status: 400 }
      );
    }

    // ۳. یافتن پلن اشتراک از دیتابیس
    const subPlan = await db.subscriptionPlan.findUnique({
      where: { id: itemId },
      select: { id: true, price: true, discountPrice: true },
    });

    if (!subPlan) {
      return NextResponse.json(
        { ok: false, message: "پلن اشتراک مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    // محاسبه قیمت بر اساس تخفیف
    const currentPrice =
      subPlan.discountPrice && subPlan.discountPrice > 0 && subPlan.discountPrice < subPlan.price
        ? subPlan.discountPrice
        : subPlan.price;

    const pricePaid = currentPrice * Math.max(1, Math.floor(firstItem.quantity || 1));

    if (pricePaid <= 0) {
      return NextResponse.json(
        { ok: false, message: "مبلغ سفارش معتبر نمی‌باشد." },
        { status: 400 }
      );
    }

    // ۴. بررسی تنظیمات درگاه
    const merchant_id = process.env.ZARINPAL_MERCHANT_ID;
    const callbackBase = process.env.ZARINPAL_CALLBACK_URL;

    if (!merchant_id || !callbackBase) {
      return NextResponse.json(
        { ok: false, message: "تنظیمات درگاه (Merchant ID یا Callback) در فایل .env تعریف نشده است." },
        { status: 500 }
      );
    }

    // ۵. ثبت سفارش در دیتابیس با ارتباط صحیح با subscriptionPlan
    let order;
    try {
      order = await db.order.create({
        data: {
          userId: userId,
          subscriptionPlanId: subPlan.id, // اتصال به پلن اشتراک
          pricePaid: pricePaid,
          status: "PENDING",
        },
        select: { id: true, pricePaid: true },
      });
    } catch (dbErr) {
      console.error("Prisma Order Creation Failed:", dbErr);
      return NextResponse.json(
        { ok: false, message: "خطا در ایجاد سفارش در دیتابیس", error: String(dbErr) },
        { status: 500 }
      );
    }

    // ثبت اعلان
    await db.notification
      .create({
        data: {
          type: "NEW_ORDER",
          message: `سفارش خرید اشتراک جدید ثبت شد (کد: ${order.id.slice(0, 8)})`,
          referenceId: order.id,
          isRead: false,
        },
      })
      .catch((err) => console.error("Notification Warning:", err));

    const callback_url = `${callbackBase}?orderId=${order.id}`;

    // ۶. درخواست به زرین‌پال
    const zpRes = await fetch(REQUEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        merchant_id,
        amount: order.pricePaid * 10, // تومان به ریال
        callback_url,
        description: `پرداخت سفارش اشتراک ${order.id}`,
      }),
    });

    const zp = await zpRes.json().catch(() => null);

    if (!zp || !zp.data || zp.data.code !== 100 || !zp.data.authority) {
      await db.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      }).catch(() => {});

      return NextResponse.json(
        { ok: false, message: zp?.errors?.message || "خطا در دریافت لینک پرداخت از زرین‌پال" },
        { status: 400 }
      );
    }

    // ۷. ذخیره Authority
    await db.order.update({
      where: { id: order.id },
      data: { authority: zp.data.authority },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      payUrl: `${STARTPAY_BASE}${zp.data.authority}`,
    });
  } catch (err: any) {
    console.error("Payment Request Error:", err);
    return NextResponse.json(
      { ok: false, message: "خطای سرور", details: err?.message },
      { status: 500 }
    );
  }
}