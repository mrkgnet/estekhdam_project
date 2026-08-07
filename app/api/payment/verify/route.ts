import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const VERIFY_URL = "https://api.zarinpal.com/pg/v4/payment/verify.json";

export async function POST(req: Request) {
  try {
    const { orderId, authority } = await req.json();

    if (!orderId || !authority) {
      return NextResponse.json(
        { ok: false, message: "اطلاعات سفارش یا کد تایید یافت نشد." },
        { status: 400 }
      );
    }

    // ۱. دریافت اطلاعات کامل سفارش و پلن مربوطه
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        subscriptionPlan: true,
      },
    });

    if (!order) {
      return NextResponse.json({ ok: false, message: "سفارش یافت نشد." }, { status: 404 });
    }

    // جلوگیری از اجرای دوباره برای سفارش‌های از قبل موفق شده
    if (order.status === "SUCCESS") {
      return NextResponse.json({ ok: true, refId: order.refId });
    }

    const merchant_id = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchant_id) {
      return NextResponse.json(
        { ok: false, message: "تنظیمات درگاه انجام نشده است." },
        { status: 500 }
      );
    }

    // ۲. استعلام تایید از درگاه زرین‌پال
    const zpRes = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id,
        amount: order.pricePaid * 10, // تبدیل تومان به ریال
        authority: authority,
      }),
    });

    const zp = await zpRes.json();
    const code = zp?.data?.code;
    const refId = zp?.data?.ref_id;

    if (code === 100 || code === 101) {
      const finalRefId = refId ? String(refId) : order.refId || authority;

      try {
        // ۳. اجرای عملیات دیتابیس در قالب Transaction
        await db.$transaction(async (tx) => {
          // الف) آپدیت وضعیت سفارش به SUCCESS
          const updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: {
              status: "SUCCESS",
              refId: finalRefId,
            },
          });

          const targetPlanId = updatedOrder.subscriptionPlanId;
          const targetUserId = updatedOrder.userId;

          if (!targetPlanId || !targetUserId) {
            console.warn("این سفارش فاقد userId یا subscriptionPlanId است:", updatedOrder.id);
            return;
          }

          // ب) دریافت اطلاعات کامل پلن
          const plan =
            order.subscriptionPlan ||
            (await tx.subscriptionPlan.findUnique({ where: { id: targetPlanId } }));

          if (!plan) {
            throw new Error(`پلن اشتراک با شناسه ${targetPlanId} در دیتابیس یافت نشد.`);
          }

          // ج) جلوگیری از ثبت تکراری برای همین سفارش
          const existingOrderSub = await tx.userSubscription.findUnique({
            where: { orderId: updatedOrder.id },
          });

          if (existingOrderSub) {
            return; // قبلاً برای این سفارش اشتراک ثبت شده است
          }

          // د) محاسبه تاریخ شروع و انقضا با الگوی اضافه کردن به انتهای اشتراک فعلی
          const lastActiveSub = await tx.userSubscription.findFirst({
            where: {
              userId: targetUserId,
              isActive: true,
              endDate: { gte: new Date() },
            },
            orderBy: { endDate: "desc" },
          });

          const now = new Date();
          // اگر اشتراک فعال دارد، تاریخ شروع از انقضای قبلی است؛ در غیر این صورت از الان
          const startTimestamp =
            lastActiveSub && new Date(lastActiveSub.endDate).getTime() > now.getTime()
              ? new Date(lastActiveSub.endDate).getTime()
              : now.getTime();

          const daysToAdd = Number(plan.durationDays) || 30;
          const durationInMs = daysToAdd * 24 * 60 * 60 * 1000;

          const startDate = new Date(startTimestamp);
          const endDate = new Date(startTimestamp + durationInMs);

          // هـ) ثبت اشتراک در جدول UserSubscription
          await tx.userSubscription.create({
            data: {
              userId: targetUserId,
              planId: targetPlanId,
              orderId: updatedOrder.id,
              startDate: startDate,
              endDate: endDate,
              isActive: true,
            },
          });
        });

        return NextResponse.json({ ok: true, refId: finalRefId });
      } catch (txError: any) {
        console.error("خطا در ترانزاکشن ثبت اشتراک:", txError);
        return NextResponse.json(
          {
            ok: false,
            message: "پرداخت موفق بود اما خطایی در فعال‌سازی اشتراک رخ داد.",
            details: txError?.message || String(txError),
          },
          { status: 500 }
        );
      }
    }

    // ۴. در صورت ناموفق بودن پرداخت در بانک
    await db.order.update({
      where: { id: orderId },
      data: { status: "FAILED" },
    });

    const errorMessage = zp?.errors?.message || "تایید پرداخت توسط بانک انجام نشد.";
    return NextResponse.json({ ok: false, message: errorMessage }, { status: 400 });

  } catch (e: any) {
    console.error("Payment verify error:", e);
    return NextResponse.json(
      { ok: false, message: "خطای داخلی سرور", details: e?.message },
      { status: 500 }
    );
  }
}