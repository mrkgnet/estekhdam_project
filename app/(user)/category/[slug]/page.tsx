import React, { Suspense } from 'react'
import FetchDataByCat from './FetchDataByCat'
import LinearLoader from '@/components/LinearLoader'

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 🌟 تبدیل اسلاگ از حالت URL به حروف فارسی 🌟
  const decodedSlug = decodeURIComponent(slug);
  
  // برای تست می‌توانید هر دو را لاگ بگیرید تا تفاوت را ببینید


  return (
    <div>
      <Suspense fallback={<LinearLoader />}>
        {/* مقدار دی‌کد شده (فارسی) را به کامپوننت پاس می‌دهیم */}
        <FetchDataByCat slug={decodedSlug} />
      </Suspense>
    </div>
  )
}
