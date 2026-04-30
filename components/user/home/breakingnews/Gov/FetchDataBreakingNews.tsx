import React from 'react';
import ShowDataBreakingNews from './ShowDataBreakingNews';
import { fetchBreakingNewsAction } from '@/actions/user/breakingnews/Gov/fetch/Actions';

export default async function FetchDataBreakingNews() {
  // واکشی کامل پاسخ (شامل success و data)
  const response = await fetchBreakingNewsAction();

  // در صورت عدم وجود دیتا چیزی رندر نمی‌شود
  if (!response || !response.data || response.data.length === 0) {
    return null;
  }

  return (
    <div>
      <ShowDataBreakingNews initialNews={response} />
    </div>
  );
}
