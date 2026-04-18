import LinearLoader from '@/components/LinearLoader'
import React, { Suspense } from 'react'
import FetchSliderHistory from './FetchSliderHistory'
import SpinerLoader from '@/components/SpinerLoader'

export default function page() {
    return (
        <div>
            <Suspense fallback={<SpinerLoader />}>
                <FetchSliderHistory />
            </Suspense>
        </div>
    )
}
