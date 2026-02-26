// context/AuthContext.tsx
"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// 1. تعریف دقیق ساختار اطلاعات کانتکست
interface AuthContextType {
  user: any; // برای سادگی any نگه داشته شده، در حالت ایده‌آل باید یک interface User داشته باشید
  isLoggedIn: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // ✨ اطمینان حاصل کنید که مقدار اولیه isLoading همیشه true است
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    // ✨ اشکال‌زدایی: چاپ وضعیت قبل از درخواست
    // console.log("AuthContext: Starting checkAuth...");
    try {
      const res = await axios.get("/api/auth/me");

      if (res.data && res.data.user) {
        setUser(res.data.user);
        setIsLoggedIn(true);
        // console.log("AuthContext: User is logged in.", res.data.user);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        // console.log("AuthContext: User is NOT logged in.");
      }
    } catch (error) {
      setUser(null);
      setIsLoggedIn(false);
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        console.error("Auth check failed with unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
      // console.log("AuthContext: Finished checkAuth, isLoading is now false.");
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
