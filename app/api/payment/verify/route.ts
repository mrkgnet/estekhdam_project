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

    // ۱. دریافت کامل اطلاعات سفارش
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        subscriptionPlan: true,
      },
    });

    if (!order) {
      return NextResponse.json({ ok: false, message: "سفارش یافت نشد." }, { status: 404 });
    }

    // اگر قبلاً موفقیت‌آمیز بوده
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

    // ۲. تایید از زرین‌پال
    const zpRes = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
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
      const finalRefId = refId ? String(refId) : order.refId || null;

      try {
        // ۳. استفاده از تراکنش ایمن پریزما
        await db.$transaction(async (tx) => {
          // الف: آپدیت وضعیت سفارش
          await tx.order.update({
            where: { id: orderId },
            data: {
              status: "SUCCESS",
              refId: finalRefId,
            },
          });

          const targetPlanId = order.subscriptionPlanId;
          const targetUserId = order.userId;

          // ب: بررسی پلن و کاربر
          if (targetPlanId && targetUserId) {
            const plan = order.subscriptionPlan || (await tx.subscriptionPlan.findUnique({ where: { id: targetPlanId } }));

            if (!plan) {
              throw new Error("اطلاعات پلن اشتراک در دیتابیس یافت نشد.");
            }

            // چک کردن اشتراک فعال برای تمدید
            const existingSub = await tx.userSubscription.findFirst({
              where: {
                userId: targetUserId,
                isActive: true,
                endDate: { gte: new Date() },
              },
              orderBy: { endDate: "desc" },
            });

            const startDate = existingSub ? new Date(existingSub.endDate) : new Date();
            const endDate = new Date(startDate);
            const daysToAdd = Number(plan.durationDays) || 30;
            endDate.setDate(endDate.getDate() + daysToAdd);

            // ج: ساخت سابسکریپشن
            await tx.userSubscription.create({
              data: {
                startDate: startDate,
                endDate: endDate,
                isActive: true,
                user: { connect: { id: targetUserId } },
                plan: { connect: { id: targetPlanId } },
                order: { connect: { id: orderId } },
              },
            });
          } else {
             // اگر خرید اشتراک نبوده (مثلا محصول عادی بوده) می‌تونید این ارور رو نادیده بگیرید
             // اما چون فوکوس شما روی اشتراک هست، لاگ می‌اندازیم:
             console.log("This order is missing planId or userId", { targetPlanId, targetUserId });
          }
        });

        return NextResponse.json({ ok: true, refId: finalRefId });
      } catch (txError: any) {
        console.error("Transaction Error:", txError);
        return NextResponse.json(
          { ok: false, message: "پرداخت تایید شد اما خطا در ثبت اشتراک رخ داد.", details: txError.message },
          { status: 500 }
        );
      }
    }

    // ۴. در صورت عدم موفقیت زرین پال
    await db.order.update({
      where: { id: orderId },
      data: { status: "FAILED" },
    });

    const errorMessage = zp?.errors?.message || "تایید پرداخت توسط بانک انجام نشد.";
    return NextResponse.json({ ok: false, message: errorMessage }, { status: 400 });
  } catch (e: any) {
    console.error("Payment verify error:", e);
    return NextResponse.json({ ok: false, message: "خطای داخلی سرور" }, { status: 500 });
  }
}
