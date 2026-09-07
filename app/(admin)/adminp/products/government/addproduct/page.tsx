import React, { Suspense } from 'react';
import SpinerLoader from '@/components/SpinerLoader';
import { getDataCategory } from '@/actions/category/Actions';
import CreateProductPage from './ShowData';

// کامپوننت داخلی جهت واکشی دسته‌بندی‌ها در مرز Suspense
async function CreateProductContent() {
  const dataCategory = await getDataCategory();

  return (
    <div>
      <CreateProductPage dataCategory={dataCategory} />
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <Suspense fallback={<SpinerLoader />}>
        <CreateProductContent />
      </Suspense>
    </div>
  );
}
