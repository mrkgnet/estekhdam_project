"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const authority = params.get("Authority");
  const status = params.get("Status");

  const [result, setResult] = useState<string>("در حال بررسی پرداخت...");

  useEffect(() => {
    if (!orderId || !authority) return;

    if (status !== "OK") {
      setResult("پرداخت توسط کاربر لغو شد.");
      return;
    }

    fetch("/api/payment/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, authority }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setResult(`✅ پرداخت موفق. کد پیگیری: ${data.refId}`);
        } else {
          setResult("❌ پرداخت ناموفق بود");
        }
      })
      .catch(() => {
        setResult("خطا در بررسی پرداخت");
      });
  }, [orderId, authority, status]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>{result}</h1>
    </div>
  );
}
