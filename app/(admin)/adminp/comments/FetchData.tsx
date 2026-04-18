import { getAdminComments } from '@/actions/comment/admin/fetch/Actions'
import React from 'react'
import ShowData from './ShowData'

type Props = {
  currentPage: number;
  query: string;
  limit: number;
  unreadOnly: boolean;
}

export default async function FetchData({ currentPage, query, limit, unreadOnly }: Props) {
  // فراخوانی دیتای سمت سرور
  const { comments, totalPages, totalCount } = await getAdminComments({
    query,
    page: currentPage,
    limit,
    unreadOnly,
  });

  return (
    <div className="p-6">
      {/* پاس دادن داده‌ها و پارامترها به کلاینت کامپوننت */}
      <ShowData 
        initialComments={comments} 
        totalPages={totalPages}
        currentPage={currentPage}
        limit={limit}
        totalCount={totalCount}
      />
    </div>
  )
}
