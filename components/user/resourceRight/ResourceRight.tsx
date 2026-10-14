"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Clock,
  CheckCircle2,
  Info,
  XCircle,
  DownloadCloud,
  Loader2,
  Sparkles,
  ArrowLeft,
  Crown,
  HelpCircle,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
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
  downloadUrl?: string;
  _count?: {
    questions?: number;
  };
};

type Props = { product: Product };

/* =========================
    UI Atoms & Styles
========================= */
const cardContainer =
  "bg-white rounded-2xl border border-slate-400 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300";

const statItemBase =
  "bg-slate-50/80 hover:bg-slate-100/70 border border-slate-300 rounded-xl p-3 flex items-center justify-between gap-3 transition-colors";

const btnPrimary =
  "w-full h-12 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-500/25 disabled:opacity-60 disabled:pointer-events-none";

const btnSecondary =
  "w-full h-12 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200/80 hover:border-slate-600 active:scale-[0.98] border border-slate-400";

const btnAccent =
  "w-full h-12 rounded-xl flex items-center justify-center gap-2.5 font-bold text-sm text-white bg-gradient-to-r from-amber-500 via-indigo-600 to-blue-600 hover:opacity-95 active:scale-[0.98] shadow-lg shadow-indigo-500/25";

const shimmerEffect = (
  <style jsx global>{`
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
    .skeleton-wave {
      background: linear-gradient(
        90deg,
        #f1f5f9 0%,
        #e2e8f0 40%,
        #f8fafc 50%,
        #e2e8f0 60%,
        #f1f5f9 100%
      );
      background-size: 200% 100%;
      animation: shimmer 1.8s infinite linear;
    }
  `}</style>
);

/* =========================
    Subcomponents
========================= */
function StatusBanner({
  tone = "neutral",
  icon,
  text,
}: {
  tone?: "neutral" | "info" | "success" | "danger";
  icon: React.ReactNode;
  text: string;
}) {
  const toneStyles = {
    danger: "bg-rose-50/90 border-rose-200/80 text-rose-700",
    success: "bg-emerald-50/90 border-emerald-200/80 text-emerald-800",
    info: "bg-blue-50/90 border-blue-200/80 text-blue-700",
    neutral: "bg-slate-50 border-slate-200/80 text-slate-600",
  }[tone];

  return (
    <div
      className={`rounded-xl px-3.5 py-3 flex items-center gap-2.5 font-medium border text-xs sm:text-[13px] leading-relaxed shadow-sm ${toneStyles}`}
    >
      <div className="shrink-0">{icon}</div>
      <span className="flex-1">{text}</span>
    </div>
  );
}

function StatusBannerSkeleton() {
  return (
    <div className="rounded-xl border border-slate-300 p-3.5 flex items-center gap-2.5 bg-slate-50/50">
      <div className="w-5 h-5 skeleton-wave rounded-full shrink-0" />
      <div className="h-4 w-3/5 skeleton-wave rounded-md" />
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
    <div className={statItemBase}>
      <div className="flex items-center gap-2.5 text-slate-600">
        <span className="text-blue-600 bg-blue-50 p-1.5 rounded-lg shrink-0">
          {icon}
        </span>
        <span className="text-xs sm:text-sm font-medium text-slate-600">
          {title}
        </span>
      </div>
      <div className="font-bold text-slate-900 text-xs sm:text-sm">
        {value !== undefined ? value : <span className="text-slate-300">—</span>}
      </div>
    </div>
  );
}

function ButtonsSkeleton({ isFreeResource }: { isFreeResource: boolean }) {
  return (
    <div className="space-y-2.5 w-full">
      <div className="w-full h-12 rounded-xl skeleton-wave" />
      {!isFreeResource && (
        <div className="w-full h-12 rounded-xl skeleton-wave" />
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="lg:col-span-3 w-full">
      {shimmerEffect}
      <div className={`${cardContainer} lg:sticky lg:top-24`}>
        <div className="p-4 sm:p-5 space-y-4 lg:space-y-5 pb-28 lg:pb-5">
          <StatusBannerSkeleton />

          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-slate-50/80 rounded-xl p-3 flex items-center justify-between border border-slate-300"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 skeleton-wave rounded-lg shrink-0" />
                  <div className="w-24 h-4 skeleton-wave rounded" />
                </div>
                <div className="w-14 h-4 skeleton-wave rounded" />
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3.5 space-y-2.5 lg:relative lg:border-none lg:bg-transparent lg:p-0">
            <div className="w-full h-12 rounded-xl skeleton-wave" />
            <div className="w-full h-12 rounded-xl skeleton-wave" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
    Main Component
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

  // بررسی وضعیت اشتراک فعال کاربر
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
  const isLoading = authLoading || (!isFreeResource && subscriptionLoading);
  const hasAccess = hasActiveSubscription;

  const topStatus = useMemo(() => {
    if (!isProductActive) {
      return {
        tone: "danger" as const,
        icon: <XCircle className="w-5 h-5 text-rose-600" />,
        text: isFreeResource
          ? "لینک دانلود موقتاً غیرفعال شده است"
          : "دسترسی به این دوره موقتاً مسدود شده است",
      };
    }

    if (isLoading) return null;

    if (isFreeResource) {
      if (isLoggedIn) {
        return {
          tone: "info" as const,
          icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
          text: "شما وارد شده‌اید و فایل آماده دانلود است",
        };
      }
      return {
        tone: "neutral" as const,
        icon: <Info className="w-5 h-5 text-slate-500" />,
        text: "برای دانلود رایگان، لطفاً وارد حساب خود شوید",
      };
    }

    if (hasActiveSubscription) {
      return {
        tone: "success" as const,
        icon: <Crown className="w-5 h-5 text-emerald-600" />,
        text: `دسترسی فعال با اشتراک ویژه (${remainingDays} روز باقی‌مانده)`,
      };
    }

    if (isLoggedIn) {
      return {
        tone: "info" as const,
        icon: <Info className="w-5 h-5 text-blue-600" />,
        text: "دسترسی به آزمون‌ها نیازمند اشتراک ویژه است",
      };
    }

    return {
      tone: "neutral" as const,
      icon: <Info className="w-5 h-5 text-slate-500" />,
      text: "جهت دسترسی به آزمون‌ها، وارد حساب خود شوید",
    };
  }, [
    isProductActive,
    isFreeResource,
    isLoading,
    isLoggedIn,
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

      {shimmerEffect}

      <div className="lg:col-span-3 w-full">
        <aside
          className={`${cardContainer} lg:sticky lg:top-24 ${
            !isProductActive ? "opacity-75" : ""
          }`}
          aria-label="اطلاعات دوره و دسترسی اشتراکی"
        >
          <div className="p-2 pb-28 lg:pb-5 space-y-4 sm:space-y-5">
            {/* ۱. بنر وضعیت دسترسی یا اخطار بالا */}
            {isLoading ? (
              <StatusBannerSkeleton />
            ) : topStatus ? (
              <StatusBanner
                tone={topStatus.tone}
                icon={topStatus.icon}
                text={topStatus.text}
              />
            ) : null}

            {/* ۲. وضعیت دسترسی دوره (رایگان / ویژه اعضای اشتراکی) */}
            {isFreeResource ? (
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 text-xs sm:text-sm font-semibold">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>نوع دسترسی</span>
                </div>
                <span className="font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg text-xs sm:text-sm">
                  کاملاً رایگان
                </span>
              </div>
            ) : (
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 text-xs sm:text-sm font-semibold">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>نوع دسترسی</span>
                </div>
                <span className="font-bold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-lg text-xs sm:text-sm">
                  اشتراک ویژه (VIP)
                </span>
              </div>
            )}

            {/* ۳. مشخصات دوره / منبع */}
            <div className="space-y-2">
              <StatBox
                icon={<FileText className="w-4 h-4" />}
                value={
                  product?._count?.questions !== undefined
                    ? `${product._count.questions.toLocaleString("fa-IR")} تست`
                    : "۰ تست"
                }
                title="تعداد سوالات"
              />
              <StatBox
                icon={<Clock className="w-4 h-4" />}
                value="۴ گزینه‌ای استاندارد"
                title="نوع آزمون"
              />
              <StatBox
                icon={<HelpCircle className="w-4 h-4" />}
                value="تشریحی و کامل"
                title="پاسخنامه"
              />
            </div>

            {/* ۴. دکمه‌های اقدام اصلی (CTA) */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3.5 sm:p-4 space-y-2.5 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] lg:relative lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none">
              {!isProductActive ? (
                <div className="w-full h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-rose-50 text-rose-700 border border-rose-200">
                  <XCircle className="w-5 h-5 text-rose-500" />
                  {isFreeResource
                    ? "دانلود در حال حاضر متوقف است"
                    : "دسترسی به این محصول متوقف شده است"}
                </div>
              ) : isLoading ? (
                <ButtonsSkeleton isFreeResource={isFreeResource} />
              ) : isFreeResource ? (
                !isLoggedIn ? (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className={btnPrimary}
                  >
                    <DownloadCloud className="w-5 h-5" />
                    ورود و دریافت رایگان فایل
                  </button>
                ) : product?.downloadUrl ? (
                  <button
                    onClick={handleDownloadClick}
                    disabled={isDownloadLoading}
                    className={btnPrimary}
                    aria-busy={isDownloadLoading}
                  >
                    {isDownloadLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <DownloadCloud className="w-5 h-5" />
                    )}
                    {isDownloadLoading
                      ? "در حال آماده‌سازی فایل..."
                      : "دانلود فایل ضمیمه"}
                  </button>
                ) : (
                  <div className="w-full h-12 rounded-xl flex items-center justify-center gap-2 font-medium text-sm bg-slate-100 text-slate-500 border border-slate-200">
                    <Info className="w-5 h-5 text-slate-400" />
                    پیوستی برای دانلود ثبت نشده است
                  </div>
                )
              ) : hasAccess ? (
                <div className="space-y-2.5">
                  <Link
                    href={`/resources/course/questions?pid=${product?.id}&pname=${product?.slug}`}
                    className={btnPrimary}
                  >
                    <span>مشاهده سوالات و آزمون</span>
                    <ArrowLeft className="w-4 h-4 mr-auto" />
                  </Link>

                  <div className="w-full h-11 rounded-xl flex items-center justify-center gap-2 font-bold text-xs sm:text-sm bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    دسترسی فعال با اشتراک ویژه
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <Link href={`/plans`} className={btnAccent}>
                    <Crown className="w-4 h-4 text-amber-300" />
                    خرید اشتراک ویژه (دسترسی نامحدود)
                  </Link>

                  <Link
                    href={`/resources/course/questions?pid=${product?.id}&pname=${product?.slug}`}
                    className={btnSecondary}
                  >
                    شروع پیش‌نمایش رایگان
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}