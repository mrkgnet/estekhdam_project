import { fetchMainSliderUserAction } from '@/actions/user/mainslider/fetch/Actions';
import React from 'react';
import ShowMainSlider from './ShowMainSlider';

export default async function FetchDataMainSlider() {
    // واکشی کامل پاسخ (شامل success و data)
    const response = await fetchMainSliderUserAction();

    // اگر دیتایی نبود، چیزی رندر نمی‌کنیم
    if (!response || !response.data || response.data.length === 0) {
        return null;
    }

    return (
        <ShowMainSlider initialSliders={response} />
    );
}