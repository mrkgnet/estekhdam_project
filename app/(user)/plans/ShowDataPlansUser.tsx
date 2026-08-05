"use client"

import React, { useState, useEffect } from 'react'
import { Check, Star } from 'lucide-react'
import Link from 'next/link'

export type DbPlan = {
    id: string
    title: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    isPopular: boolean;
    durationDays: number;
}

export type DisplayPlan = {
    id: string
    name: string
    price: string
    isPopular: boolean
    discountBadge: string | undefined
    period: string
    description: string
    features: string[]
}

interface ShowDataPlansUserProps {
    initials: {
        success: boolean;
        data: DbPlan[];
        error?: string;
    }
}

const staticPlansConfig = [
    {
        durationDays: 30,
        defaultName: 'اشتراک یک‌ماهه',
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
        durationDays: 90,
        defaultName: 'اشتراک سه‌ماهه',
        period: 'برای ۳ ماه',
        description: 'بهترین گزینه برای آمادگی کامل در آزمون‌ها',
        features: [
            'تمام امکانات پلن یک‌ماهه',
            'دسترسی به سوالات اختصاصی و ممتاز',
            'پشتیبانی اولویت‌دار',
            'ارائه تحلیل و آمار پیشرفته عملکرد',
            'امکان شرکت در آزمون‌های شبیه‌ساز',
        ],
    },
    {
        durationDays: 180,
        defaultName: 'اشتراک شش‌ماهه',
        period: 'برای ۶ ماه',
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

function CardSkeleton() {
    return (
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 p-6 bg-slate-50/50 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <div>
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-200 animate-pulse" />
                    <div className="h-5 w-32 rounded bg-slate-200 animate-pulse" />
                </div>
                <div className="mt-4 space-y-2">
                    <div className="h-3 w-full rounded bg-slate-200 animate-pulse" />
                    <div className="h-3 w-4/5 rounded bg-slate-200 animate-pulse" />
                </div>
                <div className="mt-6 flex items-center gap-2">
                    <div className="h-8 w-28 rounded bg-slate-200 animate-pulse" />
                    <div className="h-4 w-16 rounded bg-slate-200 animate-pulse" />
                </div>
                <div className="my-5 border-t border-slate-200" />
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((f) => (
                        <div key={f} className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-slate-200 animate-pulse" />
                            <div className="h-3 w-3/4 rounded bg-slate-200 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-6 h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
        </div>
    )
}

function PlansSkeleton() {
    return (
        <div dir="rtl" className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto text-center mb-12">
                <div className="h-7 w-64 mx-auto rounded bg-slate-200 animate-pulse mb-3" />
                <div className="h-4 w-96 mx-auto rounded bg-slate-200 animate-pulse" />
            </div>
            <div className="max-w-5xl mx-auto grid grid-cols-1 gap-4 lg:grid-cols-3">
                {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
            </div>
        </div>
    )
}

export default function ShowDataPlansUser({ initials }: ShowDataPlansUserProps) {
    if (!initials || !initials.success) {
        return <PlansSkeleton />
    }

    const dbPlans = initials.data || []

    if (dbPlans.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-500 font-sans">
                {initials?.error || 'هیچ پلنی یافت نشد.'}
            </div>
        )
    }

    const displayPlans: DisplayPlan[] = dbPlans.map((dbPlan) => {
        const staticConfig = staticPlansConfig.find(
            (item) => item.durationDays === dbPlan.durationDays
        ) || staticPlansConfig[0]

        const finalPrice = dbPlan.discountPrice ?? dbPlan.price
        let discountBadge: string | undefined

        if (dbPlan.discountPrice && dbPlan.price > dbPlan.discountPrice) {
            const percent = Math.round(((dbPlan.price - dbPlan.discountPrice) / dbPlan.price) * 100)
            discountBadge = `${percent.toLocaleString('fa-IR')}٪ تخفیف`
        }

        return {
            id: dbPlan.id,
            name: dbPlan.title || staticConfig.defaultName,
            price: finalPrice.toLocaleString('fa-IR'),
            isPopular: dbPlan.isPopular,
            discountBadge,
            period: staticConfig.period,
            description: staticConfig.description,
            features: staticConfig.features,
        }
    })

    return <PlansContent displayPlans={displayPlans} />
}

function PlansContent({ displayPlans }: { displayPlans: DisplayPlan[] }) {
    const [selectedPlan, setSelectedPlan] = useState<string>('')
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        if (displayPlans.length > 0) {
            setSelectedPlan(displayPlans[0].id)
        }
    }, [displayPlans])

    return (
        <div dir="rtl" className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto text-center mb-12">
                <p className="text-2xl font-medium text-slate-900">پلن مناسب خود را انتخاب کنید</p>
                <p className="mt-2 text-sm text-slate-500">
                    با تهیه هر یک از پلن‌ها، به تمامی امکانات پلتفرم دسترسی خواهید داشت.
                </p>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 gap-4 lg:grid-cols-3 items-stretch">
                {displayPlans.map((plan) => {
                    const isSelected = selectedPlan === plan.id
                    return (
                        <Link
                            key={plan.id}
                            href={`/cart/${plan.id}`}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`relative flex flex-col justify-between rounded-xl p-6 transition-all cursor-pointer hover:shadow-xl hover:scale-[1.03] ${
                                plan.isPopular
                                    ? 'border-2 border-slate-600 shadow-lg bg-amber-50/20 scale-[1.02]'
                                    : isSelected
                                    ? 'border-2 border-slate-500 shadow-md bg-white'
                                    : 'border-2 border-slate-500 shadow-md bg-white'
                            }`}
                        >
                            {!isMounted && (
                                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                                </div>
                            )}

                            {isMounted ? (
                                plan.isPopular && (
                                    <div className="absolute -top-3.5 right-1/2 translate-x-1/2 bg-slate-900 text-amber-400 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap z-20">
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        <span>پیشنهاد ویژه</span>
                                    </div>
                                )
                            ) : (
                                <div className="absolute -top-3.5 right-1/2 translate-x-1/2 h-6 w-24 bg-slate-200 rounded-full animate-pulse z-20" />
                            )}

                            <div>
                                <div className="flex items-center gap-3">
                                    {isMounted ? (
                                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                            plan.isPopular ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            <Star className={`h-4 w-4 ${plan.isPopular ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                                        </div>
                                    ) : (
                                        <div className="h-9 w-9 rounded-lg bg-slate-200 animate-pulse flex-shrink-0" />
                                    )}

                                    {isMounted ? (
                                        <h3 className="text-base font-semibold text-slate-900">{plan.name}</h3>
                                    ) : (
                                        <div className="h-5 w-32 rounded bg-slate-200 animate-pulse" />
                                    )}
                                </div>

                                <p className="mt-3 text-sm text-slate-500 leading-relaxed">{plan.description}</p>

                                <div className="mt-5 flex items-baseline gap-1 min-h-[32px]">
                                    {isMounted ? (
                                        <>
                                            <span className="text-2xl font-bold text-slate-900">{plan.price}</span>
                                            <span className="text-xs text-slate-500">تومان / {plan.period}</span>
                                            {plan.discountBadge && (
                                                <span className="mr-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-medium">
                                                    {plan.discountBadge}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-24 rounded bg-slate-200 animate-pulse" />
                                            <div className="h-4 w-12 rounded bg-slate-200 animate-pulse" />
                                        </div>
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

                            {isMounted ? (
                                <div className="mt-6 block w-full text-center rounded-lg py-2.5 text-sm font-medium bg-slate-900 text-white shadow-sm">
                                    {isSelected ? 'خرید اشتراک' : 'انتخاب این پلن'}
                                </div>
                            ) : (
                                <div className="mt-6 h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
