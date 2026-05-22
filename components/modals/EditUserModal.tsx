"use client";

import React, { useActionState, useEffect } from 'react';
import { X } from 'lucide-react';
import { editUserAction } from '@/actions/admin/uesrs/edituser/Actions';
import toast from 'react-hot-toast';

export default function EditUserModal({ user, onClose }: { user: any | null; onClose: () => void }) {
  const [stateEdit, formEditAction, isPendingEdit] = useActionState(editUserAction, null);

  useEffect(() => {
    if (stateEdit?.success) {
      onClose();
      toast.success(stateEdit.message);
    }
  }, [stateEdit, onClose]);

  if (!user) return null;

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
          <h2>ویرایش کاربر</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form action={formEditAction} className="flex flex-col gap-4">
          <input type="hidden" name='id' value={user.id} />

          <label htmlFor="phoneNumber">شماره موبایل</label>
          <input
            id="phoneNumber"
            type="text"
            name="phoneNumber"
            defaultValue={user.phoneNumber}
            className="border p-2 rounded focus:outline-blue-500 text-left" dir="ltr"
            required
          />

          <label htmlFor="email">ایمیل</label>
          <input
            id="email"
            type="email"
            name="email"
            defaultValue={user.email || ''}
            className="border p-2 rounded focus:outline-blue-500 text-left" dir="ltr"
          />

          <label htmlFor="role">نقش</label>
          <select
            id="role"
            name="role"
            defaultValue={user.role}
            className="border p-2 rounded focus:outline-blue-500 cursor-pointer"
          >
            <option value="user">کاربر عادی</option>
            <option value="admin">مدیر سیستم</option>
          </select>

          {stateEdit?.success === false && (
            <p className="text-red-500">{stateEdit.message || stateEdit.error}</p>
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
              disabled={isPendingEdit}
              className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isPendingEdit ? "در حال ذخیره..." : "ذخیره اطلاعات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
