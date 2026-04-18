import React from 'react';
import ShowDataBreakingNews from './ShowDataBreakingNews';
import { fetchBreakingNewsAction } from '@/actions/user/breakingnews/Gov/fetch/Actions';


export default async function FetchDataBreakingNews() {
  const newsData = await fetchBreakingNewsAction();
  const govNews = newsData.data || [];


  return (
    <div>
      <ShowDataBreakingNews govNews={govNews} />
    </div>
  );
}
