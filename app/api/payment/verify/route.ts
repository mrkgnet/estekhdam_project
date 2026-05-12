import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const VERIFY_URL = "https://api.zarinpal.com/pg/v4/payment/verify.json";

export async function POST(req: Request) {
  try {
    const { orderId, authority } = await req.json();

    if (!orderId || !authority) {
        return NextResponse.json({ ok: false, message: "Order ID or Authority is missing" }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      select: { id: true, totalPrice: true, status: true, refId: true },
    });

    if (!order) {
      return NextResponse.json({ ok: false, message: "Order not found" }, { status: 404 });
    }

    if (order.status === "COMPLETED") {
      return NextResponse.json({ ok: true, refId: order.refId });
    }

    const merchant_id = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchant_id) {
      console.error("ZARINPAL_MERCHANT_ID is not defined in .env");
      return NextResponse.json({ ok: false, message: "Server configuration error" }, { status: 500 });
    }

    // ارسال درخواست به زرین‌پال برای وریفای پرداخت
    const zpRes = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        merchant_id,
        amount: order.totalPrice,
        authority: authority, // FIX: Always use the authority from the callback, not the one from the database
      }),
    });

    const zp = await zpRes.json();
    const code = zp?.data?.code;
    const refId = zp?.data?.ref_id;

    if (code === 100 || code === 101) {
      await db.order.update({
        where: { id: orderId },
        data: {
          status: "COMPLETED",
          refId: refId ? String(refId) : (order.refId || null),
          authority: authority, // Optionally update the authority to the one that was successful
          paidAt: new Date(),
        },
      });
      return NextResponse.json({ ok: true, refId: refId || order.refId });
    }

    // LOG: Log Zarinpal's response on failure for easier debugging
    console.log("Zarinpal verification failed. Response:", JSON.stringify(zp, null, 2));

    await db.order.update({ where: { id: orderId }, data: { status: "FAILED" } });
    
    // Provide a more descriptive error message
    const errorMessage = zp?.errors?.message || "Payment verification failed";
    return NextResponse.json({ ok: false, message: errorMessage, zp }, { status: 400 });
    
  } catch (e) {
    console.error("Payment verify internal server error:", e);
    return NextResponse.json({ ok: false, message: "Internal server error" }, { status: 500 });
  }
}
