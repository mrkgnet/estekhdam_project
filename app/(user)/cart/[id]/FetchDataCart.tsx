import { fetchDataCartUserAction } from '@/actions/user/cart/Fetch/Actions'
import React from 'react'
import ShowDataCart from './ShowDataCart'

export default async function FetchDataCart({pid} :{pid:string}) {
     // واکشی اطلاعات در سمت سرور بدون نیاز به لودینگ در کلاینت!
  const response = await fetchDataCartUserAction(pid);
  return (
    <div>
      {/* پاس دادن دیتا و آیدی به کامپوننت نمایش */}
      <ShowDataCart productData={response.data} productId={pid} />
    </div>
  )
}
