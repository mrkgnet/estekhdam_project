"use client";

import React, { useEffect, useRef, useState } from "react";
import { Smartphone, Lock, ArrowRight, CheckCircle, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

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

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setPhone("");
      setOtp("");
      setTimer(0);
    }
  }, [isOpen]);

  // مدیریت فوکوس اتوماتیک بدون تداخل انیمیشن
  useEffect(() => {
    if (!isOpen) return;
    
    if (step === 0) {
      const t = setTimeout(() => phoneRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    
    if (step === 1) {
      const t = setTimeout(() => {
        if (otpRef.current) {
          otpRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(t);
    }
  }, [step, isOpen]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (t: number) =>
    `${Math.floor(t / 60).toString().padStart(2, "0")}:${(t % 60)
      .toString()
      .padStart(2, "0")}`;

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

  const handleVerifyOTP = async () => {
    if (otp.length < OTP_LENGTH) return;
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data?.error || "خطا در تأیید کد");
        return;
      }

      toast.success("ورود موفقیت‌آمیز بود");
      setStep(2);

      await checkAuth();

      setTimeout(() => {
        if (onSuccess) onSuccess();
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
      
      // فوکوس مجدد روی اینپوت کد پس از ارسال دوباره
      setTimeout(() => otpRef.current?.focus(), 50);
      
      toast.success("کد مجدداً ارسال شد");
    } catch {
      toast.error("خطا در ارسال مجدد");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[360px]">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 relative">
          <button
            onClick={onClose}
            className="absolute -top-4 right-3 p-2 bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-50 transition"
            aria-label="close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Stepper */}
          <div className="w-full max-w-[290px] mx-auto mb-6">
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
                              ? "bg-slate-900 border-slate-900 text-white"
                              : "bg-white border-slate-200 text-slate-400"
                          }`}
                      >
                        {isDone ? "✓" : i + 1}
                      </div>
                      <span
                        className={`text-[11px] ${
                          isActive ? "text-slate-900 font-bold" : "text-slate-500"
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

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto bg-slate-900 rounded-2xl flex items-center justify-center mb-3">
              <Lock className="text-white" />
            </div>
            <h2 className="font-bold text-base text-slate-900">
              {step === 0 ? "ورود / ثبت‌نام" : step === 1 ? "تأیید کد" : "خوش آمدید"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">ورود سریع و امن با شماره موبایل</p>
          </div>

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
                    placeholder="09123456789"
                    className="w-full pr-10 py-3 px-2.5 border border-slate-200 rounded-xl outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition"
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
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer text-white rounded-xl flex justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin" /> : "ارسال کد"}
                <ArrowRight />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <input
                ref={otpRef}
                type="tel"
                inputMode="numeric"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))
                }
                maxLength={OTP_LENGTH}
                placeholder="- - - - -"
                className="w-full text-center tracking-widest border border-slate-200 rounded-xl py-3 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition"
                dir="ltr"
                autoComplete="one-time-code"
              />

              <div className="flex justify-between text-sm text-slate-600">
                <button
                  onClick={handleResend}
                  disabled={timer > 0}
                  className={timer > 0 ? "text-slate-400" : "text-slate-900 font-bold"}
                >
                  {timer > 0 ? formatTime(timer) : "ارسال مجدد"}
                </button>
                <button onClick={() => setStep(0)} className="hover:text-slate-900">
                  ویرایش شماره
                </button>
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length < OTP_LENGTH}
                className="w-full py-3 flex justify-center items-center bg-slate-900 hover:bg-slate-800 cursor-pointer text-white rounded-xl transition-colors disabled:opacity-60"
              >
                {loading ? <Loader2 className="animate-spin" /> : "تأیید"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-4 py-4">
              <CheckCircle className="mx-auto text-emerald-500 w-16 h-16" />
              <p className="font-bold text-slate-700">
                 ورود با موفقیت انجام شد
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
