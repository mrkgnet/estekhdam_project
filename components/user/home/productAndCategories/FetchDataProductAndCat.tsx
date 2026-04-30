import React from 'react';
import CourseTabSlider from './CourseTabSlider'; // نام فایل کلاینت ایمپورت شده اصلاح شد
import { fetchProductsByCategoriesAction } from '@/actions/user/home/productAndCategories/fetch/Actions';
import { TabType } from './page';

interface FetchDataProps {
  title: string;
  tabs: TabType[];
  defaultTab: string;
}

export default async function FetchDataProductAndCat({ title, tabs=[], defaultTab }: FetchDataProps) {
  // از defaultTab برای واکشی اولیه استفاده می‌کنیم
  const result = await fetchProductsByCategoriesAction(defaultTab);

  if (!result.success) {
    return <div className="text-center py-10 text-red-500">خطا در دریافت اطلاعات محصولات</div>;
  }

  const { products } = result.data;

  return (
    <div className="w-full">
      <CourseTabSlider
        title={title}
        tabs={tabs}
        defaultTab={defaultTab}
        products={products}
      />
    </div>
  );
}
