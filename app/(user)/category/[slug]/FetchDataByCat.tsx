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
    // واکشی داده‌ها در سمت سرور
    const response = await fetchDataByCategory(slug, searchQuery, currentPage, limit);

    return (
        <ShowDataCat 
            initialResponse={response} 
            slug={slug}
            searchQuery={searchQuery}
            currentPage={currentPage}
            limit={limit}
        />
    )
}
