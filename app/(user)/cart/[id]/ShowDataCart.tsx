"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  CreditCard,
  ChevronRight,
  Loader2,
  AlertCircle,
  LogIn,
  Lock,
  Calendar,
  Plus,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/modals/AuthModal";
import toast from "react-hot-toast";
import DotsLoader from "@/components/ui/Loading/DotsLoader";
import { getUserSubscriptionsActiveAction } from "@/actions/admin/plans/Actions";

// --- Type Definitions ---
type Plan = {
  id: string;
  name: string;
  newPrice: number;
  oldPrice: number;
  durationDays?: number;
  description: string | null;
};

export type UserSubscription = {
  id: string;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
  createdAt: Date | string;
  plan: {
    title: string;
    durationDays: number;
    price: number;
  };
};

type Props = {
  planData: Plan | null;
  planId: string;
};

// --- Helper Functions ---
const now = new Date();
const faDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(now);

const formatPersianDate = (dateStr: Date | string) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
};

const getRemainingDays = (endDate: Date) => {
  const current = new Date();
  const diffTime = endDate.getTime() - current.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const addDaysToDate = (startDate: Date, days: number) => {
  const result = new Date(startDate);
  result.setDate(result.getDate() + days);
  return result;
};

export default function ShowDataCart({ planData, planId }: Props) {
  const router = useRouter();
  const { isLoading: isAuthLoading, isLoggedIn, user } = useAuth();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConnectingToGateway, setIsConnectingToGateway] = useState(false);

  const [userSubs, setUserSubs] = useState<UserSubscription[]>([]);
  const [isSubsLoading, setIsSubsLoading] = useState(false);

  useEffect(() => {
    async function fetchSubscriptions() {
      if (isLoggedIn && user?.id) {
        setIsSubsLoading(true);
        const result = await getUserSubscriptionsActiveAction(user.id);
        if (result.success && result.data) {
          setUserSubs(result.data as UserSubscription[]);
        }
        setIsSubsLoading(false);
      }
    }

    fetchSubscriptions();
  }, [isLoggedIn, user?.id]);

  const proceedToCheckout = async () => {
    if (!isLoggedIn) return;

    try {
      setIsProcessing(true);
      const res = await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ planId: planId, quantity: 1 }],
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok && data.payUrl) {
        setIsConnectingToGateway(true);
        window.location.href = data.payUrl;
      } else {
        toast.error(data.message || "خطا در ایجاد تراکنش درگاه پرداخت");
        setIsProcessing(false);
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (isLoggedIn) {
      proceedToCheckout();
    }
  };

  // --- Loading State ---
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <DotsLoader />
      </div>
    );
  }

  // --- Connecting to Gateway Overlay ---
  if (isConnectingToGateway) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
        <p className="text-lg font-semibold text-slate-800">در حال اتصال به درگاه پرداخت...</p>
        <p className="text-sm text-slate-500 mt-2">لطفا کمی صبر کنید</p>
      </div>
    );
  }

  // --- Not Found State ---
  if (!planData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 p-4" dir="rtl">
        <ShoppingBag className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-slate-800 text-xl font-bold">پلن یافت نشد</h2>
        <p className="text-slate-500 mt-2 text-base">متاسفانه پلنی با این مشخصات وجود ندارد.</p>
        <button onClick={() => router.back()} className="text-green-600 mt-6 hover:underline transition-all text-base">
          بازگشت به صفحه قبل
        </button>
      </div>
    );
  }

  const discountAmount = planData.oldPrice > planData.newPrice
    ? planData.oldPrice - planData.newPrice
    : 0;

  const isButtonDisabled = isProcessing || isAuthLoading || !isLoggedIn;

  // --- محاسبات تفکیک‌شده روزها ---
  const activeSub = userSubs.length > 0 ? userSubs[0] : null;
  const currentRemainingDays = activeSub ? getRemainingDays(new Date(activeSub.endDate)) : 0;
  const newPlanDays = planData.durationDays || 30;

  const baseExpiration = activeSub ? new Date(activeSub.endDate) : new Date();
  const finalEndDate = addDaysToDate(baseExpiration, newPlanDays);
  const totalRemainingDays = currentRemainingDays + newPlanDays;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" dir="rtl">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
        }}
      />

      <div className="mx-auto max-w-3xl p-4 md:py-10 pb-28 md:pb-10 space-y-6">
        {/* Auth Alert Banner */}
        {!isLoggedIn && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-sm">شما هنوز وارد حساب کاربری خود نشده‌اید. برای پرداخت، ابتدا وارد شوید.</p>
            </div>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded transition-colors shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span>ورود / ثبت‌نام</span>
            </button>
          </div>
        )}

        {/* Page Header */}
        <header className="flex items-center gap-4 border border-slate-300 p-3 rounded bg-white shadow-sm">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 bg-white rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg text-slate-800">تایید و پرداخت اشتراک</h1>
            <p className="text-slate-500 mt-0.5 text-xs sm:text-sm">اطلاعات فاکتور و میزان اعتبار جدید خود را مشاهده کنید.</p>
          </div>
        </header>

        {/* --- Subscription Status Card (Google Style) --- */}
        {isLoggedIn && (
          <div className="w-full rounded border border-gray-300 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-medium text-gray-900">
                  وضعیت تمدید و اعتبار دسترسی
                </h3>
              </div>

              {activeSub && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  اشتراک فعال دارید
                </span>
              )}
            </div>

            {/* Body */}
            <div className="p-5">
              {isSubsLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-gray-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال محاسبه اعتبار...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Current Credit */}
                    <div className="rounded-xl border border-gray-400 bg-gray-50/60 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-700">اعتبار فعلی</span>
                      </div>
                      <p className="text-xl font-semibold text-gray-900">
                        {currentRemainingDays} <span className="text-sm font-normal text-gray-600">روز</span>
                      </p>
                    </div>

                    {/* New Plan */}
                    <div className="rounded-xl border border-gray-400 bg-gray-50/60 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded bg-amber-50 flex items-center justify-center">
                          <Plus className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="text-sm text-gray-700"> پلن جدید در صورت خرید</span>
                      </div>
                      <p className="text-xl font-semibold text-gray-900">
                        {newPlanDays} <span className="text-sm font-normal text-gray-600">روز</span>
                      </p>
                    </div>

                    {/* Total Access */}
                    <div className="rounded-xl border border-emerald-400 bg-emerald-50/60 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        </div>
                        <span className="text-sm text-emerald-700">مجموع دسترسی</span>
                      </div>
                      <p className="text-xl font-semibold text-emerald-800">
                        {totalRemainingDays} <span className="text-sm font-normal text-emerald-600">روز</span>
                      </p>
                    </div>
                  </div>

                  {/* Final Date */}
                  <div className="mt-4 rounded-xl border border-gray-300 bg-gray-50/60 px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-700">تاریخ پایان اعتبار نهایی</span>
                    <span className="text-13 md:text-15 font-medium text-gray-900">
                      {formatPersianDate(finalEndDate)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Invoice Card */}
        <div className="bg-white rounded shadow-sm border border-slate-300 overflow-hidden">
          <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 border-b border-slate-100">
            <div>
              <span className="block text-slate-500 text-xs sm:text-sm">شماره فاکتور</span>
              <span className="block tracking-wider mt-1 text-sm sm:text-base font-semibold text-slate-700">
                INV-{planId.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="block text-slate-500 text-xs sm:text-sm">تاریخ صدور</span>
              <span className="block mt-1 text-sm sm:text-base font-semibold text-slate-700">{faDate}</span>
            </div>
            <div className="col-span-2 md:col-span-1">
              <span className="block text-slate-500 text-xs sm:text-sm">وضعیت</span>
              <span className="inline-flex items-center bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full mt-1 text-xs sm:text-sm font-medium">
                در انتظار پرداخت
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                <tr>
                  <th scope="col" className="px-6 py-3 text-right font-medium">عنوان اشتراک</th>
                  <th scope="col" className="px-6 py-3 text-center font-medium">مدت</th>
                  <th scope="col" className="px-6 py-3 text-left font-medium">مبلغ (تومان)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-4 text-slate-800 font-medium text-sm sm:text-base">{planData.name}</td>
                  <td className="px-6 py-4 text-center text-slate-600 text-sm">{newPlanDays} روزه</td>
                  <td className="px-6 py-4 text-left font-medium text-slate-800 text-sm sm:text-base">
                    {planData.oldPrice.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-5 border-t border-slate-100 bg-slate-50/50">
            <div className="ml-auto max-w-xs space-y-2.5">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>جمع کل:</span>
                <span>{planData.oldPrice.toLocaleString()} تومان</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-sm text-rose-600">
                  <span>تخفیف:</span>
                  <span>{discountAmount.toLocaleString()} تومان</span>
                </div>
              )}
              <div className="border-t border-slate-200 my-1"></div>
              <div className="flex items-center justify-between text-base">
                <span className="text-slate-800 font-bold">مبلغ نهایی:</span>
                <span className="font-extrabold text-lg text-blue-600">{planData.newPrice.toLocaleString()} تومان</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <footer className="bg-white border-t border-slate-400 p-3 md:p-0 md:bg-transparent md:border-none">
          <div className="mx-auto bg-white flex items-center justify-between p-3.5 border border-slate-300 rounded shadow-sm">
            <div>
              <span className="text-slate-500 text-xs block">مبلغ قابل پرداخت</span>
              <p className="font-black text-base sm:text-lg text-slate-800">{planData.newPrice.toLocaleString()} تومان</p>
            </div>
            <button
              onClick={handlePayment}
              disabled={isButtonDisabled}
              className="w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>در حال انتقال...</span>
                </>
              ) : !isLoggedIn ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>ابتدا وارد شوید</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>پرداخت نهایی</span>
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
