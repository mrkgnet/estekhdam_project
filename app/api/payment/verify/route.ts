import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const VERIFY_URL = "https://api.zarinpal.com/pg/v4/payment/verify.json";

export async function POST(req: Request) {
  try {
    const { orderId, authority } = (await req.json()) as {
      orderId: string;
      authority: string;
    };

    const order = await db.order.findUnique({
      where: { id: orderId },
      select: { id: true, totalPrice: true, authority: true },
    });

    if (!order) {
      return NextResponse.json({ ok: false, message: "Order not found" }, { status: 404 });
    }

    const merchant_id = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchant_id) {
      return NextResponse.json({ ok: false, message: "Missing merchant id" }, { status: 500 });
    }

    const auth = order.authority ?? authority;

    const zpRes = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant_id,
        amount: order.totalPrice,
        authority: auth,
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
          refId: refId ? String(refId) : null,
          paidAt: new Date(),
        },
      });
      return NextResponse.json({ ok: true, refId });
    }

    await db.order.update({ where: { id: orderId }, data: { status: "FAILED" } });
    return NextResponse.json({ ok: false, message: "Payment failed", zp }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}