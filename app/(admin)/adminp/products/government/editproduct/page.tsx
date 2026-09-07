import React, { Suspense } from 'react';
import ShowData from './ShowData';
import DotsLoader from '@/components/ui/Loading/DotsLoader';
import { fetchDataProduct } from '@/actions/admin/products/government/Actions';

interface PageProps {
    searchParams: Promise<{ page?: string; query?: string }>;
}

interface ContentProps {
    currentPage: number;
    searchQuery: string;
    limit: number;
}

// کامپوننت ناهمگام داخلی برای واکشی داده درون مرز Suspense
async function ProductContent({ currentPage, searchQuery, limit }: ContentProps) {
    const { products, totalPages } = await fetchDataProduct(currentPage, limit, searchQuery);

    return (
        <div className="w-full max-w-screen-3xl mx-auto p-4 md:p-6">
            <ShowData 
                products={products} 
                totalPages={totalPages} 
                currentPage={currentPage}
                limit={limit}
            />
        </div>
    );
}

export default async function EditProduct({ searchParams }: PageProps) {
    const params = await searchParams;

    const currentPage = Number(params?.page) || 1;
    const searchQuery = params?.query || "";
    const limit = 10;

    return (
        <Suspense key={`${currentPage}-${searchQuery}`} fallback={<DotsLoader />}>
            <ProductContent 
                currentPage={currentPage} 
                searchQuery={searchQuery} 
                limit={limit} 
            />
        </Suspense>
    );
}
