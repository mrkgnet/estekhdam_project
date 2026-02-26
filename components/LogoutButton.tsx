"use client"

import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LogoutButton() {

    const { logOut, isLoading } = useAuth();
  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("شما از حساب خود خارج شدید");
    } catch {
      toast.error("خطا در خروج از حساب");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="bg-red-500 text-white hover:bg-red-600 focus:ring-4 focus:ring-red-200 shadow cursor-pointer font-medium rounded-full text-sm px-4 py-2.5 disabled:opacity-50"
    >
      خروج از حساب کاربری
    </button>
  );
}
