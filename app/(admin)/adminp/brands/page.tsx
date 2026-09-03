// app/admin/brands/FetchBrandsSSR.tsx
import React, { Suspense } from 'react';
import { getBrands, getBrandsSectionSetting } from '@/actions/brands/Actions';
import DotsLoader from '@/components/ui/Loading/DotsLoader';
import ShowBrandsAdmin from './ShowBrandsAdmin';

export default async function page() {
  const [brandsResponse, isSectionVisible] = await Promise.all([
    getBrands(),
    getBrandsSectionSetting(),
  ]);

  return (
    <Suspense fallback={<DotsLoader />}>
      <ShowBrandsAdmin 
        initial={brandsResponse} 
        initialSectionVisible={isSectionVisible} 
      />
    </Suspense>
  );
}