'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Smartphone, Lock, ArrowRight, CheckCircle, Loader2, Home } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const OTP_LENGTH = 5
type Step = 0 | 1 | 2

const steps = ["ورود شماره همراه", "ارسال کد تایید", "تکمیل"]

export default function ProLoginStepper() {
  const [step, setStep] = useState<Step>(0)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(0)
  const [loading, setLoading] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)

  const hasAutoSubmittedRef = useRef(false)
  const phoneRef = useRef<HTMLInputElement>(null)
  const otpRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const isPhoneValid = phone.startsWith('09') && phone.length === 11

  /* ✅ خواندن شماره از localStorage در اولین رندر */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPhone = window.localStorage.getItem('savedUserPhone')
      if (savedPhone) {
        setPhone(savedPhone)
      }
    }
  }, [])

  /* Focus مدیریت */
  useEffect(() => {
    if (step === 0) {
      const t = setTimeout(() => phoneRef.current?.focus(), 120)
      return () => clearTimeout(t)
    }
    if (step === 1) {
      const t = setTimeout(() => otpRef.current?.focus(), 120)
      return () => clearTimeout(t)
    }
  }, [step])

  /* ریست کردن وضعیت ارسال خودکار هنگام تغییر مرحله */
  useEffect(() => {
    hasAutoSubmittedRef.current = false
  }, [step])

  /* ✅ بررسی و تایید کد با useCallback */
  const handleVerifyOTP = useCallback(async () => {
    setLoading(true)
    setOtpError(null)

    try {
      const res = await fetch('/api/auth/verifyOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        setOtpError(data?.error || 'کد وارد شده نادرست است')
        toast.error(data?.error || 'کد وارد شده نادرست است')
        setOtp('')
        hasAutoSubmittedRef.current = false
        otpRef.current?.focus()
        return
      }

      /* ✅ ذخیره شماره در localStorage */
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('savedUserPhone', phone)
      }

      toast.success('ورود موفقیت‌آمیز بود')
      setStep(2)
      setTimeout(() => router.push('/'), 700)
    } catch {
      toast.error('خطای ارتباط با سرور')
      hasAutoSubmittedRef.current = false
    } finally {
      setLoading(false)
    }
  }, [phone, otp, router])

  /* ارسال خودکار به محض تکمیل طول کد تایید */
  useEffect(() => {
    if (step !== 1) return

    if (otp.length !== OTP_LENGTH) {
      hasAutoSubmittedRef.current = false
      return
    }

    if (hasAutoSubmittedRef.current) return

    hasAutoSubmittedRef.current = true
    handleVerifyOTP()
  }, [otp, step, handleVerifyOTP])

  /* مدیریت تایمر مجدد */
  useEffect(() => {
    if (timer <= 0) return
    const i = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(i)
  }, [timer])

  const formatTime = (t: number) =>
    `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60)
      .toString()
      .padStart(2, '0')}`

  const handleSendOTP = async () => {
    if (!isPhoneValid) return
    setLoading(true)
    try {
      await fetch('/api/auth/sendOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      setStep(1)
      setTimer(120)
      setOtp('')
      setOtpError(null)
    } catch {
      toast.error('خطا در ارسال کد تایید')
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendOTP()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-[400px] bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 relative overflow-hidden">
        
        {/* ✅ دکمه بازگشت به خانه در بالاترین قسمت کارت */}
        {step !== 2 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-blue-600 font-medium transition-colors cursor-pointer group"
            >
              <Home className="w-3.5 h-3.5 text-slate-700 group-hover:text-blue-600 transition-colors" />
              <span>بازگشت به خانه</span>
            </button>
          </div>
        )}

        {/* استپر بالای فرم */}
        <div className="w-full mx-auto mb-6">
          <div className="flex items-center justify-center gap-2">
            {steps.map((label, i) => {
              const isActive = step === i
              const isDone = step > i
              return (
                <React.Fragment key={label}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : isActive
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      {isDone ? '✓' : i + 1}
                    </div>
                    <span
                      className={`text-[11px] ${
                        isActive ? 'text-blue-600 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <div
                      className={`h-[2px] flex-1 -mt-3 ${
                        step > i ? 'bg-emerald-400' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* هدر بخش وضعیت */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-600/30">
            <Lock className="text-white w-6 h-6" />
          </div>
          <h2 className="font-bold text-base text-slate-900">
            {step === 0 ? 'ورود / ثبت‌نام' : step === 1 ? 'تأیید کد' : 'خوش آمدید'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">ورود سریع و امن به حساب کاربری</p>
        </div>

        {/* محتوای پله‌ها با افکت حرکت آنی */}
        <AnimatePresence mode="wait" initial={false}>
          {step === 0 && (
            <motion.div
              key="step-phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
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
                    className="w-full pr-10 py-3 px-2.5 border text-[15px] border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition"
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
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-blue-600/20 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'ارسال کد تایید'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* باکس آبی برای نمایش شماره موبایل و دکمه ویرایش سریع */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 text-center text-xs text-slate-600 flex items-center justify-between" dir="rtl">
                <span>کد تایید به شماره <strong className="text-blue-700 tracking-wider font-bold mx-1">{phone}</strong> ارسال شد.</span>
                <button 
                  onClick={() => setStep(0)} 
                  className="text-blue-600 hover:text-blue-800 font-bold underline transition"
                >
                  ویرایش
                </button>
              </div>

              {/* باکس‌های شکیل تفکیک‌شده کد تایید */}
              <div className="relative flex justify-between w-full" dir="ltr">
                {[...Array(OTP_LENGTH)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 flex items-center justify-center text-lg font-bold border-2 rounded-xl transition-all relative ${
                      otp.length === i && !loading
                        ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/20'
                        : otp[i]
                        ? 'border-slate-400 text-slate-900 bg-white'
                        : 'border-slate-200 text-transparent bg-white'
                    }`}
                  >
                    {otp[i] || ''}
                    {otp.length === i && !loading && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-[2px] h-6 bg-blue-600 animate-pulse" />
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
                    const val = e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH)
                    setOtp(val)
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-text disabled:cursor-not-allowed"
                  dir="ltr"
                  autoComplete="one-time-code"
                />
              </div>

              {loading && (
                <p className="text-xs text-center text-blue-600 flex items-center justify-center gap-1.5 animate-pulse">
                  <Loader2 className="animate-spin w-3.5 h-3.5" />
                  در حال بررسی خودکار...
                </p>
              )}

              {otpError && (
                <p className="text-xs text-center text-red-500 font-medium">{otpError}</p>
              )}

              <div className="flex justify-between text-sm text-slate-600">
                <button
                  disabled={timer > 0 || loading}
                  onClick={() => {
                    setTimer(120)
                    handleSendOTP()
                  }}
                  className={timer > 0 ? 'text-slate-400' : 'text-blue-600 font-bold hover:text-blue-700 transition-colors'}
                >
                  {timer > 0 ? formatTime(timer) : 'ارسال مجدد کد'}
                </button>
                <button 
                  disabled={loading}
                  onClick={() => setStep(0)} 
                  className="hover:text-blue-600 text-slate-500 transition-colors"
                >
                  ویرایش شماره
                </button>
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length < OTP_LENGTH}
                className="w-full py-3 flex justify-center items-center bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-medium rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-blue-600/20 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'تأیید و ورود'}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-4"
            >
              <CheckCircle className="mx-auto text-emerald-500 w-16 h-16 animate-bounce" />
              <p className="font-bold text-slate-700">ورود با موفقیت انجام شد</p>
              <p className="text-xs text-slate-400">در حال انتقال به صفحه اصلی...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}