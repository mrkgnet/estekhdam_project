"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  X,
  CreditCard,
  CheckCircle2,
  XCircle,
  Trash2,
  Loader2,
  Plus,
  Minus,
} from "lucide-react";
import {
  deleteUserSubscriptionAction,
  toggleSubscriptionStatusAction,
  addUserSubscriptionManualAction,
  reduceUserSubscriptionManualAction,
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

export type PlanItem = {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  durationDays: number;
};

type Props = {
  subscriptions: SubscriptionItem[];
  plans?: PlanItem[];
  userName?: string | null;
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionsChange?: (updatedSubscriptions: SubscriptionItem[]) => void;
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
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50">
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
          <div className="overflow-x-auto rounded">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-gray-50">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <th key={i} className="px-4 py-3">
                      <SkeletonWave className="h-4 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 5 }).map((_, rowIdx) => (
                  <tr key={rowIdx}>
                    {Array.from({ length: 8 }).map((_, colIdx) => (
                      <td key={colIdx} className="px-4 py-3.5">
                        <SkeletonWave
                          className={`h-4 ${
                            colIdx === 0 ? "w-32" : colIdx === 5 ? "w-24" : "w-20"
                          }`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-50/50 flex justify-end">
          <SkeletonWave className="h-9 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

const getSubscriptionDays = (startDate: Date | string, endDate: Date | string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export default function UserSubscriptionsModal({
  subscriptions,
  plans = [],
  userName,
  userId,
  isOpen,
  onClose,
  onSubscriptionsChange,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localSubs, setLocalSubs] = useState<SubscriptionItem[]>(subscriptions);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [activePanel, setActivePanel] = useState<"none" | "add" | "reduce">("none");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [daysToReduce, setDaysToReduce] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setLocalSubs(subscriptions);
    onSubscriptionsChange?.(subscriptions);
  }, [subscriptions, onSubscriptionsChange]);

  useEffect(() => {
    if (isOpen) {
      if (plans.length > 0 && !selectedPlanId) setSelectedPlanId(plans[0].id);
    } else {
      setActivePanel("none");
      setDaysToReduce(1);
      setGlobalLoading(false);
    }
  }, [isOpen, plans, selectedPlanId]);

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

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    if (globalLoading) return;
    setGlobalLoading(true);
    setPendingId(id);

    const optimisticSubscriptions = localSubs.map((sub) =>
      sub.id === id ? { ...sub, isActive: !currentStatus } : sub
    );
    setLocalSubs(optimisticSubscriptions);

    startTransition(async () => {
      try {
        const result = await toggleSubscriptionStatusAction(id, currentStatus);
        if (result.success) {
          toast.success("وضعیت اشتراک با موفقیت تغییر کرد.");
          router.refresh();
        } else {
          setLocalSubs(
            optimisticSubscriptions.map((sub) =>
              sub.id === id ? { ...sub, isActive: currentStatus } : sub
            )
          );
          toast.error(result.message || "خطا در تغییر وضعیت اشتراک.");
        }
      } catch {
        setLocalSubs(
          optimisticSubscriptions.map((sub) =>
            sub.id === id ? { ...sub, isActive: currentStatus } : sub
          )
        );
        toast.error("خطا در ارتباط با سرور.");
      } finally {
        setPendingId(null);
        setGlobalLoading(false);
      }
    });
  };

  const handleDeleteSubscription = async (id: string) => {
    if (globalLoading) return;
    const confirmed = window.confirm("آیا از حذف این اشتراک مطمئن هستید؟");
    if (!confirmed) return;

    setGlobalLoading(true);
    setDeletingId(id);

    const previousSubscriptions = localSubs;
    setLocalSubs(localSubs.filter((sub) => sub.id !== id));

    try {
      const result = await deleteUserSubscriptionAction(id);
      if (result.success) {
        toast.success("اشتراک با موفقیت حذف شد.");
        router.refresh();
      } else {
        setLocalSubs(previousSubscriptions);
        toast.error(result.error || "خطا در حذف اشتراک.");
      }
    } catch {
      setLocalSubs(previousSubscriptions);
      toast.error("خطا در ارتباط با سرور.");
    } finally {
      setDeletingId(null);
      setGlobalLoading(false);
    }
  };

  const handleAddSubscription = async () => {
    if (globalLoading) return;
    if (!userId) return toast.error("شناسه کاربر یافت نشد.");
    if (!selectedPlanId) return toast.error("لطفاً یک پلن انتخاب کنید.");

    setGlobalLoading(true);
    setIsSubmitting(true);

    try {
      const res = await addUserSubscriptionManualAction(userId, selectedPlanId);
      if (res.success) {
        toast.success(res.message || "اشتراک با موفقیت برای کاربر فعال شد.");
        setActivePanel("none");
        router.refresh();
      } else {
        toast.error(res.message || "خطا در ثبت اشتراک.");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور.");
    } finally {
      setIsSubmitting(false);
      setGlobalLoading(false);
    }
  };

  const handleReduceSubscription = async () => {
    if (globalLoading) return;
    if (!userId) return toast.error("شناسه کاربر یافت نشد.");
    if (!daysToReduce || daysToReduce <= 0) return toast.error("تعداد روز نامعتبر است.");

    setGlobalLoading(true);
    setIsSubmitting(true);

    try {
      const res = await reduceUserSubscriptionManualAction(userId, daysToReduce);
      if (res.success) {
        toast.success(res.message || "کاهش زمان با موفقیت انجام شد.");
        setActivePanel("none");
        router.refresh();
      } else {
        toast.error(res.message || "خطا در کاهش زمان اشتراک.");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور.");
    } finally {
      setIsSubmitting(false);
      setGlobalLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      dir="rtl"
    >
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded bg-white shadow-xl flex flex-col">
        {globalLoading && (
          <div className="absolute inset-0 z-[60] bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-gray-700">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-13 font-medium">در حال انجام عملیات...</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-800 font-semibold text-15 sm:text-16 flex-wrap">
            <CreditCard size={20} className="text-blue-600 shrink-0" />
            <span>پلن‌های اشتراکی کاربر {userName ? `(${userName})` : ""}</span>

            <div className="flex items-center gap-2 mr-2">
              <button
                onClick={() => setActivePanel((prev) => (prev === "add" ? "none" : "add"))}
                disabled={globalLoading}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-13 font-medium transition-colors whitespace-nowrap ${
                  activePanel === "add"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                } ${globalLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <Plus size={15} />
                افزودن اشتراک
              </button>

              <button
                onClick={() => setActivePanel((prev) => (prev === "reduce" ? "none" : "reduce"))}
                disabled={globalLoading}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-13 font-medium transition-colors whitespace-nowrap ${
                  activePanel === "reduce"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                } ${globalLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <Minus size={15} />
                کاهش اشتراک
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={globalLoading}
            className={`p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors ${
              globalLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {localSubs.length > 0 ? (
            <div className="overflow-x-auto rounded">
              <table className="w-full text-right text-12 sm:text-14">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 font-medium">
                    <th className="px-4 py-3 whitespace-nowrap">عنوان پلن</th>
                    <th className="px-4 py-3 whitespace-nowrap">تاریخ شروع</th>
                    <th className="px-4 py-3 whitespace-nowrap">تاریخ انقضا</th>
                    <th className="px-4 py-3 whitespace-nowrap">تعداد روزها</th>
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
                    const isDeletingRow = deletingId === sub.id;
                    const subscriptionDays = getSubscriptionDays(sub.startDate, sub.endDate);

                    return (
                      <tr
                        key={sub.id}
                        className={`transition-colors ${
                          isDeletingRow ? "opacity-60" : "hover:bg-gray-50/50"
                        }`}
                      >
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
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-12 font-medium text-blue-700">
                            {subscriptionDays} روز
                          </span>
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
                            disabled={globalLoading || isRowPending || isDeletingRow}
                            title={sub.isActive ? "غیرفعال کردن" : "فعال کردن"}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              sub.isActive ? "bg-blue-600" : "bg-gray-400"
                            } ${
                              globalLoading || isRowPending || isDeletingRow
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
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
                          <button
                            onClick={() => handleDeleteSubscription(sub.id)}
                            disabled={globalLoading || isDeletingRow || isRowPending}
                            className={`p-1.5 text-red-600 inline-flex items-center bg-red-50 gap-1 rounded transition-colors ${
                              globalLoading || isDeletingRow || isRowPending
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer hover:bg-red-100"
                            }`}
                            title="حذف اشتراک"
                          >
                            {isDeletingRow ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-500">
              این کاربر هیچ اشتراک خریداری‌شده یا فعالی ندارد.
            </div>
          )}

          {activePanel === "add" && (
            <div className="rounded-lg bg-blue-50/40 px-5 py-4 space-y-4">
              <div className="flex items-center gap-2 text-gray-700 font-medium text-13">
                <Plus size={16} className="text-blue-600" />
                <span>افزودن اشتراک بر اساس پلن‌های تعریف‌شده</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="flex flex-col gap-2">
                  <label className="text-13 font-medium text-gray-700">انتخاب پلن اشتراک</label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    disabled={globalLoading}
                    className="w-full rounded border border-slate-400 bg-white px-3 py-2 text-14 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {plans.length > 0 ? (
                      plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.title} ({plan.durationDays} روزه) -{" "}
                          {plan.price.toLocaleString("fa-IR")} تومان
                        </option>
                      ))
                    ) : (
                      <option value="">پلنی یافت نشد</option>
                    )}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded border bg-blue-100/60 px-3 py-2 text-13 text-blue-800">
                    مدت زمان:{" "}
                    <strong className="font-bold">{selectedPlan?.durationDays || 0} روز</strong>
                  </div>
                  <button
                    onClick={handleAddSubscription}
                    disabled={globalLoading || isSubmitting || !selectedPlanId}
                    className="flex items-center justify-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-13 rounded transition-colors cursor-pointer font-medium whitespace-nowrap"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    اعطای پلن به کاربر
                  </button>
                </div>
              </div>
            </div>
          )}

          {activePanel === "reduce" && (
            <div className="rounded-lg bg-rose-50/40 px-5 py-4 space-y-4">
              <div className="flex items-center gap-2 text-gray-700 font-medium text-13">
                <Minus size={16} className="text-rose-600" />
                <span>کاهش زمان از اشتراک فعال کاربر</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="flex flex-col gap-2">
                  <label className="text-13 font-medium text-gray-700">تعداد روز قابل کسر</label>
                  <input
                    type="number"
                    min={1}
                    value={daysToReduce}
                    onChange={(e) => setDaysToReduce(Math.max(1, Number(e.target.value)))}
                    disabled={globalLoading}
                    className="w-full rounded-lg bg-white px-3 py-2 text-14 outline-none focus:ring-2 focus:ring-rose-100 disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="مثلا: 5"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReduceSubscription}
                    disabled={globalLoading || isSubmitting || !daysToReduce}
                    className="flex items-center justify-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-13 rounded-lg transition-colors cursor-pointer font-medium whitespace-nowrap"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Minus size={14} />}
                    کسر روز از اشتراک
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            disabled={globalLoading}
            className={`px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-13 rounded-lg transition-colors font-medium ${
              globalLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}
