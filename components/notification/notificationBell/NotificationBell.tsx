"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, BellRing, Check, Trash2, Lock, X } from "lucide-react";
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

  // غیرفعال کردن اسکرول صفحه هنگام باز بودن مدال 🚫 Scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

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
    <div ref={bellRef} className="inline-block text-right">
      {/* هاله مشکی پس‌زمینه (Backdrop) */}
      <div 
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* دکمه اصلی زنگوله */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-12 h-12 rounded-xl border border-gray-400 text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition relative cursor-pointer ${
          isOpen ? "bg-blue-50 border-blue-200 text-blue-600" : ""
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

      {/* مدال اصلی اعلان‌ها (عرض بزرگتر و ثابت در بالای صفحه) */}
      <div
        className={`fixed top-10 left-1/2 -translate-x-1/2 w-[95vw] sm:w-[640px] md:w-[720px] max-w-2xl z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 transform origin-top ${
          isOpen 
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
        }`}
      >
        {/* هدر منو */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-800">اعلان‌های سایت</span>
            {isLoggedIn && unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-normal flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Check size={14} /> همه خوانده شد
              </button>
            )}
          </div>

          {/* دکمه بستن (ضربدر) */}
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 p-1.5 rounded-lg transition-colors cursor-pointer"
            title="بستن"
          >
            <X size={18} />
          </button>
        </div>

        {/* بدنه منو */}
        <div className="max-h-[480px] overflow-y-auto divide-y divide-gray-100">
          
          {/* ۱. حالت لودینگ اسکلتونی ✨ */}
          {(isAuthLoading || isNotifLoading) ? (
            <div className="divide-y divide-gray-100">
              {[1, 2, 3].map((index) => (
                <div key={index} className="p-5 flex items-start gap-4 animate-pulse">
                  <div className="h-2.5 w-2.5 rounded-full bg-gray-200 mt-2 shrink-0" />
                  
                  <div className="flex-1 space-y-2.5 pr-2">
                    <div className="h-3.5 bg-gray-200 rounded w-1/4" />
                    <div className="space-y-1.5">
                      <div className="h-2.5 bg-gray-200 rounded w-full" />
                      <div className="h-2.5 bg-gray-200 rounded w-4/5" />
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded w-1/5 pt-1" />
                  </div>
                  <div className="h-5 w-5 bg-gray-200 rounded shrink-0 self-center" />
                </div>
              ))}
            </div>
          ) : 
          
          /* ۲. اگر کاربر لاگین نکرده بود 🔴 */
          !isLoggedIn ? (
            <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-gray-500">
              <Lock size={32} className="text-gray-400 mb-1" />
              <span className="text-sm font-semibold text-gray-700">ابتدا وارد حساب کاربری خود شوید</span>
              <p className="text-xs text-gray-400">برای مشاهده و مدیریت اعلان‌ها، نیاز به لاگین دارید.</p>
            </div>
          ) : 
          
          /* ۳. اگر کاربر لاگین بود اما اعلانی نداشت */
          notifications.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs">
              هیچ اعلانی وجود ندارد.
            </div>
          ) : 
          
          /* ۴. نمایش لیست اعلان‌ها برای کاربر لاگین شده 🟢 */
          (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id, notif.isRead)}
                className={`p-5 flex items-start gap-4 transition-colors hover:bg-gray-50/80 relative group cursor-pointer ${
                  !notif.isRead ? "bg-blue-50/40" : ""
                }`}
              >
                {!notif.isRead && (
                  <span className="absolute top-6 right-3 h-2.5 w-2.5 rounded-full bg-blue-600" />
                )}

                <div className="flex-1 space-y-1.5 pr-4">
                  <h4 className="text-xs sm:text-sm text-gray-900 font-medium">
                    {notif.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs leading-relaxed text-gray-500 line-clamp-2">
                    {notif.message}
                  </p>
                  <span className="block text-[10px] sm:text-[11px] text-gray-400 pt-0.5">
                    {new Date(notif.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>

                <button
                  onClick={(e) => handleDelete(e, notif.id)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 cursor-pointer shrink-0 self-center rounded-lg hover:bg-red-50"
                  title="حذف"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}