import React, { Suspense } from 'react'

import LinearLoader from '@/components/LinearLoader'
import FetchDataEditProduct from './FetchDataEditProduct'
import SpinerLoader from '@/components/SpinerLoader';
import DotsLoader from '@/components/ui/Loading/DotsLoader';

// ۱. کلمه async را به کامپوننت اضافه کردیم
// ۲. تایپ params را به Promise تغییر دادیم
export default async function page({ params }: { params: Promise<{ id: string }> }) {
    
    // ۳. در اینجا params را await می‌کنیم تا باز شود و بتوانیم id را بگیریم
    const { id } = await params;
    

    return (
        <div>
            {/* Suspense برای هندل کردن لودینگ تا زمانی که دیتای سرور آماده شود */}
            <Suspense fallback={<DotsLoader />}>
                {/* آیدی استخراج شده را به کامپوننت واکشی دیتا پاس می‌دهیم */}
                <FetchDataEditProduct id={id} />
            </Suspense>
     
        </div>
    )
}
