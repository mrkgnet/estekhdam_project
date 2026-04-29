import React from 'react'
import ShowMainSlider from './ShowMainSlider'
import { getMainSliderDataAction } from '@/actions/admin/mainslider/fetch/Actionst'

export default async function FetchMainSlider() {
    // واکشی اطلاعات از دیتابیس
    const response = await getMainSliderDataAction();
    
    return (
      // پاس دادن دیتا به کلاینت کامپوننت
      <ShowMainSlider getDataSlider={response} />
    )
}
