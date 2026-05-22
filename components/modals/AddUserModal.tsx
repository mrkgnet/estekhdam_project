"use client";

import React, { useActionState, useEffect } from 'react';
import { X } from 'lucide-react';
import { addUserAction } from '@/actions/admin/uesrs/addusers/Actions';
import toast from 'react-hot-toast';

export default function AddUserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [state, formAction, isPending] = useActionState(addUserAction, null);

  useEffect(() => {
    if (state?.success) {
      onClose();
      toast.success(state.message);
    }
  }, [state, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/5 flex justify-center items-center z-50"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2>افزودن کاربر جدید</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <label>شماره موبایل</label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="09123456789"
            className="border p-2 rounded focus:outline-blue-500 text-left" dir="ltr"
            required
          />
          <label>ایمیل</label>
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            className="border p-2 rounded focus:outline-blue-500 text-left" dir="ltr"
          />
          <label>نقش</label>
          <select
            name="role"
            className="border p-2 rounded focus:outline-blue-500 cursor-pointer"
          >
            <option value="user">کاربر عادی</option>
            <option value="admin">مدیر سیستم</option>
          </select>

          {state?.success === false && (
            <p className="text-red-500">{state.message || state.error}</p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 cursor-pointer py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isPending ? "در حال ذخیره..." : "ذخیره اطلاعات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
