"use client";

import React, { useEffect, useRef, useState } from "react";
import { Smartphone, ArowRight, CheckCircle, Loader2, X, ArrowRight } from "lucide-react";
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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setOtp("");
      setTimer(0);
      const savedPhone =
        typeof window !== "undefined"
          ? window.localStorage.getItem("savedUserPhone")
          : null;
      setPhone(savedPhone || "");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const targetRef = step === 0 ? phoneRef : step === 1 ? otpRef : null;
    if (targetRef) {
      const t = setTimeout(() => targetRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [step, isOpen]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (t: number) =>
    `${Math.floor(t / 60)
      .toString()
      .padStart(2, "0")}:${(t % 60).toString().padStart(2, "0")}`;

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

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.currentTarget === e.target && onClose()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded shadow-xl overflow-hidden">
              {/* هدر کوچک */}
              <div className="relative bg-slate-50 border-b border-slate-200 px-6 py-3">
                <p className="text-sm text-slate-600 text-center" dir="rtl">
                  برای استفاده از خدمات سایت ابتدا ثبت نام/ ورود کنید                </p>
                <button
                  onClick={onClose}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
                  aria-label="بستن"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* مرحله 0: ورود شماره */}
                {step === 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-slate-800">
                        ورود / ثبت‌نام
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        شماره موبایل خود را وارد کنید
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-slate-700 text-sm font-medium">
                        شماره موبایل
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          ref={phoneRef}
                          type="tel"
                          inputMode="numeric"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.trim())}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSendOTP()
                          }
                          placeholder="09123456789"
                          className="w-full pr-11 pl-4 py-3 text-base border border-slate-300 rounded-xl outline-none focus:border-[#3b5998] focus:ring-2 focus:ring-[#3b5998]/20 transition"
                          dir="ltr"
                        />
                      </div>
                      {!isPhoneValid && phone.length > 0 && (
                        <p className="text-xs text-red-500">
                          شماره باید با 09 شروع شود و 11 رقم باشد
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleSendOTP}
                      disabled={!isPhoneValid || loading}
                      className="w-full py-3 bg-[#3b5998] hover:bg-[#2d4373] text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                      ) : (
                        <>
                          دریافت کد تأیید
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {/* مرحله 1: تأیید کد */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-slate-800">
                        کد تأیید
                      </h2>
                      <p className="text-sm text-slate-500 mt-1" dir="rtl">
                        کد ارسال شده به{" "}
                        <span className="font-bold text-slate-700">{phone}</span>{" "}
                        را وارد کنید
                      </p>
                      <button
                        onClick={() => setStep(0)}
                        className="text-xs text-[#3b5998] hover:text-[#2d4373] font-medium mt-2"
                      >
                        ویرایش شماره
                      </button>
                    </div>

                    {/* باکس‌های OTP با کرسر چشمک‌زن */}
                    <div className="relative flex justify-center gap-2" dir="ltr">
                      {[...Array(OTP_LENGTH)].map((_, i) => {
                        const isActive = otp.length === i;
                        const isFilled = !!otp[i];

                        return (
                          <div
                            key={i}
                            onClick={() => otpRef.current?.focus()}
                            className={`w-12 h-12 flex items-center justify-center text-lg font-bold border-2 rounded-lg transition cursor-text select-none ${isActive
                                ? "border-[#3b5998] ring-2 ring-[#3b5998]/20 bg-blue-50"
                                : isFilled
                                  ? "border-[#3b5998] bg-white text-slate-900"
                                  : "border-slate-300 bg-slate-50"
                              }`}
                          >
                            {isFilled ? (
                              otp[i]
                            ) : isActive ? (
                              /* کرسر چشمک‌زن */
                              <span className="w-px h-6 bg-[#3b5998] animate-[blink_1s_step-end_infinite]" />
                            ) : null}
                          </div>
                        );
                      })}

                      {/* input مخفی که ورودی واقعی رو می‌گیره */}
                      <input
                        ref={otpRef}
                        type="tel"
                        inputMode="numeric"
                        value={otp}
                        disabled={loading}
                        onChange={(e) => {
                          const val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, OTP_LENGTH);
                          setOtp(val);
                          if (val.length === OTP_LENGTH) handleVerifyOTP(val);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                        autoComplete="one-time-code"
                      />
                    </div>

                    <button
                      onClick={handleResend}
                      disabled={timer > 0 || loading}
                      className={`w-full text-sm font-medium transition ${timer > 0
                          ? "text-slate-400"
                          : "text-[#3b5998] hover:text-[#2d4373]"
                        }`}
                    >
                      {timer > 0
                        ? `ارسال مجدد کد (${formatTime(timer)})`
                        : "ارسال مجدد کد"}
                    </button>

                    <button
                      onClick={() => handleVerifyOTP()}
                      disabled={loading || otp.length < OTP_LENGTH}
                      className="w-full py-3 bg-[#3b5998] hover:bg-[#2d4373] text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                      ) : (
                        "تأیید و ورود"
                      )}
                    </button>
                  </motion.div>
                )}

                {/* مرحله 2: موفقیت */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-3" />
                    <h3 className="text-lg font-bold text-slate-800">
                      ورود موفق
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      در حال انتقال...
                    </p>
                  </motion.div>
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
