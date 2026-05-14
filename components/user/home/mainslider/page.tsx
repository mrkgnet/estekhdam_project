import React, { Suspense } from 'react'
import FetchDataMainSlider from './FetchDataMainSlider'
// ✅ ایمپورت همان اسکلتونی که در کلاینت استفاده شده است


export default function MainSliderComponent() {
  return (
    <div className="h-full">
       {/* ✅ استفاده از اسکلتون هم‌اندازه به جای SpinnerLoader */}
       
        <FetchDataMainSlider />
     
    </div>
  )
}
