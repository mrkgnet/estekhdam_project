"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, BellRing, Check, Trash2, Lock, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getDataGlobalNotificationUserAction,
  markAsReadAction,
  deleteNotificationAction,
} from "@/actions/notification/global-notification/user/fetch/Actions";

interface GlobalNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { user, isLoggedIn, isLoading: isAuthLoading } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<GlobalNotification[]>([]);
  const [isNotifLoading, setIsNotifLoading] = useState(false);

  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      setIsNotifLoading(true);
      const response = await getDataGlobalNotificationUserAction(user.id);
      if (response.success && response.data) setNotifications(response.data);
      setIsNotifLoading(false);
    };

    fetchNotifications();
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = isLoggedIn
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;

    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;

    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    await markAsReadAction(user.id, unreadIds);
  };

  const handleNotificationClick = async (id: string, isRead: boolean) => {
    if (!user?.id || isRead) return;

    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markAsReadAction(user.id, [id]);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user?.id) return;

    setNotifications(notifications.filter((n) => n.id !== id));
    await deleteNotificationAction(user.id, id);
  };

  return (
    <div ref={bellRef} className="relative inline-flex shrink-0 items-center">
      {/* Backdrop overlay */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-400 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 ${
          isOpen ? "border-blue-200 bg-blue-50 text-blue-600" : ""
        }`}
      >
        {unreadCount > 0 ? (
          <BellRing size={20} className="animate-pulse text-blue-600" />
        ) : (
          <Bell size={20} />
        )}

        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Container */}
      <div
        className={`fixed left-1/2 top-12 z-50 w-[92vw] max-w-2xl -translate-x-1/2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 transform origin-top sm:w-[500px] md:w-[600px] ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-4 scale-95 opacity-0"
        }`}
      >
        {/* هدر */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-800">
              اعلان‌های سایت
            </span>

            {isLoggedIn && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex cursor-pointer items-center gap-1 text-xs font-normal text-blue-600 transition-colors hover:text-blue-700"
              >
                <Check size={14} /> همه خوانده شد
              </button>
            )}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-200/60 hover:text-gray-600"
            title="بستن"
          >
            <X size={18} />
          </button>
        </div>

        {/* بدنه */}
        <div className="max-h-[75vh] divide-y divide-gray-100 overflow-y-auto sm:max-h-[480px]">
          {isAuthLoading || isNotifLoading ? (
            <div className="divide-y divide-gray-100">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 animate-pulse sm:p-5"
                >
                  <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-gray-200" />
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <div className="h-3 w-1/4 rounded bg-gray-200" />
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-full rounded bg-gray-200" />
                      <div className="h-2.5 w-4/5 rounded bg-gray-200" />
                    </div>
                    <div className="h-2.5 w-1/5 rounded bg-gray-200 pt-1" />
                  </div>
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-gray-200" />
                </div>
              ))}
            </div>
          ) : !isLoggedIn ? (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-gray-500 sm:p-12">
              <Lock size={32} className="mb-1 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">
                ابتدا وارد حساب کاربری خود شوید
              </span>
              <p className="text-xs text-gray-400">
                برای مشاهده و مدیریت اعلان‌ها، نیاز به لاگین دارید.
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400 sm:p-12">
              هیچ اعلانی وجود ندارد.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id, notif.isRead)}
                className={`relative flex cursor-pointer items-start justify-between gap-3 p-4 transition-colors hover:bg-gray-50/80 sm:gap-4 sm:p-5 ${
                  !notif.isRead ? "bg-blue-50/40" : ""
                }`}
              >
                <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
                  <div className="w-2.5 shrink-0 pt-2">
                    {!notif.isRead && (
                      <span className="block h-2 w-2 rounded-full bg-blue-600 sm:h-2.5 sm:w-2.5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <h4 className="break-words whitespace-normal text-xs font-semibold leading-snug text-gray-900 sm:text-sm">
                      {notif.title}
                    </h4>
                    <p className="break-words whitespace-pre-wrap text-xs leading-relaxed text-justify text-gray-500">
                      {notif.message}
                    </p>
                    <span className="block pt-0.5 text-[11px] text-gray-400 sm:text-xs">
                      {new Date(notif.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 self-start">
                  <button
                    onClick={(e) => handleDelete(e, notif.id)}
                    className="flex cursor-pointer items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
