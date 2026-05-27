"use client";

import { addGlobalNotificationAction, deleteGlobalNotificationAction, toggleNotificationStatusAction } from '@/actions/notification/global-notification/admin/add/Actions';
import React, { useState } from 'react';

interface GlobalNotification {
  id: string;
  title: string;
  message: string;
  isActive: boolean;
  createdAt: string | Date;
}

interface ShowDataGloabalNotificationProps {
  initialNotifications?: GlobalNotification[]; // دریافت داده‌های اولیه از سمت سرور
}

export default function ShowDataGloabalNotification({ initialNotifications = [] }: ShowDataGloabalNotificationProps) {
  // ✅ مشکل اصلی اینجا بود: استیت اعلان‌ها تعریف نشده بود که اضافه شد
  const [notifications, setNotifications] = useState<GlobalNotification[]>(initialNotifications);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // هندل کردن تغییر وضعیت با سرور اکشن
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const res = await toggleNotificationStatusAction(id, currentStatus);
    if (res.success && res.data) {
      setNotifications(
        notifications.map((notif) => (notif.id === id ? (res.data as GlobalNotification) : notif))
      );
    } else {
      alert(res.error || "عملیات با خطا مواجه شد.");
    }
  };

  // هندل کردن حذف با سرور اکشن
  const handleDelete = async (id: string) => {
    if (confirm("آیا از حذف این پیغام همگانی مطمئن هستید؟")) {
      const res = await deleteGlobalNotificationAction(id);
      if (res.success) {
        setNotifications(notifications.filter((notif) => notif.id !== id));
      } else {
        alert(res.error || "خطا در حذف آیتم.");
      }
    }
  };

  return (
    <div className="p-4  max-w-7xl mx-auto font-sans" dir="rtl">
      
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">مدیریت اعلان‌های همگانی</h1>
          <p className="text-sm text-gray-500 mt-1">این پیغام‌ها در زنگوله بالای سایت برای تمامی کاربران نمایش داده می‌شوند.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          افزودن پیغام جدید
        </button>
      </div>

      {/* جدول نمایش پیغام‌ها */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-600 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold">عنوان</th>
                <th className="p-4 font-semibold max-w-md">متن پیغام</th>
                <th className="p-4 font-semibold text-center">تاریخ ایجاد</th>
                <th className="p-4 font-semibold text-center">وضعیت</th>
                <th className="p-4 font-semibold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {notifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    هیچ اعلان همگانی ثبت نشده است.
                  </td>
                </tr>
              ) : (
                notifications.map((notif) => (
                  <tr key={notif.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{notif.title}</td>
                    <td className="p-4 text-gray-500 line-clamp-2 max-w-md">{notif.message}</td>
                    <td className="p-4 text-center whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(notif.id, notif.isActive)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          notif.isActive
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${notif.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {notif.isActive ? 'در حال نمایش' : 'مخفی شده'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= مدال (Modal) افزودن پیغام ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => !isLoading && setIsModalOpen(false)}
          ></div>

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-lg">ثبت پیغام همگانی جدید</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-xl transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* پیاده‌سازی مستقیم فرم اکشن با سرور اکشن */}
            <form 
              action={async (formData) => {
                setIsLoading(true);
                const res = await addGlobalNotificationAction(formData);
                setIsLoading(false);
                
                if (res.success && res.data) {
                  // اضافه کردن فوري داده جدید به لیست بدون نیاز به رفرش کامل صفحه
                  setNotifications([res.data as GlobalNotification, ...notifications]);
                  setNewTitle("");
                  setNewMessage("");
                  setIsModalOpen(false);
                } else {
                  alert(res.error || "خطایی رخ داده است.");
                }
              }} 
              className="p-6 space-y-5"
            >
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">عنوان پیغام</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: آپدیت جدید سایت"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">متن کامل پیغام</label>
                <textarea
                  name="message"
                  
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="کاربران گرامی، تغییرات جدید در پنل کاربری اعمال شد..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'ثبت و انتشار'
                  )}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}

    </div>
  );
}