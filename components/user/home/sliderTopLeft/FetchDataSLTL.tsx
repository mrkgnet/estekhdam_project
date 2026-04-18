import React from 'react';
import LatestProdcut from './ShowDataSLTL';

import ShowDataSLTR from './ShowDataSLTL';
import ShowDataSLTL from './ShowDataSLTL';
import { fetchLatestProductAction } from '@/actions/user/latestProduct/Actions';


export default async function FetchDataSLTL() {
  const { success, data: products } = await fetchLatestProductAction();

  // اگر خطایی رخ داد یا محصولی نبود، چیزی رندر نشود (یا یک اسکلت/پیام خالی نشان دهید)
  if (!success || !products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full ">
      <ShowDataSLTL
        title="جدیدترین‌ها"
        products={products}
        slug="latest" // این اسلاگ برای دکمه "مشاهده همه" استفاده می‌شود
      />
    </div>
  );
}
