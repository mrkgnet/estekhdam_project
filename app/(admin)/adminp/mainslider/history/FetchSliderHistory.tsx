
import React from 'react'
import ShowSliderHistory from './ShowSliderHistory'
import { getMainSliderDataAction } from '@/actions/admin/mainslider/fetch/Actionst'

export default async function FetchSliderHistory() {
    // فراخوانی اکشن سرور
    const response = await getMainSliderDataAction()
    
    // استخراج آرایه داده‌ها (اگر خطایی بود یا دیتایی نبود، آرایه خالی می‌فرستیم)
    const historySlider = response.data || []

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <ShowSliderHistory historySlider={historySlider} />
        </div>
    )
}
