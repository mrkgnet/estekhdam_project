import React from 'react'
import ShowDataProdcut from './ShowDataProduct'

import { getDataCategory } from '@/actions/category/Actions'
import { getDataEditProduct } from '@/actions/admin/products/government/editproduct/Actions'


export default async function FetchDataEditProduct({ id }: { id: string }) {


    const response = await getDataEditProduct(id)
    const allCategories  = await getDataCategory()
    
   

    // اگر موفقیت‌آمیز نبود (مثلا ادمین نبود یا محصول پیدا نشد)
    if (!response.success) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-md text-center mt-10">
                {response.message}
            </div>
        )
    }


    return (
        <div>
            <ShowDataProdcut productData={response.product} allCategories={allCategories.data}  />
        </div>
    )
}
