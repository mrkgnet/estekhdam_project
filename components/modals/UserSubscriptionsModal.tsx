// components/modals/UserSubscriptionsModal.tsx
"use client";

import React from "react";
import { X, CreditCard, CheckCircle2, XCircle } from "lucide-react";

export type SubscriptionItem = {
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
  order: {
    pricePaid: number;
    refId: string | null;
    status: string;
  } | null;
};

type Props = {
  subscriptions: SubscriptionItem[];
  userName?: string | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function UserSubscriptionsModal({ subscriptions, userName, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" dir="rtl">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-800 font-semibold text-15 sm:text-16">
            <CreditCard size={20} className="text-blue-600" />
            <span>پلن‌های اشتراکی کاربر {userName ? `(${userName})` : ""}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {subscriptions && subscriptions.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="w-full text-right text-12 sm:text-14">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                    <th className="px-4 py-3">عنوان پلن</th>
                    <th className="px-4 py-3">تاریخ شروع</th>
                    <th className="px-4 py-3">تاریخ انقضا</th>
                    <th className="px-4 py-3">مبلغ پرداختی</th>
                    <th className="px-4 py-3">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {subscriptions.map((sub) => {
                    const isExpired = new Date(sub.endDate) < new Date();
                    const isCurrentlyActive = sub.isActive && !isExpired;

                    return (
                      <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-gray-800">
                          {sub.plan?.title || "پلن نامشخص"}
                          <span className="block text-11 text-gray-400 mt-0.5">
                            {sub.plan?.durationDays} روزه
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-600">
                          {new Date(sub.startDate).toLocaleDateString("fa-IR")}
                        </td>
                        <td className="px-4 py-3.5 text-gray-600">
                          {new Date(sub.endDate).toLocaleDateString("fa-IR")}
                        </td>
                        <td className="px-4 py-3.5 font-medium">
                          {sub.order?.pricePaid
                            ? `${sub.order.pricePaid.toLocaleString("fa-IR")} تومان`
                            : "رایگان / ثبت دستی"}
                        </td>
                        <td className="px-4 py-3.5">
                          {isCurrentlyActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-12 bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={14} />
                              فعال
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-12 bg-rose-50 text-rose-700 border border-rose-200">
                              <XCircle size={14} />
                              منقضی / غیرفعال
                            </span>
                          )}
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
        </div>

        {/* Footer */}
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