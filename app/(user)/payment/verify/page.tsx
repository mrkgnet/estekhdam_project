
// file: app/payment/verify/page.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

import {
  CircleCheck,
  CircleX,
  LoaderCircle,
  TriangleAlert,
  Copy,
  Check,
} from "lucide-react";

// ====================================================================
// Reusable UI Components
// ====================================================================

const LoadingState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center text-center text-gray-700">
    <LoaderCircle className="mb-3 h-10 w-10 animate-spin text-blue-500" />

    <p className="text-sm font-semibold sm:text-base">
      {message}
    </p>
  </div>
);

interface ResultCardProps {
  icon: React.ReactNode;
  title: string;
  message?: string;
  children?: React.ReactNode;
}

const ResultCard = ({
  icon,
  title,
  message,
  children,
}: ResultCardProps) => (
  <div className="w-full max-w-sm transform rounded-xl bg-white p-5 text-center shadow-lg transition-all duration-300 hover:shadow-2xl sm:p-6">
    <div className="mb-4 flex justify-center animate-pulse-once">
      {icon}
    </div>

    <h1 className="mb-2 text-lg font-bold text-gray-800 sm:text-xl">
      {title}
    </h1>

    {message && (
      <p className="mb-4 text-xs leading-relaxed text-gray-600 sm:text-sm">
        {message}
      </p>
    )}

    <div className="mt-4">
      {children}
    </div>
  </div>
);

// ====================================================================
// Main Verification Component
// Uses useSearchParams
// ====================================================================

function VerifyComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ==================================================================
  // State Management
  // ==================================================================

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refId, setRefId] = useState<string | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // ==================================================================
  // Payment Verification
  // ==================================================================

  useEffect(() => {
    // ---------------------------------------------------------------
    // Get data from URL and localStorage
    // ---------------------------------------------------------------

    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    const orderId =
      searchParams.get("orderId") ||
      localStorage.getItem("orderId");

    // ---------------------------------------------------------------
    // Handle User Cancellation
    // ---------------------------------------------------------------

    if (status && status !== "OK") {
      setIsCancelled(true);
      setIsLoading(false);
      return;
    }

    // ---------------------------------------------------------------
    // Validate inputs
    // ---------------------------------------------------------------

    if (!authority || !orderId) {
      setError(
        "اطلاعات پرداخت ناقص است. لطفا مجددا تلاش کنید."
      );

      setIsLoading(false);
      return;
    }

    // ---------------------------------------------------------------
    // Call verification API
    // ---------------------------------------------------------------

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

        // -----------------------------------------------------------
        // Successful payment
        // -----------------------------------------------------------

        if (response.ok) {
          setIsSuccess(true);
          setRefId(data.refId);

          // Clean up order ID
          localStorage.removeItem("orderId");
        } else {
          // ---------------------------------------------------------
          // Failed payment
          // ---------------------------------------------------------

          setError(
            data.message ||
              "خطا در تایید پرداخت. لطفا با پشتیبانی تماس بگیرید."
          );
        }
      } catch (err) {
        setError(
          "خطای ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید."
        );
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  // ==================================================================
  // Copy Reference ID
  // ==================================================================

  const handleCopyRefId = () => {
    if (!refId) return;

    navigator.clipboard.writeText(refId);

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  // ==================================================================
  // Container
  // ==================================================================

  const containerClasses =
    "min-h-screen flex items-center justify-center bg-gray-100 p-4";

  // ==================================================================
  // Loading
  // ==================================================================

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <LoadingState message="در حال بررسی اطلاعات پرداخت شما... لطفاً شکیبا باشید." />
      </div>
    );
  }

  // ==================================================================
  // Cancelled
  // ==================================================================

  if (isCancelled) {
    return (
      <div className={containerClasses}>
        <ResultCard
          icon={
            <TriangleAlert className="h-12 w-12 text-yellow-500 sm:h-14 sm:w-14" />
          }
          title="پرداخت لغو شد"
          message="شما از ادامه فرآیند پرداخت انصراف دادید."
        >
          <button
            type="button"
            onClick={() => router.push("/plans")}
            className="w-full cursor-pointer rounded-lg bg-gray-600 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-gray-700 sm:text-sm"
          >
            بازگشت به صفحه خرید اشتراک
          </button>
        </ResultCard>
      </div>
    );
  }

  // ==================================================================
  // Error
  // ==================================================================

  if (error) {
    return (
      <div className={containerClasses}>
        <ResultCard
          icon={
            <CircleX className="h-12 w-12 text-red-500 sm:h-14 sm:w-14" />
          }
          title="پرداخت ناموفق"
          message={error}
        >
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="w-full cursor-pointer rounded-lg bg-red-600 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 sm:text-sm"
          >
            تلاش مجدد و بازگشت به سبد خرید
          </button>
        </ResultCard>
      </div>
    );
  }

  // ==================================================================
  // Success
  // ==================================================================

  if (isSuccess) {
    return (
      <div className={containerClasses}>
        <ResultCard
          icon={
            <CircleCheck className="h-12 w-12 text-green-500 sm:h-14 sm:w-14" />
          }
          title="پرداخت با موفقیت انجام شد"
          message="دسترسی شما به محصول خریداری شده ایجاد شد."
        >
          {/* ========================================================
              Reference ID
          ======================================================== */}

          {refId && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
              <span className="mb-1 block text-[11px] text-gray-500">
                شماره پیگیری تراکنش:
              </span>

              <div className="flex items-center justify-between rounded border border-gray-200 bg-white px-2.5 py-1.5 shadow-sm">
                <span className="select-all font-mono text-sm font-bold tracking-wider text-gray-800">
                  {refId}
                </span>

                <button
                  type="button"
                  onClick={handleCopyRefId}
                  className="flex shrink-0 cursor-pointer items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
                  title="کپی شماره پیگیری"
                  aria-label="کپی شماره پیگیری"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-2.5 w-2.5 text-green-600" />

                      <span className="text-green-600">
                        کپی شد
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-2.5 w-2.5" />

                      <span>
                        کپی
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              Orders
          ======================================================== */}

          <Link
            href="/ddashboard"
            className="mb-2 block w-full rounded-lg bg-blue-600 py-2.5 text-center text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:text-sm"
          >
            مشاهده سفارش‌ها
          </Link>

          {/* ========================================================
              Home
          ======================================================== */}

          <Link
            href="/"
            className="block w-full rounded-lg py-2 text-center text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 sm:text-sm"
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
// Required for useSearchParams in App Router
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

