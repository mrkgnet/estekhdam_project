// NotificationBell.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, BellRing, Check, Trash2, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; 
import { 
  getDataGlobalNotificationUserAction, 
  markAsReadAction, 
  deleteNotificationAction 
} from '@/actions/notification/global-notification/user/fetch/Actions';

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
    if (!isLoggedIn || !user?.id) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      setIsNotifLoading(true);
      const response = await getDataGlobalNotificationUserAction(user.id);
      if (response.success && response.data) {
        setNotifications(response.data);
      }
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

  const unreadCount = isLoggedIn ? notifications.filter((n) => !n.isRead).length : 0;

  const handleMarkAllAsRead = async () => {
    if (!user?.id) return;
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) return;
    
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    await markAsReadAction(user.id, unreadIds);
  };

  const handleNotificationClick = async (id: string, isRead: boolean) => {
    if (!user?.id || isRead) return;
    
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    await markAsReadAction(user.id, [id]);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user?.id) return;

    setNotifications(notifications.filter(n => n.id !== id));
    await deleteNotificationAction(user.id, id);
  };

  return (
    <div className="relative inline-block text-right" ref={bellRef}>
      {/* دکمه اصلی زنگوله */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-10 h-10 rounded-xl border border-gray-400 text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition relative cursor-pointer ${
          isOpen ? "bg-blue-50 border-blue-200 text-blue-600" : ""
        }`}
      >
        {unreadCount > 0 ? (
          <BellRing size={20} className="animate-pulse text-blue-600" />
        ) : (
          <Bell size={20} />
        )}

        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* منوی بازشوی اعلان‌ها */}
      <div
        className={`z-50 bg-white rounded shadow-xl border border-gray-300 overflow-hidden transition-all duration-200 
          fixed top-[76px] left-1/2 w-[92vw] max-w-[360px] -translate-x-1/2 origin-top
          sm:absolute sm:top-[calc(100%+8px)] sm:left-0 sm:right-auto sm:w-96 sm:translate-x-0 sm:origin-top-left
          ${isOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 sm:-translate-y-2 pointer-events-none"}
        `}
      >
        {/* هدر منو */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <span className="font-bold text-sm text-gray-800">اعلان‌های سایت</span>
          {isLoggedIn && unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Check size={14} /> همه خوانده شد
            </button>
          )}
        </div>

        {/* بدنه منو */}
        <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-50">
          
          {/* ۱. حالت لودینگ اسکلتونی (افزایش زیبایی بصری) ✨ */}
          {(isAuthLoading || isNotifLoading) ? (
            <div className="divide-y divide-gray-100">
              {[1, 2, 3].map((index) => (
                <div key={index} className="p-4 flex items-start gap-3 animate-pulse">
                  {/* جایگاه نقطه آبی (وضعیت ناخوانده) */}
                  <div className="h-2 w-2 rounded-full bg-gray-200 mt-2 shrink-0" />
                  
                  <div className="flex-1 space-y-2 pr-2">
                    {/* جایگاه عنوان اعلان */}
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    {/* جایگاه متن پیام */}
                    <div className="space-y-1.5">
                      <div className="h-2 bg-gray-200 rounded w-full" />
                      <div className="h-2 bg-gray-200 rounded w-5/6" />
                    </div>
                    {/* جایگاه تاریخ */}
                    <div className="h-2 bg-gray-200 rounded w-1/4 pt-1" />
                  </div>
                  {/* جایگاه دکمه سطل زباله */}
                  <div className="h-4 w-4 bg-gray-200 rounded shrink-0 self-center" />
                </div>
              ))}
            </div>
          ) : 
          
          /* ۲. اگر کاربر لاگین نکرده بود 🔴 */
          !isLoggedIn ? (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-gray-500">
              <Lock size={24} className="text-gray-400 mb-1" />
              <span className="text-xs font-bold text-gray-700">ابتدا وارد حساب کاربری خود شوید</span>
              <p className="text-[10px] text-gray-400">برای مشاهده و مدیریت اعلان‌ها، نیاز به لاگین دارید.</p>
            </div>
          ) : 
          
          /* ۳. اگر کاربر لاگین بود اما اعلانی نداشت */
          notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              هیچ اعلانی وجود ندارد.
            </div>
          ) : 
          
          /* ۴. نمایش لیست اعلان‌ها برای کاربر لاگین شده 🟢 */
          (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id, notif.isRead)}
                className={`p-4 flex items-start gap-3 transition-colors hover:bg-gray-50 relative group cursor-pointer ${
                  !notif.isRead ? "bg-blue-50/30" : ""
                }`}
              >
                {!notif.isRead && (
                  <span className="absolute top-5 right-2 h-2 w-2 rounded-full bg-blue-600" />
                )}

                <div className="flex-1 space-y-1 pr-2">
                  <h4 className={`text-xs text-gray-900 ${!notif.isRead ? "font-bold" : "font-medium"}`}>
                    {notif.title}
                  </h4>
                  <p className="text-[11px] leading-relaxed text-gray-500 line-clamp-2">
                    {notif.message}
                  </p>
                  <span className="block text-[10px] text-gray-400">
                    {new Date(notif.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>

                <button
                  onClick={(e) => handleDelete(e, notif.id)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer shrink-0 self-center"
                  title="حذف"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}