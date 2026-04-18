"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Lock, ArrowRight, CheckCircle, Loader2, Mail, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// 🔴 ۱. onSuccess را اختیاری (?) کنید تا در Navbar ارور تایپ‌اسکریپت نگیرید
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; 
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "verify" | "done">("phone");
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { checkAuth } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setStep("phone");
      setPhone("");
      setEmail("");
      setCode("");
      setTimer(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => {
      if (step === "phone") phoneInputRef.current?.focus();
      if (step === "verify") codeInputRef.current?.focus();
    }, 150);
  }, [step, isOpen]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (t: number) =>
    `${Math.floor(t / 60).toString().padStart(2, "0")}:${(t % 60).toString().padStart(2, "0")}`;

  const sendOtp = async () => {
    if (!phone) return toast.error("شماره موبایل را وارد کنید");
    if (phone.length !== 11 || !phone.startsWith("09")) return toast.error("شماره موبایل معتبر نیست");
    if (!email) return toast.error("ایمیل را وارد کنید");
    if (!email.includes("@")) return toast.error("ایمیل معتبر نیست");

    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/sendOTP", { phone, email });
      if (res.data.status === "success") {
        setStep("verify");
        setTimer(120);
        toast.success("کد تأیید ارسال شد");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "خطا در ارسال کد");
    } finally {
      setIsLoading(false);
    }
  };

  const reSendOtp = async () => {
    if (timer > 0) return;
    setIsLoading(true);
    try {
      await axios.post("/api/auth/sendOTP", { phone, email });
      setTimer(120);
      toast.success("کد مجدداً ارسال شد");
    } catch {
      toast.error("خطا در ارسال مجدد");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!code) return toast.error("کد را وارد کنید");

    setIsLoading(true);
    try {
      const res = await axios.post("/api/auth/verifyOTP", { phone, code });
      if (res.data.status === "success") {
        setStep("done");
        await checkAuth(); 
        toast.success("ورود موفق");
        
        setTimeout(() => {
          // 🔴 ۲. بررسی وجود onSuccess قبل از فراخوانی
          if (onSuccess) onSuccess(); 
          
          onClose(); // بستن خودکار مدال پس از ورود موفق
          router.refresh(); 
        }, 700);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "کد اشتباه است");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // 🔴 ۳. اضافه کردن onClick به لایه تاریک بیرونی
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        // چک میکنیم که کلیک دقیقاً روی همین لایه تاریک بوده (نه روی فرم سفید رنگ)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div 
       initial={{ opacity: 0, scale: 0.8, y: 30 }} // scale را کمی کوچکتر کردم تا پرش محسوس‌تر باشد
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.8, y: 30 }}
        // 🔴 این بخش برای حالت فنری اضافه شده است:
        transition={{ 
          type: "spring", 
          stiffness: 350, // قدرت یا سفتی فنر (هرچه بیشتر، سریع‌تر)
          damping: 20     // اصطکاک یا ترمز فنر (هرچه کمتر، بیشتر بالا و پایین می‌پرد)
        }}
        className="w-full max-w-[350px]"
      >
        <div className="bg-white rounded shadow-2xl p-6 relative">
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6 mt-4">
            <div className="w-14 h-14 mx-auto bg-[#fa7342] rounded-2xl flex items-center justify-center mb-3">
              <Lock className="text-white" />
            </div>
            <h2 className="font-bold text-base">
              {step === "phone" ? "ورود / ثبت‌نام" : step === "verify" ? "تأیید کد" : "خوش آمدید"}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {step === "phone" && (
              <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="space-y-1">
                  <label className="block text-gray-700 text-sm">شماره موبایل</label>
                  <div className="relative">
                    <Smartphone className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input ref={phoneInputRef} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09123456789" className="w-full pr-10 py-3 px-2.5 border rounded-xl outline-none focus:border-[#fa7342]" dir="ltr" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700 text-sm">ایمیل (اجباری)</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" className="w-full pr-10 py-3 px-2.5 border rounded-xl outline-none focus:border-[#fa7342]" dir="ltr" />
                  </div>
                </div>

                <button onClick={sendOtp} disabled={isLoading} className="w-full py-2.5 bg-[#fa7342] hover:bg-[#e06538] transition-colors cursor-pointer text-white rounded-xl flex justify-center gap-2">
                  {isLoading ? <Loader2 className="animate-spin" /> : "ارسال کد"}
                  <ArrowRight />
                </button>
              </motion.div>
            )}

            {step === "verify" && (
              <motion.div key="verify" className="space-y-4">
                <input ref={codeInputRef} value={code} onChange={(e) => setCode(e.target.value)} maxLength={5} placeholder="- - - - -" className="w-full text-center tracking-widest border rounded-xl py-3 outline-none focus:border-[#fa7342]" dir="ltr" />

                <div className="flex justify-between text-sm text-slate-600">
                  <button onClick={reSendOtp} disabled={timer > 0} className={timer > 0 ? "text-slate-400" : "text-[#fa7342] font-bold"}>
                    {timer > 0 ? formatTime(timer) : "ارسال مجدد"}
                  </button>
                  <button onClick={() => setStep("phone")}>ویرایش شماره</button>
                </div>

                <button onClick={verifyOtp} disabled={isLoading} className="w-full py-3 flex justify-center items-center bg-[#fa7342] hover:bg-[#e06538] cursor-pointer text-white rounded-xl transition-colors">
                  {isLoading ? <Loader2 className="animate-spin" /> : "تأیید"}
                </button>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div key="done" className="text-center space-y-4 py-4">
                <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
                <p className="font-bold text-slate-700">با موفقیت وارد شدید!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
