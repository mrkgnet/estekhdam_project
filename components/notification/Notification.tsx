"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getUnreadNotificationsCount } from "@/actions/notification/global-notification/admin/Actions";

// پراپ className را اضافه کردیم تا بتوانیم استایل دسکتاپ و موبایل را جداگانه به آن بدهیم
interface NotificationProps {
  className?: string;
  iconClassName?: string;
}

export default function Notification({ className = "", iconClassName = "" }: NotificationProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadNotificationsCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch notifications count");
      }
    };

    fetchUnreadCount(); // فراخوانی اولیه

    // Polling هر 30 ثانیه
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/adminp/notifications" className={`relative ${className}`}>
      <Bell className={`h-5 w-5 ${iconClassName}`} />

      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
          {unreadCount > 99 ? "+99" : unreadCount}
        </span>
      )}
    </Link>
  );
}
