"use client";

import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  user: any;
  isLoggedIn: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // اضافه کردن usePathname

  // 🟢 راه‌اندازی Axios Interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (originalRequest.url === "/api/auth/refresh") {
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          try {
            await axios.post("/api/auth/refresh");
            return axios(originalRequest);
          } catch (refreshError: any) {
            if (refreshError.response?.status === 401) {
              setUser(null);
              setIsLoggedIn(false);
              // تغییر به log یا حذف کامل این خط
              console.log("Refresh token expired or not found, user is guest.");
            }
            return Promise.reject(refreshError);
          }

        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/auth/me");
      if (res.data && res.data.user) {
        setUser(res.data.user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // بررسی احراز هویت در هنگام لود اولیه
  useEffect(() => {
    checkAuth();
  }, []);

  // 🟢 راه‌حل مشکل رفرش توکن: ارسال درخواست رفرش در پس‌زمینه هر ۱۴ دقیقه
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(async () => {
      try {
        await axios.post("/api/auth/refresh");
        console.log("Token refreshed automatically in background");
      } catch (error: any) {
        // 🟢 اصلاح مهم: در صورت قطعی اینترنت لاگ‌اوت نکن
        if (error.response?.status === 401) {
          console.error("Refresh token expired, logging out");
          logOut();
        }
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);


  // 🟢 (اختیاری اما مفید) اگر کاربر تب مرورگر را رها کرد و بعد از مدت طولانی برگشت یا لینک را عوض کرد
  useEffect(() => {
    const handleFocus = () => {
      if (isLoggedIn) checkAuth();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isLoggedIn]);

  const logOut = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      setIsLoggedIn(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoading, logOut, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
