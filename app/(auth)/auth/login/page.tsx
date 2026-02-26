"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Lock, ArrowRight, CheckCircle, RefreshCcw, Loader2, ChevronRight, Mail } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";

const AuthPage = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "verify" | "done">("phone");
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRaw = searchParams.get("next") || "/";
  const next = nextRaw.startsWith("/") ? nextRaw : "/";

  const { checkAuth } = useAuth();

  // فوکوس خودکار
  useEffect(() => {
    setTimeout(() => {
      if (step === "phone") phoneInputRef.current?.focus();
      if (step === "verify") codeInputRef.current?.focus();
    }, 150);
  }, [step]);

  // تایمر OTP
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (t: number) =>
    `${Math.floor(t / 60)
      .toString()
      .padStart(2, "0")}:${(t % 60).toString().padStart(2, "0")}`;

  // ارسال OTP
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

  // ارسال مجدد
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

  // تایید OTP
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
          router.push(next);
          router.refresh();
        }, 700);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "کد اشتباه است");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative ">
    

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[350px] p-4">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <span />
            <Link href="/" className=" text-gray-500 flex items-center gap-1">
              <ChevronRight className="w-4 h-4" />
              بازگشت به خانه
            </Link>
          </div>

          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto bg-[#fa7342] rounded-2xl flex items-center justify-center mb-3">
              <Lock className="text-white" />
            </div>
            <h2 className="font-bold text-base">
              {step === "phone" ? "ورود / ثبت‌نام" : step === "verify" ? "تأیید کد" : "خوش آمدید"}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === "phone" && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                {/* شماره موبایل */}
                <div className="space-y-1">
                  <label className="block   text-gray-700">شماره موبایل</label>
                  <div className="relative">
                    <Smartphone className="absolute  right-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09123456789"
                      className="w-full pr-10 py-3 px-2.5 border rounded-xl outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* ایمیل */}
                <div className="space-y-1">
                  <label className="block   text-gray-700">ایمیل (اجباری)</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full pr-10 py-3  px-2.5 border rounded-xl outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>

                <button
                  onClick={sendOtp}
                  disabled={isLoading}
                  className="w-full py-2.5 bg-[#fa7342] cursor-pointer text-white rounded-xl flex justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "ارسال کد"}
                  <ArrowRight />
                </button>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === "verify" && (
              <motion.div key="verify" className="space-y-4">
                <input
                  ref={codeInputRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={5}
                  placeholder="- - - - -"
                  className="w-full text-center  tracking-widest border rounded-xl py-3"
                  dir="ltr"
                />

                <div className="flex justify-between ">
                  <button onClick={reSendOtp} disabled={timer > 0} className="text-blue-600">
                    {timer > 0 ? formatTime(timer) : "ارسال مجدد"}
                  </button>
                  <button onClick={() => setStep("phone")}>ویرایش شماره</button>
                </div>

                <button
                  onClick={verifyOtp}
                  disabled={isLoading}
                  className="w-full py-3 flex justify-center items-center bg-[#fa7342] cursor-pointer text-white rounded-xl"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "تأیید"}
                </button>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === "done" && (
              <motion.div key="done" className="text-center space-y-4">
                <CheckCircle className="mx-auto text-green-600 w-12 h-12" />
                <p>در حال انتقال...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
