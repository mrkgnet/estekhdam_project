import React, { Suspense } from 'react';
import FetchDataBreakingNews from './FetchDataBreakingNews';

// 1. طراحی اسکلت لودینگ مدرن (Skeleton)

// 2. کامپوننت اصلی با استفاده از Suspense
export default function BreakingNewsComponent() {
  return (<FetchDataBreakingNews />);
}
