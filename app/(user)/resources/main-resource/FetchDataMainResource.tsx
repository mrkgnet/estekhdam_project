import React, { Suspense } from 'react';
import { getDataCategoriMainResource } from '@/actions/user/resources/main-resources/fetchCategori/Actions';
import { fetchDataMainResources } from '@/actions/user/resources/main-resources/fetchData/Actions';
import ShowDataMainResource from './ShowDataMainResource';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function FetchDataMainResource({ searchParams }: Props) {
  const categoryParam = searchParams.category;
  const pageParam = searchParams.page;

  const currentPage = typeof pageParam === 'string' && !isNaN(Number(pageParam)) 
    ? Math.max(1, Number(pageParam)) 
    : 1;

  const activeSlugs = (
    Array.isArray(categoryParam) 
      ? categoryParam 
      : typeof categoryParam === 'string' && categoryParam.trim() !== ''
      ? [categoryParam] 
      : []
  ).map((slug) => decodeURIComponent(slug));

  const itemsPerPage = 12;

  const [categoryResponse, productsResponse] = await Promise.all([
    getDataCategoriMainResource("MAIN"),
    fetchDataMainResources(activeSlugs, currentPage, itemsPerPage)
  ]);

  const categories = categoryResponse.success ? categoryResponse.data : [];
  const products = productsResponse.success ? productsResponse.data : [];
  const totalCount = productsResponse.success ? productsResponse.totalCount : 0;

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px] text-gray-500 font-bold">
        در حال بارگذاری منابع...
      </div>
    }>
      <ShowDataMainResource 
        initialCategories={categories} 
        initialProducts={products}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        itemsPerPage={itemsPerPage}
      /> 
    </Suspense>
  );
}