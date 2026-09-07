import React, { Suspense } from 'react';
import ShowDataProdcut from './ShowDataProduct';
import DotsLoader from '@/components/ui/Loading/DotsLoader';
import { getDataCategory } from '@/actions/category/Actions';
import { getDataEditProduct } from '@/actions/admin/products/government/Actions';

interface PageProps {
    params: Promise<{ id: string }>;
}

// کامپوننت داخلی برای واکشی داده درون مرز Suspense
async function EditProductContent({ id }: { id: string }) {
    // واکشی موازی اطلاعات محصول و دسته‌بندی‌ها برای بهینه‌سازی سرعت
    const [response, allCategories] = await Promise.all([
        getDataEditProduct(id),
        getDataCategory()
    ]);

    // در صورت عدم موفقیت (عدم دسترسی یا یافت نشدن محصول)
    if (!response.success) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-md text-center mt-10">
                {response.message}
            </div>
        );
    }

    return (
        <div>
            <ShowDataProdcut productData={response.product} allCategories={allCategories.data} />
        </div>
    );
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    return (
        <div>
            <Suspense key={id} fallback={<DotsLoader />}>
                <EditProductContent id={id} />
            </Suspense>
        </div>
    );
}
