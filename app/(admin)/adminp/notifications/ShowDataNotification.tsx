"use client";

import { useState, useMemo } from "react";
// آیکون Trash2 را برای دکمه حذف اضافه کردیم
import { CheckCheck, MessageSquare, Ticket, Phone, Clock, Bell, Inbox, ChevronLeft, Trash2 } from "lucide-react";
// فرض می‌کنیم اکشن جدید را در همان فایل اکشن‌هایتان ذخیره کرده‌اید
import { markAsRead } from "@/actions/notification/getAllNotif/Actions";
import { useRouter } from "next/navigation";
import { deleteAllReadNotifications } from "@/actions/notification/DeleteAllNotif/Actions";

function timeAgoFa(dateInput: string | Date) {
  // ... (کد زمان شما بدون تغییر)
  const date = new Date(dateInput);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const toFaDigit = (num: number) => num.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
  if (seconds < 60) return "چند لحظه پیش";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${toFaDigit(minutes)} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${toFaDigit(hours)} ساعت پیش`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${toFaDigit(days)} روز پیش`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${toFaDigit(months)} ماه پیش`;
  const years = Math.floor(months / 12);
  return `${toFaDigit(years)} سال پیش`;
}

export default function NotificationsPage({ response }: { response: any[] }) {
  
  const [notifications, setNotifications] = useState<any[]>(response);
  const router = useRouter();
console.log(notifications)
  // بررسی پیام‌های نخوانده (برای دکمه خواندن همه)
  const hasUnread = useMemo(() => notifications.some(n => !n.isRead), [notifications]);
  
  // بررسی پیام‌های خوانده شده (برای دکمه حذف همه)
  const hasRead = useMemo(() => notifications.some(n => n.isRead), [notifications]);

  const handleMarkAllRead = async () => {
    if (!hasUnread) return;
    setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
    await markAsRead();
  };

  // تابع جدید برای حذف پیام‌های خوانده شده
  const handleDeleteAllRead = async () => {
    if (!hasRead) return;
    
    // آپدیت ظاهر قبل از سرور (Optimistic UI): فقط پیام‌های نخوانده را نگه می‌داریم
    setNotifications((prev) => prev.filter(n => !n.isRead));
    
    // فراخوانی اکشن سرور برای حذف از دیتابیس
    await deleteAllReadNotifications();
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
      await markAsRead(notification.id);
    }

    if (notification.type === "NEW_COMMENT") router.push(`/adminp/comments`);
    if (notification.type === "NEW_TICKET") router.push(`/adminp/support/tickets/${notification.referenceId}`);
    if (notification.type === "NEW_CONTACT") router.push(`/adminp/contact`);
  };

  const getIconData = (type: string) => {
    switch (type) {
      case "TICKET": return { icon: <Ticket size={20} className="text-blue-600" />, bg: "bg-blue-100" };
      case "COMMENT": return { icon: <MessageSquare size={20} className="text-emerald-600" />, bg: "bg-emerald-100" };
      case "CONTACT": return { icon: <Phone size={20} className="text-purple-600" />, bg: "bg-purple-100" };
      default: return { icon: <Bell size={20} className="text-gray-600" />, bg: "bg-gray-100" };
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50/50 p-4 md:p-8 text-xs md:text-sm">
      <div className="max-w-4xl mx-auto">

        {/* هدر صفحه */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-base text-gray-900 tracking-tight">
              اعلان‌های سیستم
            </h1>
            <p className="text-gray-500 mt-1 text-red-500">
              شما {notifications.filter(n => !n.isRead).length.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)])} پیام نخوانده دارید.
            </p>
          </div>

          <div className="flex gap-2">
            {/* دکمه خواندن همه */}
            <button
              onClick={handleMarkAllRead}
              disabled={!hasUnread}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded transition-all duration-300 ${hasUnread
                ? "bg-white border border-gray-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm active:scale-95 cursor-pointer"
                : "bg-transparent text-gray-400 cursor-not-allowed"
                }`}
            >
              <CheckCheck size={18} />
              علامت‌گذاری همه به عنوان خوانده شده
            </button>

            {/* دکمه حذف همه خوانده شده‌ها */}
            <button
              onClick={handleDeleteAllRead}
              disabled={!hasRead} // اگر پیام خوانده‌شده‌ای نیست، دکمه غیرفعال شود
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded transition-all duration-300 ${hasRead
                ? "bg-white border border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:shadow-sm active:scale-95 cursor-pointer"
                : "bg-transparent text-gray-400 cursor-not-allowed"
                }`}
            >
              <Trash2 size={18} />
              حذف خوانده شده‌ها
            </button>
          </div>
        </div>

        {/* لیست اعلان‌ها */}
        <div className="bg-white rounded shadow-sm border border-slate-200/60 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="bg-slate-50 p-6 rounded-full mb-4 ring-8 ring-slate-50/50">
                <Inbox size={48} className="text-slate-300" strokeWidth={1.5} />
              </div>
              <h3 className="text-gray-800 mb-1">صندوق اعلان‌ها خالی است</h3>
              <p className="text-gray-500 max-w-sm">
                در حال حاضر هیچ رویداد جدیدی در سیستم رخ نداده است. به محض دریافت پیام جدید در اینجا نمایش داده می‌شود.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => {
                const iconData = getIconData(notif.type);

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`group relative p-4 md:p-5 flex items-start gap-4 md:gap-5 cursor-pointer transition-all duration-300 hover:bg-slate-50 ${!notif.isRead ? "bg-blue-50/30" : "bg-white"
                      }`}
                  >
                    {/* ... (ادامه کدهای رندر هر نوتیفیکیشن بدون تغییر) */}
                    {!notif.isRead && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-full"></div>
                    )}
                    <div className={`p-3 rounded shrink-0 transition-transform duration-300 group-hover:scale-110 ${iconData.bg}`}>
                      {iconData.icon}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className={`leading-relaxed ${notif.isRead ? "text-slate-600" : "text-slate-900 font-medium"}`}>
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-400">
                        <Clock size={14} className="opacity-70" />
                        <span>{timeAgoFa(notif.createdAt)}</span>
                      </div>
                    </div>
                    <div className="hidden sm:flex shrink-0 items-center justify-center self-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <ChevronLeft size={16} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
