import React, { Suspense } from 'react';
import FetchData from './FetchData';

import DotsLoader from '@/components/ui/Loading/DotsLoader';




export default async function EditProduct({ searchParams }: { searchParams: Promise<{ page?: string; query?: string }> }) {

    // 👇 اضافه کردن await برای خواندن پارامترها
    const params = await searchParams;

    const currentPage = Number(params?.page) || 1;
    const searchQuery = params?.query || "";
    const limit = 10;

    return (
        // تگ Suspense باید کامپوننت Actions را دربر بگیرد


        <Suspense fallback={<DotsLoader />}>
            <FetchData  currentPage={currentPage} searchQuery={searchQuery} limit={limit} />
        </Suspense>
    );
}
