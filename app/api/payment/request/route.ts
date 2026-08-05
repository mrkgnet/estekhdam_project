import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { infoCurentUser } from "@/lib/auth";

const REQUEST_URL = "https://api.zarinpal.com/pg/v4/payment/request.json";
const STARTPAY_BASE = "https://www.zarinpal.com/pg/StartPay/";

export async function POST(req: Request) {
  try {
    const currentUser = await infoCurentUser();
    
    if (!currentUser || !currentUser.userId) {
      return NextResponse.json(
        { ok: false, message: "لطفا ابتدا وارد حساب کاربری خود شوید." },
        { status: 401 }
      );
    }

    const userId = currentUser.userId;

    const { items } = (await req.json()) as {
      items: { productId: string; quantity: number }[];
    };

    const firstItem = items && items.length > 0 ? items[0] : null;

    if (!firstItem || !firstItem.productId) {
      return NextResponse.json(
        { ok: false, message: "سبد خرید نامعتبر است." },
        { status: 400 }
      );
    }

    const product = await db.subscriptionPlan.findUnique({
      where: { id: firstItem.productId },
      select: { id: true, title: true, price: true, discountPrice: true },
    });

    if (!product) {
      return NextResponse.json(
        { ok: false, message: "محصول یافت نشد." },
        { status: 400 }
      );
    }

    // محاسبه درست قیمت پرداختی (جلوگیری از صفر یا منفی شدن در صورت وجود discountPrice صفر)
    const currentPrice =
      product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
        ? product.discountPrice
        : product.price;

    const quantity = Math.max(1, Math.floor(firstItem.quantity || 1));
    const pricePaid = currentPrice * quantity;

    if (pricePaid <= 0) {
      return NextResponse.json(
        { ok: false, message: "مبلغ سفارش نامعتبر است." },
        { status: 400 }
      );
    }

    // ایجاد سفارش جدید در دیتابیس
    const order = await db.order.create({
      data: {
        userId,
        productId: product.id,
        status: "PENDING",
        pricePaid: pricePaid,
      },
      select: { id: true, pricePaid: true },
    });

    // ثبت نوتیفیکیشن
    await db.notification.create({
      data: {
        type: "NEW_ORDER",
        message: `سفارش جدید ثبت شد`,
        referenceId: order.id,
        isRead: false,
      },
    }).catch((err) => console.error("Notification creation error:", err));

    const merchant_id = process.env.ZARINPAL_MERCHANT_ID;
    const callbackBase = process.env.ZARINPAL_CALLBACK_URL;

    if (!merchant_id || !callbackBase) {
      return NextResponse.json(
        { ok: false, message: "تنظیمات درگاه (Merchant ID یا Callback) انجام نشده است." },
        { status: 500 }
      );
    }

    const callback_url = `${callbackBase}?orderId=${order.id}`;

    // ارسال درخواست به زرین‌پال
    const zpRes = await fetch(REQUEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        merchant_id,
        amount: order.pricePaid * 10, // تبدیل تومان به ریال
        callback_url,
        description: `پرداخت سفارش ${order.id}`,
      }),
    });

    const zp = await zpRes.json();
    const code = zp?.data?.code;
    const authority = zp?.data?.authority as string | undefined;

    if (code !== 100 || !authority) {
      await db.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      }).catch(() => {});

      return NextResponse.json(
        {
          ok: false,
          message: zp?.errors?.message || "خطا در ایجاد تراکنش از سمت درگاه بانک",
          zp,
        },
        { status: 400 }
      );
    }

    // ذخیره Authority دریافتی از زرین‌پال
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
    console.error("Payment Request Error:", err);
    return NextResponse.json(
      { ok: false, message: "خطای داخلی سرور" },
      { status: 500 }
    );
  }
}