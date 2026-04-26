import { fetchDataByCategory } from '@/actions/user/getDataByCategory/Actions'
import React from 'react'
import ShowDataCat from './ShowDataCAT'

interface Props {
  slug: string;
  searchQuery: string;
  currentPage: number;
  limit: number;
}

export default async function FetchDataByCat({ slug, searchQuery, currentPage, limit }: Props) {
    
    // ارسال اطلاعات سرچ و صفحه به اکشن دیتابیس
    const response = await fetchDataByCategory(slug, searchQuery, currentPage, limit);
   

    return (
        <ShowDataCat response={response} />
    )
}
