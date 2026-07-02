import { getDataCategory } from '@/actions/category/Actions';
import HomePage from '@/components/user/HomePage/HomePage';

export default async function Page() {
  // واکشی داده‌ها در سمت سرور برای حفظ سئو (SEO)
  // const initialCategories = await getDataCategory();

  return (
    // پاس دادن ایمن داده‌ها به کامپوننت کلاینت
    <HomePage  />
  );
}