
import React from 'react'
import ShowDataTabProCat from './ShowDataTabProCat'
import { productByCatAction } from '@/actions/user/home/productAndCategories/fetchProductByCat/Actions';

export default async function FetchTabProCat() {
    const response = await productByCatAction();
    
    if (!response.success || !response.data || response.data.length === 0) {
        return <div className="text-center p-4">هیچ دسته‌بندی یافت نشد.</div>;
    }

    return (
      <div className="flex flex-col gap-12 w-full">
          {/* حلقه زدن روی دسته‌های اصلی (سطح اول) */}
          {response.data.map((mainCategory: any) => {
              // اگر دسته اصلی نه خودش محصول دارد و نه زیردسته‌هایش، آن را رندر نکن
              const hasDirectProducts = mainCategory.products?.length > 0;
              const hasChildrenWithProducts = mainCategory.children?.some((child: any) => child.products?.length > 0);
              
              if (!hasDirectProducts && !hasChildrenWithProducts) return null;
              
              return (
                  <ShowDataTabProCat 
                      key={mainCategory.id} 
                      mainCategory={mainCategory} 
                  />
              );
          })}
      </div>
    )
}
