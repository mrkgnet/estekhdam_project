import React from 'react';
import ShowDataCart from './ShowDataCart';
import { GetDataFactorPlansUser } from '@/actions/admin/plans/Actions';

export default async function FetchDataCart({ pid }: { pid: string }) {
  // واکشی اطلاعات پلن خاص بر اساس pid
  const response = await GetDataFactorPlansUser(pid);

  return (
    <div>
      {/* پاس دادن دیتا و آیدی پلن به کامپوننت نمایش */}
      <ShowDataCart planData={response.data} planId={pid} />
    </div>
  );
}