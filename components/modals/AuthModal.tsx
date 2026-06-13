"use client";

import React, { useEffect, useRef, useState } from "react";
import { Smartphone, Lock, ArrowRight, CheckCircle, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

const OTP_LENGTH = 5;
type Step = 0 | 1 | 2;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const steps = ["ورود شماره همراه", "ارسال کد تایید", "تکمیل"];

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [step, setStep] = useState<Step>(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  const phoneRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);

  const { checkAuth } = useAuth();

  const isPhoneValid = phone.startsWith("09") && phone.length === 11;

  // مدیریت قفل شدن اسکرول پس‌زمینه
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // پاک‌سازی در زمان Unmount شدن کامپوننت
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setOtp("");
      setTimer(0);
      if (typeof window !== "undefined") {
        const savedPhone = window.localStorage.getItem("savedUserPhone");
        setPhone(savedPhone || "");
      } else {
        setPhone("");
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (step === 0) {
      const t = setTimeout(() => phoneRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
    if (step === 1) {
      const t = setTimeout(() => otpRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [step, isOpen]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (t: number) =>
    `${Math.floor(t / 60).toString().padStart(2, "0")}:${(t % 60).toString().padStart(2, "0")}`;

  const handleSendOTP = async () => {
    if (!isPhoneValid) return toast.error("شماره موبایل معتبر نیست");
    setLoading(true);
    try {
      await fetch("/api/auth/sendOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      setStep(1);
      setTimer(120);
      setOtp("");
      toast.success("کد تأیید ارسال شد");
    } catch {
      toast.error("خطا در ارسال کد");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (codeToVerify?: string) => {
    const finalCode = codeToVerify || otp;
    if (finalCode.length < OTP_LENGTH) return;
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: finalCode }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.error || "خطا در تأیید کد");
        setOtp("");
        otpRef.current?.focus();
        return;
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem("savedUserPhone", phone);
      }

      toast.success("ورود موفقیت‌آمیز بود");
      setStep(2);
      await checkAuth();
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    } catch {
      toast.error("خطای ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setLoading(true);
    try {
      await fetch("/api/auth/sendOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      setTimer(120);
      setOtp("");
      setTimeout(() => otpRef.current?.focus(), 80);
      toast.success("کد مجدداً ارسال شد");
    } catch {
      toast.error("خطا در ارسال مجدد");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendOTP();
    }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isOpen && (
        <motion.div
          key="auth-backdrop"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4"
          onClick={(e) => e.currentTarget === e.target && onClose()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <motion.div
            key="auth-modal"
            className="w-full max-w-[380px]"
            initial={{ opacity: 0, y: -60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <div className="relative rounded-3xl border border-slate-100 bg-white overflow-hidden">

              {/* ربان قرمز بالا */}
              <div className="w-full bg-red-600 px-4 py-2.5 flex items-center justify-center gap-2">
                <span className="text-white text-xs font-bold text-center leading-relaxed" dir="rtl">
                  برای استفاده از خدمات سایت ابتدا باید عضو شوید
                </span>
              </div>

              <div className="relative p-6">
                <button
                  onClick={onClose}
                  className="absolute -top-3 right-3 p-2 bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-50 transition"
                  aria-label="close"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* استپر */}
                <div className="w-full max-w-[370px] mx-auto mb-6">
                  <div className="flex items-center justify-center gap-2">
                    {steps.map((label, i) => {
                      const isActive = step === i;
                      const isDone = step > i;
                      return (
                        <React.Fragment key={label}>
                          <div className="flex flex-col items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all
                              ${
                                isDone
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : isActive
                                  ? "bg-[#3b5998] border-[#3b5998] text-white"
                                  : "bg-white border-slate-200 text-slate-400"
                              }`}
                            >
                              {isDone ? "✓" : i + 1}
                            </div>
                            <span
                              className={`text-[11px] ${
                                isActive ? "text-[#3b5998] font-bold" : "text-slate-500"
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                          {i < steps.length - 1 && (
                            <div
                              className={`h-[2px] flex-1 -mt-3 ${
                                step > i ? "bg-emerald-400" : "bg-slate-200"
                              }`}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto bg-[#3b5998] rounded-2xl flex items-center justify-center mb-3">
                    <Lock className="text-white" />
                  </div>
                  <h2 className="font-bold text-base text-slate-900">
                    {step === 0 ? "ورود / ثبت‌نام" : step === 1 ? "تأیید کد" : "خوش آمدید"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">ورود سریع و امن با شماره موبایل</p>
                </div>

                {/* مرحله صفر */}
                {step === 0 && (
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <label className="block text-slate-700 text-sm">شماره موبایل</label>
                      <div className="relative">
                        <Smartphone className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                          ref={phoneRef}
                          type="tel"
                          inputMode="numeric"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.trim())}
                          onKeyDown={handlePhoneKeyDown}
                          placeholder="09123456789"
                          className="w-full pr-10 py-3 px-2.5 border text-[15px] border-slate-200 rounded-xl outline-none focus:border-[#3b5998] focus:ring-2 focus:ring-[#3b5998]/10 transition"
                          dir="ltr"
                        />
                      </div>
                      {!isPhoneValid && phone.length > 0 && (
                        <p className="text-[11px] text-rose-500 mt-1">شماره معتبر نیست</p>
                      )}
                    </div>

                    <button
                      onClick={handleSendOTP}
                      disabled={!isPhoneValid || loading}
                      className="w-full py-2.5 bg-[#3b5998] hover:bg-[#2d4373] transition-all cursor-pointer text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.98]"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "ارسال کد"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* مرحله یک */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div
                      className="bg-[#3b5998]/5 border border-[#3b5998]/15 rounded-xl p-3 text-center text-xs text-slate-600 flex items-center justify-between"
                      dir="rtl"
                    >
                      <span>
                        کد تایید به شماره{" "}
                        <strong className="text-[#3b5998] tracking-wider font-bold mx-1">{phone}</strong>{" "}
                        ارسال شد.
                      </span>
                      <button
                        onClick={() => setStep(0)}
                        className="text-[#3b5998] hover:text-[#2d4373] font-bold underline transition"
                      >
                        ویرایش
                      </button>
                    </div>

                    <div className="relative flex justify-between w-full" dir="ltr">
                      {[...Array(OTP_LENGTH)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-12 h-12 flex items-center justify-center text-lg font-bold border-2 rounded-xl transition-all relative ${
                            otp.length === i && !loading
                              ? "border-[#3b5998] ring-2 ring-[#3b5998]/20 bg-[#3b5998]/5"
                              : otp[i]
                              ? "border-slate-400 text-slate-900 bg-white"
                              : "border-slate-200 text-transparent bg-white"
                          }`}
                        >
                          {otp[i] || ""}
                          {otp.length === i && !loading && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="w-[2px] h-6 bg-[#3b5998] animate-pulse" />
                            </span>
                          )}
                        </div>
                      ))}

                      <input
                        ref={otpRef}
                        type="tel"
                        inputMode="numeric"
                        value={otp}
                        disabled={loading}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH);
                          setOtp(val);
                          if (val.length === OTP_LENGTH && !loading) {
                            handleVerifyOTP(val);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-text disabled:cursor-not-allowed"
                        dir="ltr"
                        autoComplete="one-time-code"
                      />
                    </div>

                    <div className="flex justify-between text-sm text-slate-600">
                      <button
                        onClick={handleResend}
                        disabled={timer > 0}
                        className={
                          timer > 0
                            ? "text-slate-400"
                            : "text-[#3b5998] font-bold hover:text-[#2d4373] transition-colors"
                        }
                      >
                        {timer > 0 ? formatTime(timer) : "ارسال مجدد کد"}
                      </button>
                      <button
                        onClick={() => setStep(0)}
                        className="hover:text-[#3b5998] text-slate-500 transition-colors"
                      >
                        ویرایش شماره
                      </button>
                    </div>

                    <button
                      onClick={() => handleVerifyOTP()}
                      disabled={loading || otp.length < OTP_LENGTH}
                      className="w-full py-3 flex justify-center items-center bg-[#3b5998] hover:bg-[#2d4373] cursor-pointer text-white font-medium rounded-xl transition-all disabled:opacity-60 active:scale-[0.98]"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "تأیید و ورود"}
                    </button>
                  </div>
                )}

                {/* مرحله دو */}
                {step === 2 && (
                  <div className="text-center space-y-4 py-4">
                    <CheckCircle className="mx-auto text-emerald-500 w-16 h-16" />
                    <p className="font-bold text-slate-700">ورود با موفقیت انجام شد</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;