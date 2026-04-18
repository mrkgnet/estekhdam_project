import React from 'react';
import LatestProdcut from './ShowDataTopicProduct';
import { fetchTopicProductAction } from '@/actions/user/home/TopicProduct/Actions';

export default async function FetchDataBankProduct({catSlug}:any) {
  
  const { success, data: products } = await fetchTopicProductAction(catSlug);

  // اگر خطایی رخ داد یا محصولی نبود، چیزی رندر نشود
  if (!success || !products || products.length === 0) {
    return null;
  }

  // 👇 استخراج نام دسته‌بندی از روی اولین محصول واکشی شده
  // در میان دسته‌بندی‌های محصول اول، آن موردی که اسلاگش با اسلاگ ورودی برابر است را پیدا می‌کنیم
  const targetCategory = products[0].categories.find(
    (cat: any) => cat.catSlug === catSlug
  );
  
  // اگر پیدا شد نامش را می‌گیریم، وگرنه یک نام پیش‌فرض می‌گذاریم
  const categoryName = targetCategory ? targetCategory.catName : "محصولات";

  return (
    <div className="w-full">
      <LatestProdcut
        title={categoryName} // 👈 حالا نام دسته‌بندی درست پاس داده می‌شود
        products={products}
        slug={catSlug} // بهتر است اسلاگ همین دسته را به دکمه مشاهده همه بدهید
      />
    </div>
  );
}
