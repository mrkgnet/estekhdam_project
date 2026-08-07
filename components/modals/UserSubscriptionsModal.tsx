"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import {
  X,
  CreditCard,
  CheckCircle2,
  XCircle,
  Trash2,
  Loader2,
  Plus,
} from "lucide-react";
import DeleteButton from "../ui/DeleteButton";
import {
  deleteUserSubscriptionAction,
  toggleSubscriptionStatusAction,
} from "@/actions/admin/plans/Actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export type SubscriptionItem = {
  id: string;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
  createdAt: Date | string;
  plan: { title: string; durationDays: number; price: number };
  order: { pricePaid: number; refId: string | null; status: string } | null;
};

type Props = {
  subscriptions: SubscriptionItem[];
  userName?: string | null;
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
};

function SkeletonWave({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200/80 ${className}`} />;
}

function ModalSkeleton() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      dir="rtl"
    >
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded bg-white shadow-xl border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <SkeletonWave className="h-5 w-5 rounded-full" />
            <SkeletonWave className="h-4 w-56" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonWave className="h-9 w-40 rounded-lg" />
            <SkeletonWave className="h-8 w-8 rounded-lg" />
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <th key={i} className="px-4 py-3">
                      <SkeletonWave className="h-4 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 5 }).map((_, rowIdx) => (
                  <tr key={rowIdx}>
                    {Array.from({ length: 7 }).map((_, colIdx) => (
                      <td key={colIdx} className="px-4 py-3.5">
                        <SkeletonWave
                          className={`h-4 ${
                            colIdx === 0 ? "w-32" : colIdx === 4 ? "w-24" : "w-20"
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50/40 px-5 py-4">
            <SkeletonWave className="h-4 w-40 mb-3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <SkeletonWave className="h-10 w-full rounded-lg" />
              <SkeletonWave className="h-10 w-full rounded-lg" />
              <SkeletonWave className="h-10 w-full rounded-lg" />
            </div>
            <SkeletonWave className="h-9 w-32" />
          </div>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <SkeletonWave className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

const getSubscriptionDays = (startDate: Date | string, endDate: Date | string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

export default function UserSubscriptionsModal({
  subscriptions,
  userName,
  userId,
  isOpen,
  onClose,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localSubs, setLocalSubs] = useState<SubscriptionItem[]>(subscriptions);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [showAddRow, setShowAddRow] = useState(false);
  const [previousDays, setPreviousDays] = useState<number>(0);
  const [addedDays, setAddedDays] = useState<number>(30);
  const [isAdding, setIsAdding] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const latestSubscription = useMemo(() => {
    if (!localSubs.length) return null;

    return [...localSubs].sort((a, b) => {
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    })[0];
  }, [localSubs]);

  const computedPreviousDays = latestSubscription
    ? getSubscriptionDays(latestSubscription.startDate, latestSubscription.endDate)
    : 0;

  const totalDays = Number(previousDays || 0) + Number(addedDays || 0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setLocalSubs(subscriptions);
      setShowAddRow(false);
      setAddedDays(30);

      const latest = [...subscriptions].sort((a, b) => {
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      })[0];

      const initialPreviousDays = latest
        ? getSubscriptionDays(latest.startDate, latest.endDate)
        : 0;

      setPreviousDays(initialPreviousDays);
    }
  }, [subscriptions, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;
  if (!isMounted) return <ModalSkeleton />;

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setPendingId(id);
    setLocalSubs((prev) =>
      prev.map((subscription) =>
        subscription.id === id
          ? { ...subscription, isActive: !currentStatus }
          : subscription
      )
    );

    startTransition(async () => {
      const result = await toggleSubscriptionStatusAction(id, currentStatus);

      if (result.success) {
        toast.success("وضعیت اشتراک با موفقیت تغییر کرد.");
        router.refresh();
      } else {
        setLocalSubs((prev) =>
          prev.map((subscription) =>
            subscription.id === id
              ? { ...subscription, isActive: currentStatus }
              : subscription
          )
        );
        toast.error(result.message || "خطا در تغییر وضعیت اشتراک.");
      }

      setPendingId(null);
    });
  };

  const handleAddSubscription = async () => {
    if (!userId) return;

    if (previousDays < 0) {
      toast.error("تعداد روزهای قبلی نمی‌تواند منفی باشد.");
      return;
    }

    if (addedDays <= 0) {
      toast.error("روزهای جدید باید بزرگتر از صفر باشد.");
      return;
    }

    if (totalDays <= 0) {
      toast.error("مجموع نهایی اشتراک باید بزرگتر از صفر باشد.");
      return;
    }

    setIsAdding(true);

    try {
      // اینجا اکشن واقعی سمت سرور را صدا بزن
      // مثال:
      // const result = await addUserSubscriptionAction({
      //   userId,
      //   previousDays,
      //   addedDays,
      //   totalDays,
      // });
      //
      // if (!result.success) {
      //   toast.error(result.message || "خطا در افزودن اشتراک.");
      //   return;
      // }

      toast.success(`اشتراک با مجموع ${totalDays} روز ثبت شد.`);
      setShowAddRow(false);
      router.refresh();
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      dir="rtl"
    >
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded bg-white shadow-xl border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-800 font-semibold text-15 sm:text-16 flex-wrap">
            <CreditCard size={20} className="text-blue-600 shrink-0" />
            <span>پلن‌های اشتراکی کاربر {userName ? `(${userName})` : ""}</span>

            <button
              onClick={() => setShowAddRow((value) => !value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-13 font-medium transition-colors cursor-pointer whitespace-nowrap ${
                showAddRow
                  ? "border-blue-300 bg-blue-100 text-blue-700"
                  : "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              <Plus size={15} />
              افزودن اشتراک به کاربر
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {localSubs && localSubs.length > 0 ? (
            <div className="overflow-x-auto rounded border border-gray-100">
              <table className="w-full text-right text-12 sm:text-14">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                    <th className="px-4 py-3 whitespace-nowrap">عنوان پلن</th>
                    <th className="px-4 py-3 whitespace-nowrap">تاریخ شروع</th>
                    <th className="px-4 py-3 whitespace-nowrap">تاریخ انقضا</th>
                    <th className="px-4 py-3 whitespace-nowrap">مبلغ پرداختی</th>
                    <th className="px-4 py-3 whitespace-nowrap">وضعیت</th>
                    <th className="px-4 py-3 whitespace-nowrap text-center">تغییر وضعیت</th>
                    <th className="px-4 py-3 whitespace-nowrap text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {localSubs.map((sub) => {
                    const isExpired = new Date(sub.endDate) < new Date();
                    const isCurrentlyActive = sub.isActive && !isExpired;
                    const isRowPending = isPending && pendingId === sub.id;

                    return (
                      <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                          <div>
                            {sub.plan?.title || "پلن نامشخص"}
                            <span className="block text-11 text-gray-400 mt-0.5">
                              {sub.plan?.durationDays} روزه
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                          {new Date(sub.startDate).toLocaleDateString("fa-IR")}
                        </td>

                        <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                          {new Date(sub.endDate).toLocaleDateString("fa-IR")}
                        </td>

                        <td className="px-4 py-3.5 font-medium whitespace-nowrap">
                          {sub.order?.pricePaid
                            ? `${sub.order.pricePaid.toLocaleString("fa-IR")} تومان`
                            : "رایگان / ثبت دستی"}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {isCurrentlyActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-12 bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={14} /> فعال
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-12 bg-rose-50 text-rose-700 border border-rose-200">
                              <XCircle size={14} /> منقضی / غیرفعال
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleToggleStatus(sub.id, sub.isActive)}
                            disabled={isRowPending}
                            title={sub.isActive ? "غیرفعال کردن" : "فعال کردن"}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              sub.isActive ? "bg-blue-600" : "bg-gray-300"
                            } ${isRowPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            {isRowPending ? (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <Loader2 size={14} className="animate-spin text-white" />
                              </span>
                            ) : (
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  sub.isActive ? "-translate-x-6" : "-translate-x-1"
                                }`}
                              />
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap text-center">
                          <DeleteButton
                            id={sub.id}
                            action={deleteUserSubscriptionAction}
                            itemName="این اشتراک"
                            className="p-1.5 text-red-600 cursor-pointer inline-flex bg-red-50 gap-1 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </DeleteButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
              این کاربر هیچ اشتراک خریداری‌شده یا فعالی ندارد.
            </div>
          )}

          {showAddRow && (
            <div className="rounded-lg border border-blue-100 bg-blue-50/40 px-5 py-4 space-y-4">
              <div className="flex items-center gap-2 text-gray-700 font-medium text-13">
                <Plus size={16} className="text-blue-600" />
                <span>اضافه به اشتراک قبلی</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-13 font-medium text-gray-700">
                    تعداد روزهای قبلی
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={previousDays}
                    onChange={(e) => setPreviousDays(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-14 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="مثلاً 30"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-13 font-medium text-gray-700">
                    اضافه کردن روزهای جدید
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={addedDays}
                    onChange={(e) => setAddedDays(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-14 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="مثلاً 15"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-13 font-medium text-gray-700">
                    مجموع نهایی
                  </label>
                  <div className="w-full rounded-lg border border-blue-200 bg-blue-100/60 px-3 py-2 text-14 font-semibold text-blue-700">
                    {totalDays} روز
                  </div>
                </div>
              </div>

              {latestSubscription ? (
                <div className="text-12 text-gray-500 leading-6">
                  مقدار اولیه روزهای قبلی از بازه{" "}
                  <span className="font-medium text-gray-700">
                    {new Date(latestSubscription.startDate).toLocaleDateString("fa-IR")}
                  </span>{" "}
                  تا{" "}
                  <span className="font-medium text-gray-700">
                    {new Date(latestSubscription.endDate).toLocaleDateString("fa-IR")}
                  </span>{" "}
                  محاسبه شده است.
                  {previousDays !== computedPreviousDays && (
                    <span className="block text-amber-700 mt-1">
                      مقدار فعلی توسط ادمین ویرایش شده است.
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-12 text-gray-500">
                  اشتراک قبلی برای این کاربر پیدا نشد و مقدار روزهای قبلی صفر در نظر گرفته شد.
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  onClick={handleAddSubscription}
                  disabled={isAdding}
                  className="sm:mr-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-13 rounded-lg transition-colors cursor-pointer font-medium whitespace-nowrap"
                >
                  {isAdding ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                  ثبت اشتراک
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-13 rounded-lg transition-colors cursor-pointer font-medium"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
