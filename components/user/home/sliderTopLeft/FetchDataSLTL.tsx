import React from 'react';
import ShowDataSLTL from './ShowDataSLTL';
import { fetchLatestProductAction } from '@/actions/user/latestProduct/Actions';

export default async function FetchDataSLTL() {
  // واکشی کامل پاسخ از اکشن
  const response = await fetchLatestProductAction();

  // اگر پاسخی نبود یا خطا داشت، طبق منطق خودت رندر نمی‌کنیم
  if (!response || !response.success || !response.data || response.data.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <ShowDataSLTL
        title="جدیدترین‌ها"
        initialProducts={response} // کل آبجکت پاسخ را می‌فرستیم
        slug="latest"
      />
    </div>
  );
}
