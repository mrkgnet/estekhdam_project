import React from 'react';
import ShowData from './ShowData';
import { fetchDataProduct } from '@/actions/admin/products/government/Actions';

type Props = {
  currentPage: number;
  searchQuery: string;
  limit: number;
}

export default async function FetchData({ currentPage, searchQuery, limit }: Props) {
    // دریافت خروجی جدید که شامل اطلاعات صفحه‌بندی هم هست
    // دقت کنید که جای پارامترها با امضای تابع در اکشن همخوانی داشته باشد
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
