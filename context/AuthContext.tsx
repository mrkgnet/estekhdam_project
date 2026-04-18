"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
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

  // 🟢 راه‌اندازی Axios Interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response, // اگر درخواست موفق بود کاری نداشته باش
      async (error) => {
        const originalRequest = error.config;
        
        // اگر خطای 401 گرفتیم و این درخواست قبلاً تلاش مجدد (retry) نشده بود
        if (error.response?.status === 401 && !originalRequest._retry) {
          // جلوگیری از لوپ بی‌نهایت اگر خود رفرش توکن هم خطا داد
          if (originalRequest.url === "/api/auth/refresh") {
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          try {
            // ۱. درخواست به رفرش توکن
            await axios.post("/api/auth/refresh");
            
            // ۲. اگر موفق بود، درخواست اصلی رو دوباره تکرار کن (اینبار با کوکی جدید)
            return axios(originalRequest);
          } catch (refreshError) {
            // ۳. اگر رفرش توکن هم منقضی شده بود، کاربر رو خارج کن
            setUser(null);
            setIsLoggedIn(false);
            console.error("Refresh token expired, user logged out");
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // پاکسازی هنگام Unmount شدن
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // تابع بررسی احراز هویت (ساده‌تر شد چون Interceptor هندل می‌کند)
  const checkAuth = async () => {
    setIsLoading(true);
    try {
      // فقط یک درخواست میزنیم، اگر 401 بده Interceptor بالا خودش رفرش میکنه و دوباره درخواست میزنه!
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

  useEffect(() => {
    checkAuth();
  }, []);

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
