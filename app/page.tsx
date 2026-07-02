import { getDataCategory } from '@/actions/category/Actions';
import { fetchNumberQuestoinAction } from '@/actions/user/questions/get/Actions';
import HomePage from '@/components/user/HomePage/HomePage';

export default async function Page() {
  // واکشی تعداد سوالات در سمت سرور
  const questionsCountResponse = await fetchNumberQuestoinAction();
  const questionsCount = questionsCountResponse.success ? questionsCountResponse.data : 0;

  return (
    // پاس دادن مقدار به کامپوننت سطح بعدی
    <HomePage questionsCount={questionsCount} />
  );
}