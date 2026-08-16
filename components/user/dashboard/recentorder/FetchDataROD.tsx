import React from 'react';
import ShowDataROD from './ShowDataROD';
import { fetchDataROUAction } from '@/actions/user/dashboard/recentorder/Fetch/Actions';

interface FetchDataRODProps {
  page?: number;
}

export default async function FetchDataROD({ page = 1 }: FetchDataRODProps) {
  const response = await fetchDataROUAction(page, 5);

  return (
    <div>
      <ShowDataROD response={response} />
    </div>
  );
}
