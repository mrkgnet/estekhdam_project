"use client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const OTP_LENGTH = 5;

type Step = 0 | 1 | 2;

export default function ProLoginStepper() {
  const [step, setStep] = useState<Step>(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  const phoneRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isPhoneValid = phone.startsWith("09") && phone.length === 11;
  const isStep1Valid = isPhoneValid;

  useEffect(() => {
    if (step === 0) {
      setTimeout(() => phoneRef.current?.focus(), 10);
    }

    if (step === 1) {
      const t = setTimeout(() => {
        otpRef.current?.focus();
        otpRef.current?.select();
      }, 10);
      return () => clearTimeout(t);
    }
  }, [step]);

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
    if (!isStep1Valid) return;
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

      toast.success("ورود موفقیت آمیز بود");
      setStep(2);

      setTimeout(() => router.push("/"), 500);
    } catch (err) {
      toast.error("خطای ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "ورود اطلاعات", desc: "شماره موبایل" },
    { title: "تأیید کد", desc: "کد پیامک‌شده" },
    { title: "ورود موفق", desc: "تکمیل فرآیند" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7f9] px-4">
      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-7">
          <div className="text-center mb-6">
            <h1 className="text-lg font-bold text-gray-800">ورود حرفه‌ای</h1>
            <p className="text-xs text-gray-500 mt-1">سریع، امن و استاندارد</p>
          </div>

          <div className="mb-7">
            <div className="flex justify-center">
              <div className="flex items-center justify-between w-full max-w-[360px] mx-auto">
                {steps.map((s, i) => {
                  const isLast = i === steps.length - 1;
                  const isActive = i === step;
                  const isDone = i < step;
                  return (
                    <div
                      key={i}
                      className={`flex items-center ${
                        isLast ? "flex-[0.5]" : "flex-1"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${
                              isDone
                                ? "bg-green-500 text-white"
                                : isActive
                                ? "bg-[#fa7342] text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                        >
                          {i + 1}
                        </div>
                        <div className="hidden sm:block text-center">
                          <div
                            className={`text-xs font-semibold ${
                              isActive ? "text-[#fa7342]" : "text-gray-600"
                            }`}
                          >
                            {s.title}
                          </div>
                        </div>
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className={`h-[2px] flex-1 mx-3 ${
                            isDone ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 1 */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">
                  شماره موبایل
                </label>
                <input
                  ref={phoneRef}
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.trim())}
                  placeholder="09123456789"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#fa7342]/30 text-left"
                  dir="ltr"
                />
                {!isPhoneValid && phone.length > 0 && (
                  <p className="text-[11px] text-red-500 mt-1">
                    شماره معتبر نیست
                  </p>
                )}
              </div>

              <button
                onClick={handleSendOTP}
                disabled={!isStep1Valid || loading}
                className="w-full py-3 rounded-xl bg-[#fa7342] text-white font-semibold disabled:opacity-60"
              >
                {loading ? "در حال ارسال..." : "ارسال کد تأیید"}
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  کد تأیید
                </label>
                <input
                  ref={otpRef}
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH)
                    )
                  }
                  maxLength={OTP_LENGTH}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="w-full h-12 text-center text-lg border rounded-xl focus:ring-2 focus:ring-[#fa7342]/30"
                  dir="ltr"
                  placeholder="-----"
                />
              </div>

              <div className="flex justify-between text-sm">
                <button
                  disabled={timer > 0}
                  onClick={() => {
                    if (timer > 0) return;
                    setTimer(120);
                    setOtp("");
                    otpRef.current?.focus();
                  }}
                  className="text-blue-600 disabled:text-gray-400"
                >
                  {timer > 0 ? formatTime(timer) : "ارسال مجدد"}
                </button>
                <button onClick={() => setStep(0)} className="text-gray-500">
                  ویرایش اطلاعات
                </button>
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length < OTP_LENGTH}
                className="w-full py-3 rounded-xl bg-[#fa7342] text-white font-semibold disabled:opacity-60"
              >
                {loading ? "در حال بررسی..." : "تأیید و ورود"}
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 2 && (
            <div className="text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl">
                ✓
              </div>
              <p className="text-gray-700 font-semibold">
               (در حال انتقال به صفحه اصلی) ورود با موفقیت انجام شد
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
