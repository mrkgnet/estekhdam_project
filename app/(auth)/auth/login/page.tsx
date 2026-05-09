'use client'

import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const OTP_LENGTH = 5
type Step = 0 | 1 | 2

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

  /* Focus */
  useEffect(() => {
    if (step === 0) phoneRef.current?.focus()
    if (step === 1) otpRef.current?.focus()
  }, [step])

  /* Reset auto submit on step change */
  useEffect(() => {
    hasAutoSubmittedRef.current = false
  }, [step])

  /* ✅ Auto Verify (FIXED) */
  useEffect(() => {
    if (step !== 1) return

    if (otp.length !== OTP_LENGTH) {
      hasAutoSubmittedRef.current = false
      return
    }

    if (hasAutoSubmittedRef.current) return

    hasAutoSubmittedRef.current = true
    handleVerifyOTP()
  }, [otp, step])

  /* Timer */
  useEffect(() => {
    if (timer <= 0) return
    const i = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(i)
  }, [timer])

  const formatTime = (t: number) =>
    `${Math.floor(t / 60)
      .toString()
      .padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`

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
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
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
        setOtpError(data?.error || 'کد نادرست است')
        toast.error(data?.error || 'کد نادرست است')
        setOtp('')
        hasAutoSubmittedRef.current = false
        otpRef.current?.focus()
        return
      }

      toast.success('ورود موفقیت‌آمیز بود')
      setStep(2)
      setTimeout(() => router.push('/'), 600)
    } catch {
      toast.error('خطای ارتباط با سرور')
      hasAutoSubmittedRef.current = false
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7f9] px-4">
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl p-7">
        {step === 0 && (
          <div className="space-y-4">
            <input
              ref={phoneRef}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09123456789"
              className="w-full border rounded-xl px-4 py-3"
              dir="ltr"
            />
            <button
              onClick={handleSendOTP}
              disabled={!isPhoneValid || loading}
              className="w-full py-3 rounded-xl bg-[#fa7342] text-white"
            >
              ارسال کد
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <input
              ref={otpRef}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))
              }
              className="w-full h-12 text-center text-lg border rounded-xl"
              placeholder="-----"
              dir="ltr"
            />

            {loading && (
              <p className="text-xs text-center text-gray-500">
                در حال بررسی خودکار...
              </p>
            )}

            {otpError && (
              <p className="text-xs text-center text-red-500">{otpError}</p>
            )}

            <button
              disabled={timer > 0}
              onClick={() => setTimer(120)}
              className="text-sm text-blue-600"
            >
              {timer > 0 ? formatTime(timer) : 'ارسال مجدد'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            ✅ ورود موفق – در حال انتقال...
          </div>
        )}
      </div>
    </div>
  )
}
