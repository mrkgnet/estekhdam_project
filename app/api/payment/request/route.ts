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
      return NextResponse.json({ ok: false, message: "لطفا ابتدا وارد حساب کاربری خود شوید." }, { status: 401 });
    }

    const userId = currentUser.userId;

    // ۲. اعتبارسنجی ورودی‌ها
    const body = await req.json().catch(() => null);
    if (!body || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ ok: false, message: "سبد خرید نامعتبر است." }, { status: 400 });
    }

    const firstItem = body.items[0];
    if (!firstItem || !firstItem.productId) {
      return NextResponse.json({ ok: false, message: "شناسه آیتم مورد نظر ارسال نشده است." }, { status: 400 });
    }

    const itemId = firstItem.productId;
    let pricePaid = 0;
    let orderData: {
      userId: string;
      pricePaid: number;
      status: "PENDING";
      subscriptionPlanId?: string;
      productId?: string;
    } = {
      userId,
      pricePaid: 0,
      status: "PENDING",
    };

    // ۳. بررسی آیتم: آیا SubscriptionPlan است یا Product؟
    const subPlan = await db.subscriptionPlan.findUnique({
      where: { id: itemId },
      select: { id: true, price: true, discountPrice: true },
    });

    if (subPlan) {
      // آیتم از نوع پلن اشتراک است
      const currentPrice =
        subPlan.discountPrice && subPlan.discountPrice > 0 && subPlan.discountPrice < subPlan.price
          ? subPlan.discountPrice
          : subPlan.price;

      pricePaid = currentPrice * Math.max(1, Math.floor(firstItem.quantity || 1));
      orderData.subscriptionPlanId = subPlan.id;
      orderData.pricePaid = pricePaid;
    } else {
      // اگر پلن نبود، در جدول محصولات جستجو کن
      const product = await db.product.findUnique({
        where: { id: itemId },
        select: { id: true, newPrice: true, oldPrice: true },
      });

      if (!product) {
        return NextResponse.json({ ok: false, message: "محصول یا پلن مورد نظر یافت نشد." }, { status: 404 });
      }

      const currentPrice = product.newPrice || product.oldPrice || 0;
      pricePaid = currentPrice * Math.max(1, Math.floor(firstItem.quantity || 1));
      orderData.productId = product.id;
      orderData.pricePaid = pricePaid;
    }

    if (pricePaid <= 0) {
      return NextResponse.json({ ok: false, message: "مبلغ سفارش معتبر نمی‌باشد." }, { status: 400 });
    }

    // ۴. بررسی متغیرهای محیلی (ENV)
    const merchant_id = process.env.ZARINPAL_MERCHANT_ID;
    const callbackBase = process.env.ZARINPAL_CALLBACK_URL;

    if (!merchant_id || !callbackBase) {
      return NextResponse.json(
        { ok: false, message: "تنظیمات درگاه (Merchant ID یا Callback) در فایل .env تعریف نشده است." },
        { status: 500 },
      );
    }

    // ۵. ثبت سفارش در دیتابیس
    let order;
    try {
      order = await db.order.create({
        data: orderData,
        select: { id: true, pricePaid: true },
      });
    } catch (dbErr) {
      console.error("Prisma Order Creation Failed:", dbErr);
      return NextResponse.json(
        { ok: false, message: "خطا در ایجاد سفارش در دیتابیس", error: String(dbErr) },
        { status: 500 },
      );
    }

    // ثبت اعلان به صورت Safe
    await db.notification
      .create({
        data: {
          type: "NEW_ORDER",
          message: `سفارش جدید با شماره ${order.id.slice(0, 8)} ثبت شد`,
          referenceId: order.id,
          isRead: false,
        },
      })
      .catch((err) => console.error("Notification Warning:", err));

    const callback_url = `${callbackBase}?orderId=${order.id}`;

    // ۶. ارسال درخواست به زرین‌پال
    let zpRes;
    try {
      zpRes = await fetch(REQUEST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          merchant_id,
          amount: order.pricePaid * 10, // تبدیل تومان به ریال
          callback_url,
          description: `پرداخت سفارش ${order.id}`,
        }),
      });
    } catch (netErr) {
      console.error("Zarinpal Network Exception:", netErr);
      return NextResponse.json({ ok: false, message: "خطای شبکه در ارتباط با سرور زرین‌پال" }, { status: 502 });
    }

    const zp = await zpRes.json().catch(() => null);

    if (!zp || !zp.data) {
      console.error("Invalid Response from Zarinpal:", zp);
      return NextResponse.json({ ok: false, message: "پاسخ نامعتبر از درگاه زرین‌پال دریافت شد." }, { status: 502 });
    }

    const code = zp.data.code;
    const authority = zp.data.authority as string | undefined;

    if (code !== 100 || !authority) {
      await db.order
        .update({
          where: { id: order.id },
          data: { status: "FAILED" },
        })
        .catch(() => {});

      return NextResponse.json(
        {
          ok: false,
          message: zp?.errors?.message || `کد خطای زرین‌پال: ${code}`,
        },
        { status: 400 },
      );
    }

    // ۷. ذخیره Authority زرین‌پال در دیتابیس
    await db.order.update({
      where: { id: order.id },
      data: { authority },
    });

    // ۸. بازگرداندن آدرس درگاه به فرانت‌اند
    return NextResponse.json({
      ok: true,
      orderId: order.id,
      payUrl: `${STARTPAY_BASE}${authority}`,
    });
  } catch (err: any) {
    console.error("Unhandled Payment Request Error:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "خطای غیرمنتظره سرور",
        details: err?.message || String(err),
      },
      { status: 500 },
    );
  }
}
