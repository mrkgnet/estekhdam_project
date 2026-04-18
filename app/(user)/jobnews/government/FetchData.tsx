import { cookies } from 'next/headers';
import React from 'react'
import ShowData from './ShowData'
import axios from 'axios';
import { fetchDataUserGovAction } from '@/actions/user/jobnews/government/Actions';

type Props = {
  currentPage: number;
  searchQuery: string;
  limit: number;
}

export default async function FetchNewsData({ currentPage, searchQuery, limit }: Props) {

  const response = await fetchDataUserGovAction(currentPage, limit, searchQuery);

  return (
    <div>
      <ShowData
        initialNews={response}
        currentPage={currentPage} // 👈 پاس دادن صفحه فعلی
        totalPages={response.totalPages || 1} // 👈 پاس دادن کل صفحات
      />
    </div>
  ); // ✅ اصلاح شد
}
