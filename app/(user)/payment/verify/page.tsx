// file: app/payment/verify/page.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense, type ReactNode } from "react";
import Link from "next/link";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaCopy,
  FaCheck,
} from "react-icons/fa";

// ====================================================================
// Reusable UI Components
// ====================================================================

const LoadingState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center text-center text-gray-700">
    <FaSpinner className="mb-4 animate-spin text-5xl text-blue-500" />
    <p className="text-lg font-semibold">{message}</p>
  </div>
);

interface ResultCardProps {
  icon: ReactNode;
  title: string;
  message: string;
  children?: ReactNode;
}

const ResultCard = ({
  icon,
  title,
  message,
  children,
}: ResultCardProps) => (
  <div className="w-full max-w-md transform rounded bg-white p-6 text-center shadow-lg transition-all duration-300 hover:shadow-2xl sm:p-8">
    <div className="mb-5 flex justify-center">{icon}</div>

    <h1 className="mb-3 text-2xl font-bold text-gray-800">{title}</h1>

    <p className="mb-6 min-h-[40px] whitespace-pre-line text-gray-600">
      {message}
    </p>

    <div className="mt-8">{children}</div>
  </div>
);

// ====================================================================
// Main Verification Component
// ====================================================================

function VerifyComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refId, setRefId] = useState<string | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");
    const orderId =
      searchParams.get("orderId") || localStorage.getItem("orderId");

    // لغو پرداخت توسط کاربر
    if (status && status !== "OK") {
      setIsCancelled(true);
      setIsLoading(false);
      return;
    }

    // بررسی اطلاعات ضروری
    if (!authority || !orderId) {
      setError("اطلاعات پرداخت ناقص است. لطفا مجددا تلاش کنید.");
      setIsLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch("/api/payment/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            authority,
            orderId,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsSuccess(true);
          setRefId(data.refId);
          localStorage.removeItem("orderId");
        } else {
          setError(
            data.message ||
              "خطا در تایید پرداخت. لطفا با پشتیبانی تماس بگیرید."
          );
        }
      } catch {
        setError(
          "خطای ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید."
        );
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  // کپی شماره پیگیری
  const handleCopyRefId = async () => {
    if (!refId) return;

    try {
      await navigator.clipboard.writeText(refId);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      setIsCopied(false);
    }
  };

  const containerClasses =
    "min-h-screen flex items-center justify-center bg-gray-100 p-4";

  // حالت بارگذاری
  if (isLoading) {
    return (
      <div className={containerClasses}>
        <LoadingState message="در حال بررسی اطلاعات پرداخت شما... لطفاً شکیبا باشید." />
      </div>
    );
  }

  // حالت لغو پرداخت
  if (isCancelled) {
    return (
      <div className={containerClasses}>
        <ResultCard
          icon={
            <FaExclamationTriangle className="text-base text-yellow-500" />
          }
          title="پرداخت لغو شد"
          message="شما از ادامه فرآیند پرداخت انصراف دادید."
        >
          <button
            type="button"
            onClick={() => router.push("/plans")}
            className="w-full rounded-lg bg-gray-600 py-3 font-semibold text-white transition-colors hover:bg-gray-700"
          >
            بازگشت به صفحه خرید اشتراک
          </button>
        </ResultCard>
      </div>
    );
  }

  // حالت خطا
  if (error) {
    return (
      <div className={containerClasses}>
        <ResultCard
          icon={<FaTimesCircle className="text-base text-red-500" />}
          title="پرداخت ناموفق"
          message={error}
        >
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition-colors hover:bg-red-700"
          >
            تلاش مجدد و بازگشت به سبد خرید
          </button>
        </ResultCard>
      </div>
    );
  }

  // حالت موفقیت پرداخت
  if (isSuccess) {
    return (
      <div className={containerClasses}>
        <ResultCard
          icon={<FaCheckCircle className="text-base text-green-500" />}
          title="پرداخت با موفقیت انجام شد"
          message="دسترسی شما به محصول خریداری‌شده ایجاد شد."
        >
          {refId && (
            <div className="my-6 rounded-lg border border-gray-200 bg-gray-100 p-4">
              <p className="mb-2 text-sm text-gray-600">
                شماره پیگیری تراکنش:
              </p>

              <div className="flex items-center justify-center gap-2">
                <p
                  dir="ltr"
                  className="select-all break-all text-lg font-bold tracking-widest text-gray-800"
                >
                  {refId}
                </p>

                <button
                  type="button"
                  onClick={handleCopyRefId}
                  title={isCopied ? "کپی شد" : "کپی شماره پیگیری"}
                  aria-label={isCopied ? "شماره پیگیری کپی شد" : "کپی شماره پیگیری"}
                  className="flex shrink-0 items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  {isCopied ? (
                    <>
                      <FaCheck />
                      <span>کپی شد</span>
                    </>
                  ) : (
                    <>
                      <FaCopy />
                      <span>کپی</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <Link
            href="/ddashboard"
            className="mb-3 block w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            مشاهده سفارش‌ها
          </Link>

          <Link
            href="/"
            className="block w-full rounded-lg py-2 font-semibold text-blue-600 transition-colors hover:bg-blue-50"
          >
            بازگشت به صفحه اصلی
          </Link>
        </ResultCard>
      </div>
    );
  }

  return null;
}

// ====================================================================
// Wrapper for Suspense
// ====================================================================

export default function PaymentVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
          <LoadingState message="در حال بارگذاری صفحه..." />
        </div>
      }
    >
      <VerifyComponent />
    </Suspense>
  );
}
