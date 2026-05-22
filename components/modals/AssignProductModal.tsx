"use client";

import React, { useState, useTransition } from 'react';
import { X } from 'lucide-react';
import addProductToUser from '@/actions/admin/order/addProductFromPanel/Actions';
import toast from 'react-hot-toast';

export default function AssignProductModal({ user, productsList, onClose }: { user: any | null; productsList: any[]; onClose: () => void }) {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isPendingAssign, startTransition] = useTransition();

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAssignProducts = () => {
    if (!user?.id || selectedProductIds.length === 0) return;

    startTransition(async () => {
      const result = await addProductToUser(user.id, selectedProductIds);

      if (result?.success) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result?.message || "خطایی رخ داد");
      }
    });
  };

  if (!user) return null;

  return (
    <div dir="rtl" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-sm bg-black/5"
      />

      <div className="relative w-full max-w-md bg-white rounded shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div>
            <h3 className="text-gray-800">تخصیص محصول</h3>
            <p className="text-gray-500 mt-1">کاربر: {user.phoneNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {productsList.length > 0 ? (
            <div className="space-y-3">
              {productsList.map((product) => (
                <label
                  key={product.id}
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    checked={selectedProductIds.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                  />
                  <span className="text-gray-700 font-medium">
                    {product.name}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              هیچ محصولی در سیستم یافت نشد.
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 cursor-pointer hover:bg-gray-100 text-gray-700 py-3 rounded font-medium transition-colors"
            >
              انصراف
            </button>

            <button
              type="button"
              onClick={handleAssignProducts}
              disabled={selectedProductIds.length === 0 || isPendingAssign}
              className="flex-1 bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer hover:bg-green-700 text-white py-3 rounded font-medium transition-colors"
            >
              {isPendingAssign ? "در حال ثبت..." : `ثبت محصولات (${selectedProductIds.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
