// app/payment/verify/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{
    ok: boolean;
    refId?: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    if (!orderId || !authority) {
      setResult({ ok: false, message: "اطلاعات پرداخت نامعتبر است" });
      setLoading(false);
      return;
    }

    if (status !== "OK") {
      setResult({ ok: false, message: "پرداخت توسط کاربر لغو شد" });
      setLoading(false);
      return;
    }

    fetch("/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, authority }),
    })
      .then((res) => res.json())
      .then((data) => setResult(data))
      .catch(() =>
        setResult({ ok: false, message: "خطا در ارتباط با سرور" })
      )
      .finally(() => setLoading(false));
  }, [orderId, authority, status]);

  if (loading) {
    return <p className="text-center mt-10">در حال بررسی پرداخت...</p>;
  }

  if (!result?.ok) {
    return (
      <div className="text-center mt-10 text-red-600">
        ❌ پرداخت ناموفق بود
        <br />
        {result?.message}
      </div>
    );
  }

  return (
    <div className="text-center mt-10 text-green-600">
      ✅ پرداخت با موفقیت انجام شد
      <br />
      کد رهگیری: {result.refId}
    </div>
  );
}
