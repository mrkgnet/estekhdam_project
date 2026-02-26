"use client";

import React, { useEffect, useState } from "react";
import {
  Trash2,
  PlusCircle,
  X,
  Loader2,
  Phone,
} from "lucide-react";

import { ChargeUserWallet, UpdateUser, CreateUser } from "@/actions/userAction";

type Role = "user" | "admin";

export default function UserData({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState<any[]>(initialUsers);

  // --- Wallet charge modal
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<string>("");
  const [chargeAmount, setChargeAmount] = useState<number>(0);
  const [isCharging, setIsCharging] = useState(false);

  // --- Add user modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState<Role>("user");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Close modals with ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsChargeModalOpen(false);
      setIsAddModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // --- Helpers
  const formatPrice = (price: any) => {
    if (price === null || price === undefined) return "";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const normalizePhone = (phone: string) => {
    const p = phone.trim().replace(/\s/g, "");
    if (p.startsWith("+98")) return "0" + p.slice(3);
    return p;
  };

  const isValidIranMobile = (phone: string) => {
    const p = normalizePhone(phone);
    return /^0?9\d{9}$/.test(p);
  };

  // --- Toggle user active/inactive
  const toggleUserStatus = async (userID: any) => {
    const currentUser = users.find((u) => u.id === userID);
    if (!currentUser) return;

    const newStatus = !currentUser.isActive;

    setUsers((prev) => prev.map((u) => (u.id === userID ? { ...u, isActive: newStatus } : u)));

    const result = await UpdateUser(userID, newStatus);
    if (!result?.success) {
      alert("خطا در تغییر وضعیت");
      setUsers((prev) => prev.map((u) => (u.id === userID ? { ...u, isActive: !newStatus } : u)));
    }
  };

  // --- Open charge modal
  const openChargeModal = (user: any) => {
    setSelectedPhone(user.phoneNumber);
    setChargeAmount(0);
    setIsChargeModalOpen(true);
  };

  const handleChargeUserWallet = async () => {
    if (chargeAmount <= 0) return alert("مقدار شارژ را وارد کنید");
    if (!selectedPhone) return alert("شماره تلفن انتخاب نشده است");

    setIsCharging(true);
    try {
      const result = await ChargeUserWallet(selectedPhone, chargeAmount);
      if (result?.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.phoneNumber === selectedPhone ? { ...u, userWallet: (u.userWallet ?? 0) + chargeAmount } : u
          )
        );
        setIsChargeModalOpen(false);
        setChargeAmount(0);
      } else {
        alert(result?.message || "خطایی رخ داد");
      }
    } catch {
      alert("خطایی رخ داد");
    } finally {
      setIsCharging(false);
    }
  };

  // --- Create user
  const handleCreateUser = async () => {
    const phone = normalizePhone(newPhone);
    if (!phone) return alert("شماره موبایل را وارد کنید");
    if (!isValidIranMobile(phone)) return alert("شماره موبایل معتبر نیست");

    setIsCreating(true);
    try {
      const res = await CreateUser(phone, newRole);
      if (!res?.success) {
        return alert(res?.message || "خطا در ایجاد کاربر");
      }

      // اضافه کردن کاربر جدید به ابتدای لیست
      setUsers((prev) => [res.user, ...prev]);

      setIsAddModalOpen(false);
      setNewPhone("");
      setNewRole("user");
    } catch {
      alert("خطایی رخ داد");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="relative" dir="rtl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">کاربران</h2>

        <div className="flex items-center gap-2">
          {/* اگر خواستی شارژ کیف پول فعال باشه، این دکمه رو نگه دار/استفاده کن */}
          {/* <button
            onClick={() => openChargeModal({ phoneNumber: "" })}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4" />
            شارژ کیف پول
          </button> */}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-950"
          >
            <PlusCircle className="h-4 w-4" />
            افزودن کاربر
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white max-h-screen overflow-scroll rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">ردیف</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">شماره تلفن</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">ایمیل</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">نقش</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">زمان آخرین بروزرسانی</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">تاریخ ورود</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">وضعیت</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">عملیات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-500">
                  {(index + 1).toLocaleString("fa-IR")}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  {user.phoneNumber}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  {user.email || "-"}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  {user.role}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  {new Date(user.updatedAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                </td>

                {/* Status toggle */}
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        user.isActive ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                      aria-label="تغییر وضعیت کاربر"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          user.isActive ? "-translate-x-6" : "-translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center gap-2">
                    {/* اگر شارژ کیف پول می‌خوای */}
                    {/* <button
                      onClick={() => openChargeModal(user)}
                      className="rounded-lg px-3 py-2 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      شارژ
                    </button> */}

                    <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* -------------------- Add User Modal -------------------- */}
      {isAddModalOpen && (
        <div
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-100"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">افزودن کاربر</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Phone */}
              <div>
                <label className="mb-1 block text-xs text-gray-500">شماره موبایل</label>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-zinc-900/20">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="مثلاً 09123456789"
                    inputMode="tel"
                    className="w-full text-sm outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-500">فرمت پیشنهادی: 09xxxxxxxxx</p>
              </div>

              {/* Role */}
              <div>
                <label className="mb-1 block text-xs text-gray-500">نقش</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Role)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                >
                  <option value="user">کاربر</option>
                  <option value="admin">ادمین</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-700 hover:bg-gray-200"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  انصراف
                </button>

                <button
                  className="flex-1 flex items-center justify-center rounded-xl bg-zinc-900 py-3 font-bold text-white hover:bg-zinc-950 disabled:opacity-60"
                  onClick={handleCreateUser}
                  disabled={isCreating}
                >
                  {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : "ثبت کاربر"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- Charge Wallet Modal (Optional) -------------------- */}
      {isChargeModalOpen && (
        <div
          onClick={() => setIsChargeModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">افزایش موجودی</h3>
              <button onClick={() => setIsChargeModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                شارژ کیف پول برای کاربر: <span className="font-bold text-gray-900">{selectedPhone}</span>
              </p>

              <div>
                <label className="block text-xs text-gray-500 mb-1">مبلغ شارژ (تومان)</label>
                <input
                  type="text"
                  value={chargeAmount ? formatPrice(chargeAmount) : ""}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, "");
                    if (!isNaN(Number(rawValue))) setChargeAmount(Number(rawValue));
                  }}
                  placeholder="مثلا ۵۰,۰۰۰"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  onClick={() => setIsChargeModalOpen(false)}
                >
                  انصراف
                </button>

                <button
                  className="flex-1 flex items-center justify-center bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                  onClick={handleChargeUserWallet}
                  disabled={isCharging}
                >
                  {isCharging ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>شارژ کیف پول</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
