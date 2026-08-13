"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Clock,
  Text,
  PlayCircle,
  ShoppingBasket,
  CheckCircle2,
  Info,
  XCircle,
  DownloadCloud,
  Loader2,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { checkUserPurchaseStatus } from "@/actions/user/resources/course/checkUserPurchaseStatus/Actions";
import { incrementDownloadCountAction } from "@/actions/user/resources/course/counterDownload/Actions";
import AuthModal from "@/components/modals/AuthModal";
import { checkUserSubscriptionAction } from "@/actions/admin/plans/Actions";

/* =========================
   Types
========================= */
type Product = {
  id?: string;
  slug?: string;
  type?: "FREE_RESOURCE" | string;
  isActive?: boolean;
  oldPrice?: number;
  newPrice?: number;
  downloadUrl?: string;
  _count?: {
    questions?: number;
  };
};

type Props = { product: Product };

/* =========================
   UI atoms
========================= */
const cardBase =
  "bg-white rounded border border-slate-300 shadow-sm overflow-hidden";
const softCard = "bg-slate-50 border border-slate-300 rounded";
const btnBase =
  "w-full h-11 sm:h-12 rounded flex items-center justify-center gap-2 font-bold transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed";
const statusBase =
  "rounded p-2.5 sm:p-3 flex items-center justify-center gap-2 font-bold border";

function PriceDisplay({
  oldPrice,
  newPrice,
}: {
  oldPrice?: number;
  newPrice?: number;
}) {
  if (!newPrice) return <span className="font-black text-slate-700">—</span>;

  return (
    <div className="flex flex-col items-end justify-center leading-tight">
      {oldPrice && oldPrice > newPrice && (
        <span className="text-rose-500 line-through decoration-rose-400 text-sm">
          {oldPrice.toLocaleString("fa-IR")}
        </span>
      )}
      <div className="flex items-center gap-1">
        <span className="font-black text-slate-900">
          {newPrice.toLocaleString("fa-IR")}
        </span>
        <span className="font-normal text-slate-500">تومان</span>
      </div>
    </div>
  );
}

function StatusBanner({
  tone = "neutral",
  icon,
  text,
}: {
  tone?: "neutral" | "info" | "success" | "danger";
  icon: React.ReactNode;
  text: string;
}) {
  const toneClass =
    tone === "danger"
      ? "bg-rose-50 border-rose-200 text-rose-700"
      : tone === "success"
      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
      : tone === "info"
      ? "bg-blue-50 border-blue-200 text-blue-700"
      : "bg-slate-50 border-slate-300 text-slate-600";

  return (
    <div className={`${statusBase} ${toneClass} text-[11px] sm:text-[13px]`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

function StatBox({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value?: string | number;
}) {
  return (
    <div className="bg-slate-50 rounded p-2.5 sm:p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-slate-700">
        <span className="text-blue-600">{icon}</span>
        <span className="text-[11px] sm:text-[12px] font-medium">{title}</span>
      </div>
      {value !== undefined ? (
        <div className="font-bold text-slate-900 text-[12px] sm:text-[13px]">{value}</div>
      ) : (
        <div className="text-[11px] text-slate-400">—</div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="lg:col-span-3 w-full">
      <div className={`${cardBase} lg:sticky lg:top-24`}>
        <div className="p-2.5 sm:p-3 space-y-3 sm:space-y-4 lg:space-y-6 animate-pulse">
          <div className="h-11 sm:h-12 bg-slate-100 rounded" />
          <div className="space-y-2 sm:space-y-3">
            <div className="h-11 sm:h-12 bg-slate-100 rounded-lg" />
            <div className="h-11 sm:h-12 bg-slate-100 rounded-lg" />
            <div className="h-11 sm:h-12 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-11 sm:h-12 bg-slate-100 rounded" />
          <div className="space-y-2 sm:space-y-3">
            <div className="h-11 sm:h-12 bg-slate-100 rounded" />
            <div className="h-11 sm:h-12 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Page component
========================= */
export default function ResourceRight({ product }: Props) {
  const [mounted, setMounted] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);

  const { user, isLoggedIn, isLoading: authLoading } = useAuth();

  useEffect(() => setMounted(true), []);

  const isFreeResource = product?.type === "FREE_RESOURCE";
  const isProductActive = product?.isActive !== false;
  const productId = product?.id;
  const userId = user?.id;

  // 🟢 کوئری ۱: بررسی خرید تکی این دوره
  const {
    data: hasPurchased = false,
    isLoading: purchaseLoading,
  } = useQuery({
    queryKey: ["purchase-status", productId, userId],
    queryFn: () => checkUserPurchaseStatus(productId!, userId!),
    enabled: Boolean(isLoggedIn && userId && productId && !isFreeResource),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  // 🟢 کوئری ۲: بررسی وضعیت اشتراک کاربر
  const {
    data: subscriptionData = { hasActiveSubscription: false, remainingDays: 0 },
    isLoading: subscriptionLoading,
  } = useQuery({
    queryKey: ["subscription-status", userId],
    queryFn: () => checkUserSubscriptionAction(userId!),
    enabled: Boolean(isLoggedIn && userId && !isFreeResource),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const { hasActiveSubscription, remainingDays } = subscriptionData;

  // محاسبه لودینگ کلی
  const isLoading =
    authLoading || (!isFreeResource && (purchaseLoading || subscriptionLoading));

  // داشتن دسترسی (خرید تکی یا اشتراک فعال)
  const hasAccess = hasPurchased || hasActiveSubscription;

  const topStatus = useMemo(() => {
    if (!isProductActive) {
      return isFreeResource
        ? {
            tone: "danger" as const,
            icon: <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
            text: "لینک دانلود غیرفعال شده است",
          }
        : {
            tone: "danger" as const,
            icon: <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
            text: "فروش این محصول متوقف شده",
          };
    }

    if (isLoading) return null;

    if (isFreeResource) {
      if (isLoggedIn)
        return {
          tone: "info" as const,
          icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />,
          text: "شما وارد حساب کاربری شده‌اید",
        };
      return {
        tone: "neutral" as const,
        icon: <Info className="w-4 h-4 sm:w-5 sm:h-5" />,
        text: "برای دانلود فایل، عضو سایت شوید",
      };
    }

    if (hasActiveSubscription) {
      return {
        tone: "success" as const,
        icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />,
        text: `اشتراک فعال دارید (${remainingDays} روز باقی‌مانده)`,
      };
    }

    if (hasPurchased) {
      return {
        tone: "success" as const,
        icon: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />,
        text: "شما دانشجوی این دوره هستید",
      };
    }

    if (isLoggedIn)
      return {
        tone: "info" as const,
        icon: <Info className="w-4 h-4 sm:w-5 sm:h-5" />,
        text: "شما وارد حساب کاربری شده‌اید",
      };

    return {
      tone: "neutral" as const,
      icon: <Info className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "برای استفاده از دوره، حساب کاربری بسازید",
    };
  }, [
    isProductActive,
    isFreeResource,
    isLoading,
    isLoggedIn,
    hasPurchased,
    hasActiveSubscription,
    remainingDays,
  ]);

  const handleDownloadClick = async () => {
    if (!product?.downloadUrl || !productId || isDownloadLoading) return;
    setIsDownloadLoading(true);
    try {
      await incrementDownloadCountAction(productId);
      window.open(product.downloadUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Failed to increment download count:", err);
    } finally {
      setIsDownloadLoading(false);
    }
  };

  if (!mounted) return <Skeleton />;

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />

      <div className="lg:col-span-3 w-full text-12 sm:text-13">
        <aside
          className={`${cardBase} lg:sticky lg:top-24 ${
            !isProductActive ? "opacity-70" : ""
          }`}
          aria-label="اطلاعات محصول"
        >
          {/* ✅ کاهش ارتفاع در موبایل: padding کمتر + space کمتر + pb کمتر */}
          <div className="p-2.5 sm:p-3 pb-24 sm:pb-28 lg:pb-3 space-y-3 sm:space-y-4 lg:space-y-6">
            {!isLoading && topStatus ? (
              <StatusBanner
                tone={topStatus.tone}
                icon={topStatus.icon}
                text={topStatus.text}
              />
            ) : (
              <div className="w-full h-11 sm:h-12 bg-slate-100 animate-pulse rounded" />
            )}

            {isFreeResource ? (
              <div className={`${softCard} p-3 sm:p-4 flex items-center justify-between font-bold`}>
                <div className="text-slate-500 text-[12px] sm:text-[13px]">قیمت محصول</div>
                <span className="font-black text-emerald-600 text-[13px] sm:text-[14px]">رایگان</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                <StatBox
                  icon={<FileText className="w-4 h-4" />}
                  value={product?._count?.questions || 0}
                  title="تعداد سوالات"
                />
                <StatBox
                  icon={<Clock className="w-4 h-4" />}
                  value="۴ گزینه‌ای"
                  title="نوع پرسش"
                />
                <StatBox
                  icon={<Text className="w-4 h-4" />}
                  value="دارد"
                  title="پاسخ تشریحی"
                />
              </div>
            )}

            {/* ✅ بخش دکمه‌های ثابت پایین - ارتفاع کمتر در موبایل */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-300 p-2.5 sm:p-3 lg:p-4 space-y-2 sm:space-y-3 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] lg:relative lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
              {!isProductActive ? (
                <div className={`${btnBase} bg-rose-100 text-rose-700 border border-rose-200 text-[12px] sm:text-[13px]`}>
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  {isFreeResource ? "دانلود متوقف شده" : "فروش این محصول متوقف شده"}
                </div>
              ) : isLoading ? (
                <div className="space-y-2 sm:space-y-3 w-full">
                  <div className="w-full h-11 sm:h-12 bg-slate-100 animate-pulse rounded"></div>
                  {!isFreeResource && (
                    <div className="w-full h-11 sm:h-12 bg-slate-100 animate-pulse rounded"></div>
                  )}
                </div>
              ) : isFreeResource ? (
                !isLoggedIn ? (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 text-[12px] sm:text-[13px]`}
                  >
                    <DownloadCloud className="w-4 h-4 sm:w-5 sm:h-5" />
                    دریافت فایل
                  </button>
                ) : product?.downloadUrl ? (
                  <button
                    onClick={handleDownloadClick}
                    disabled={isDownloadLoading}
                    className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 text-[12px] sm:text-[13px]`}
                    aria-busy={isDownloadLoading}
                  >
                    {isDownloadLoading ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : (
                      <DownloadCloud className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    {isDownloadLoading ? "در حال آماده‌سازی..." : "دریافت فایل"}
                  </button>
                ) : (
                  <div className={`${btnBase} bg-slate-100 text-slate-500 border border-slate-300 text-[12px] sm:text-[13px]`}>
                    <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                    پیوستی برای دانلود موجود نیست
                  </div>
                )
              ) : hasAccess ? (
                /* 🟢 اگر کاربر اشتراک فعال داشته باشد یا دوره را خریده باشد */
                <>
                  <Link
                    href={`/resources/course/questions?pid=${product?.id}&pname=${product?.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${btnBase} bg-blue-600 text-[12px] sm:text-14 hover:bg-blue-700 text-white`}
                  >
                    <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    شروع / ادامه دوره
                  </Link>

                  <div className={`${btnBase} bg-emerald-100 text-[12px] sm:text-14 text-emerald-700 border border-emerald-200`}>
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    {hasActiveSubscription
                      ? "دسترسی فعال با اشتراک"
                      : "خریداری شده"}
                  </div>
                </>
              ) : (
                /* 🔴 اگر کاربر اشتراک نداشته باشد و دوره را نخریده باشد */
                <>
                  <Link
                    href={`/resources/course/questions?pid=${product?.id}&pname=${product?.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${btnBase} border-2 text-[12px] sm:text-14 border-slate-300 bg-slate-100 hover:bg-slate-50 text-slate-800`}
                  >
                    <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    رایگان شروع کن
                  </Link>

                  <Link
                    href={`/plans`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${btnBase} bg-[#3b5998] text-[12px] sm:text-14 hover:bg-[#334e88] text-white`}
                  >
                    <ShoppingBasket className="w-4 h-4 sm:w-5 sm:h-5" />
                    خرید اشتراک
                  </Link>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}