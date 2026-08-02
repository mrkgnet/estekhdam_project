"use client"

import React, { useState } from 'react'
import { Check, Star } from 'lucide-react'

interface Plan {
    id: string
    name: string
    price: string
    period: string
    discountBadge?: string
    description: string
    isPopular?: boolean
    features: string[]
}

const plans: Plan[] = [
    {
        id: '1-month',
        name: 'اشتراک یک‌ماهه',
        price: '1۹۰,۰۰۰',
        period: 'ماهانه',
        description: 'مناسب برای بررسی اولیه و تست امکانات سیستم',
        features: [
            'دسترسی کامل به تمام آزمون‌ها',
            'دانلود فایل‌های سوالات و پاسخ‌نامه‌ها',
            'پشتیبانی آنلاین از طریق تیکت',
            'گزارش‌گیری پایه از عملکرد',
        ],
    },
    {
        id: '3-month',
        name: 'اشتراک سه‌ماهه',
        price: '456,۰۰۰',
        period: 'برای ۳ ماه',
        discountBadge: '۲۰٪ تخفیف',
        description: 'بهترین گزینه برای آمادگی کامل در آزمون‌ها',
        isPopular: true,
        features: [
            'تمام امکانات پلن یک‌ماهه',
            'دسترسی به سوالات اختصاصی و ممتاز',
            'پشتیبانی اولویت‌دار',
            'ارائه تحلیل و آمار پیشرفته عملکرد',
            'امکان شرکت در آزمون‌های شبیه‌ساز',
        ],
    },
    {
        id: '6-month',
        name: 'اشتراک شش‌ماهه',
        price: '855,۰۰۰',
        period: 'برای ۶ ماه',
        discountBadge: '۳۵٪ تخفیف',
        description: 'اقتصادی‌ترین انتخاب برای استفاده طولانی‌مدت',
        features: [
            'تمام امکانات پلن سه‌ماهه',
            'دسترسی نامحدود به تمامی به‌روزرسانی‌ها',
            'پشتیبانی تلفنی و اختصاصی',
            'مشاوره تخصصی آنلاین',
            'ضمانت بازگشت وجه تا ۷ روز',
        ],
    },
]

export default function PricingPage() {
    const [selectedPlan, setSelectedPlan] = useState<string>('3-month')

    return (
        <div dir="rtl" className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Header */}
            <div className="max-w-2xl mx-auto text-center mb-12">
                <p className="text-2xl font-medium text-slate-900">
                    پلن مناسب خود را انتخاب کنید
                </p>
                <p className="mt-2 text-sm text-slate-500">
                    با تهیه هر یک از پلن‌ها، به تمامی امکانات پلتفرم دسترسی خواهید داشت.
                </p>
            </div>

            {/* Cards */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 gap-4 lg:grid-cols-3">
                {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id

                    return (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`flex flex-col justify-between rounded-xl border p-6 transition-colors cursor-pointer ${isSelected
                                    ? 'border-slate-900'
                                    : 'border-slate-200 hover:border-slate-400'
                                }`}
                        >
                            <div>
                                {/* Icon + Title row (google-style) */}
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${plan.isPopular ? 'bg-amber-100' : 'bg-slate-100'
                                        }`}>
                                        <Star className={`h-4 w-4 ${plan.isPopular ? 'text-amber-500' : 'text-slate-400'}`} />
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-900">{plan.name}</h3>
                                </div>

                                <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                                    {plan.description}
                                </p>

                                {/* Price */}
                                <div className="mt-5 flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-slate-900">{plan.price}</span>
                                    <span className="text-xs text-slate-500">تومان / {plan.period}</span>
                                    {plan.discountBadge && (
                                        <span className="mr-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                            {plan.discountBadge}
                                        </span>
                                    )}
                                </div>

                                <div className="my-5 border-t border-slate-100" />

                                <ul className="space-y-2.5 text-sm text-slate-600">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-400" strokeWidth={2} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                type="button"
                                className={`mt-6 w-full rounded-lg py-2.5 text-sm font-medium transition-colors ${isSelected
                                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                                        : 'border border-slate-200 text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {isSelected ? 'انتخاب شده - خرید اشتراک' : 'انتخاب این پلن'}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
