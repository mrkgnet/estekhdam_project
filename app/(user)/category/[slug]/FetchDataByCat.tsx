import { fetchDataByCategory } from '@/actions/user/getDataByCategory/Actions'
import React from 'react'
import ShowDataCat from './ShowDataCAT'

export default async function FetchDataByCat({ slug }: { slug: string }) {
    // گرفتن اطلاعات از دیتابیس
    const response = await fetchDataByCategory(slug);

    return (
        <ShowDataCat response={response} />
    )
}
