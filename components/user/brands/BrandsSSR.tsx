import React, { Suspense } from 'react';
import { getBrandsSectionSetting, getActiveBrands } from '@/actions/brands/Actions';
import BrandsTopHome from './BrandsTopHome';
import DotsLoaderBrands from '@/components/ui/Loading/DotsLoaderBrands';

export default function BrandsSSR() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-24 sm:h-28 flex items-center justify-center" dir="rtl">
          <DotsLoaderBrands />
        </div>
      }
    >
      <BrandsFetcher />
    </Suspense>
  );
}

async function BrandsFetcher() {
  const [isSectionVisible, activeBrands] = await Promise.all([
    getBrandsSectionSetting(),
    getActiveBrands(),
  ]);

  if (!isSectionVisible || !activeBrands || activeBrands.length === 0) {
    return null;
  }

  return <BrandsTopHome brands={activeBrands} />;
}