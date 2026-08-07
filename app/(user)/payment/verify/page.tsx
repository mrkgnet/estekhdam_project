// file: app/payment/verify/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaCopy,
  FaCheck,
} from 'react-icons/fa';

// ====================================================================
//  Reusable UI Components
// ====================================================================

const LoadingState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center text-center text-gray-700">
    <FaSpinner className="animate-spin text-blue-500 text-4xl mb-3" />
    <p className="text-sm sm:text-base font-semibold">{message}</p>
  </div>
);

interface ResultCardProps {
  icon: React.ReactNode;
  title: string;
  message?: string;
  children?: React.ReactNode;
}

const ResultCard = ({ icon, title, message, children }: ResultCardProps) => (
  <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 max-w-sm w-full text-center transform transition-all hover:shadow-2xl duration-300">
    <div className="flex justify-center mb-4 animate-pulse-once">{icon}</div>
    <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{title}</h1>
    {message && <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">{message}</p>}
    <div className="mt-4">{children}</div>
  </div>
);

// ====================================================================
//  Main Verification Component (Uses useSearchParams)
// ====================================================================
function VerifyComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State Management
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refId, setRefId] = useState<string | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // --- Get data from URL and localStorage ---
    const authority = searchParams.get('Authority');
    const status = searchParams.get('Status');
    const orderId = searchParams.get('orderId') || localStorage.getItem('orderId');

    // --- Handle User Cancellation ---
    if (status && status !== 'OK') {
      setIsCancelled(true);
      setIsLoading(false);
      return;
    }

    // --- Validate inputs ---
    if (!authority || !orderId) {
      setError('اطلاعات پرداخت ناقص است. لطفا مجددا تلاش کنید.');
      setIsLoading(false);
      return;
    }

    // --- Call verification API ---
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ authority, orderId }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsSuccess(true);
          setRefId(data.refId);
          localStorage.removeItem('orderId'); // Clean up
        } else {
          setError(
            data.message || 'خطا در تایید پرداخت. لطفا با پشتیبانی تماس بگیرید.'
          );
        }
      } catch (err) {
        setError('خطای ارتباط با سرور. لطفا اتصال اینترنت خود را بررسی کنید.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  // اکشن کپی کردن شماره پیگیری در حافظه
  const handleCopyRefId = () => {
    if (refId) {
      navigator.clipboard.writeText(refId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // --- Render UI based on state ---
  const containerClasses =
    'min-h-screen flex items-center justify-center bg-gray-100 p-4';

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <LoadingState message="در حال بررسی اطلاعات پرداخت شما... لطفاً شکیبا باشید." />
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className={containerClasses}>
        <ResultCard
          icon={<FaExclamationTriangle className="text-yellow-500 text-5xl" />}
          title="پرداخت لغو شد"
          message="شما از ادامه فرآیند پرداخت انصراف دادید."
        >
          <button
            onClick={() => router.push('/plans')}
            className="w-full bg-gray-600 text-white py-2.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-700 transition-colors cursor-pointer"
          >
            بازگشت به صفحه خرید اشتراک
          </button>
        </ResultCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClasses}>
        <ResultCard
          icon={<FaTimesCircle className="text-red-500 text-5xl" />}
          title="پرداخت ناموفق"
          message={error}
        >
          <button
            onClick={() => router.push('/cart')}
            className="w-full bg-red-600 text-white py-2.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer"
          >
            تلاش مجدد و بازگشت به سبد خرید
          </button>
        </ResultCard>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className={containerClasses}>
        <ResultCard
          icon={<FaCheckCircle className="text-green-500 text-5xl" />}
          title="پرداخت با موفقیت انجام شد"
          message="دسترسی شما به محصول خریداری شده ایجاد شد."
        >
          {refId && (
            <div className="bg-gray-50 p-3 rounded-lg text-center  border border-gray-200">
              <span className="text-[11px] text-gray-500 block mb-1">
                شماره پیگیری تراکنش:
              </span>
              <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-gray-200 shadow-sm">
                <span className="text-sm font-bold text-gray-800 tracking-wider font-mono select-all">
                  {refId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyRefId}
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer shrink-0"
                  title="کپی شماره پیگیری"
                >
                  {isCopied ? (
                    <>
                      <FaCheck className="text-green-600 text-[10px]" />
                      <span className="text-green-600">کپی شد</span>
                    </>
                  ) : (
                    <>
                      <FaCopy className="text-[10px]" />
                      <span>کپی</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          <Link
            href="/ddashboard"
            className="w-full block bg-blue-600 text-white py-2.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors mb-2"
          >
            مشاهده سفارش‌ها
          </Link>
          <Link
            href="/"
            className="w-full block text-blue-600 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-50 transition-colors"
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
//  Wrapper for Suspense (Required for useSearchParams in App Router)
// ====================================================================
export default function PaymentVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <LoadingState message="در حال بارگذاری صفحه..." />
        </div>
      }
    >
      <VerifyComponent />
    </Suspense>
  );
}