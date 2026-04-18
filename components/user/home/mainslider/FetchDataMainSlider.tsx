import { fetchMainSliderUserAction } from '@/actions/user/mainslider/fetch/Actions'
import React from 'react'
import ShowMainSlider from './ShowMainSlider'

export default async function FetchDataMainSlider() {
    // واکشی اطلاعات از دیتابیس
    const dataMainSliderUser = await fetchMainSliderUserAction();

    // استخراج آرایه دیتا (اگر خطایی بود آرایه خالی پاس داده می‌شود)
    const sliders = dataMainSliderUser.data || [];

    return (<ShowMainSlider sliders={sliders} />)
}
