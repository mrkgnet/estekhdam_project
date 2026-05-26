"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, BellRing, Check, Trash2 } from "lucide-react";

// دیتای نمونه برای نمایش اعلان‌ها (می‌توانید بعداً این را از API بخوانید)
const INITIAL_NOTIFICATIONS = [
  { id: 1, text: "ثبت‌نام شما با موفقیت انجام شد.", isRead: false, time: "۱۰ دقیقه پیش" },
  { id: 2, text: "پاسخ سوال شما در انجمن داده شد.", isRead: false, time: "۱ ساعت پیش" },
  { id: 3, text: "تخفیف ویژه دوره‌های استخدامی آغاز شد!", isRead: true, time: "دیروز" },
];

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const bellRef = useRef<HTMLDivElement>(null);

  // محاسبه تعداد اعلان‌های خوانده نشده
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // بستن دراپ‌داون با کلیک به بیرون
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // خوانده شدن تمام اعلان‌ها
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  // حذف یک اعلان
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="relative inline-block text-right" ref={bellRef}>
      {/* دکمه اصلی زنگوله */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition relative cursor-pointer ${
          isOpen ? "bg-blue-50 border-blue-200 text-blue-600" : ""
        }`}
        aria-label="اعلان‌ها"
      >
        {unreadCount > 0 ? (
          <BellRing size={20} className="animate-pulse text-blue-600" />
        ) : (
          <Bell size={20} />
        )}

        {/* نشانگر تعداد پیام‌های خوانده نشده */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* منوی بازشوی اعلان‌ها */}
      <div
        className={`z-50 bg-white rounded    shadow-xl border border-gray-300 overflow-hidden transition-all duration-200 
          /* تنظیمات موبایل: فیکس شده و کاملاً وسط صفحه */
          fixed top-[76px] left-1/2 w-[92vw] max-w-[360px] -translate-x-1/2 origin-top
          /* تنظیمات دسکتاپ: متصل به لبه چپ دکمه زنگوله تا از کادر صفحه بیرون نزند */
          sm:absolute sm:top-[calc(100%+8px)] sm:left-0 sm:right-auto sm:w-96 sm:translate-x-0 sm:origin-top-left
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 sm:-translate-y-2 pointer-events-none"
          }
        `}
      >
        {/* هدر منو */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <span className="font-bold text-sm text-gray-800">اعلان‌ها</span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Check size={14} /> همه خوانده شد
            </button>
          )}
        </div>

        {/* لیست اعلان‌ها */}
        <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-50">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 flex items-start gap-3 transition-colors hover:bg-gray-50 relative group ${
                  !notif.isRead ? "bg-blue-50/30" : ""
                }`}
              >
                {/* وضعیت خوانده نشده (نقطه آبی) */}
                {!notif.isRead && (
                  <span className="absolute top-5 right-2 h-2 w-2 rounded-full bg-blue-600" />
                )}

                <div className="flex-1 space-y-1 pr-2">
                  <p className={`text-xs leading-relaxed text-gray-700 ${!notif.isRead ? "font-semibold" : ""}`}>
                    {notif.text}
                  </p>
                  <span className="block text-[10px] text-gray-400">{notif.time}</span>
                </div>

                {/* دکمه حذف اعلان */}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                  title="حذف"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs">
              هیچ اعلانی وجود ندارد.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}