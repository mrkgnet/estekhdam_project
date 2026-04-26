import React from 'react'
import ShowDataTabProCat from './ShowDataTabProCat'
import { productByCatAction } from '@/actions/user/home/productAndCategories/fetchProductByCat/Actions';

export default async function FetchTabProCat() {
    const response = await productByCatAction();

    // اگر دیتایی نبود یا آرایه خالی بود
    if (!response.success || !response.data || response.data.length === 0) {
        return <div className="text-center p-4 text-slate-500">هیچ دسته‌بندی یافت نشد.</div>;
    }

    console.log(response.data)

    return (
        <div className="flex flex-col gap-12 w-full">
            {/* روی تک‌تک دسته‌های اصلی حلقه می‌زنیم و به کلاینت می‌فرستیم */}
            {response.data.map((mainCategory: any) => (
                <ShowDataTabProCat
                    key={mainCategory.id}
                    mainCategory={mainCategory}
                />
            ))}
        </div>
    )
}
