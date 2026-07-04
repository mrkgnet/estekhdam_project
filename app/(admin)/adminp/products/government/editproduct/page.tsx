import React, { Suspense } from 'react';
import FetchData from './FetchData';
import DotsLoader from '@/components/ui/Loading/DotsLoader';

interface PageProps {
    searchParams: Promise<{ page?: string; query?: string }>;
}

export default async function EditProduct({ searchParams }: PageProps) {
    // خواندن پارامترها به صورت ناهمگام (مطابق با استانداردهای Next.js 15+)
    const params = await searchParams;

    const currentPage = Number(params?.page) || 1;
    const searchQuery = params?.query || "";
    const limit = 10;

    return (
        <Suspense fallback={<DotsLoader />}>
            <FetchData currentPage={currentPage} searchQuery={searchQuery} limit={limit} />
        </Suspense>
    );
}