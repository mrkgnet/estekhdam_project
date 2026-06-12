import React from 'react'
import ShowDataCAT from './ShowDataCAT'
import { getDataCategory } from '@/actions/category/Actions'

export default async function FetchDataCAT() {
  
    const responseData = await getDataCategory();
    
    // اصلاح شده: ساختار آبجکت را حفظ می‌کنیم تا با تایپ ShowDataCAT همخوانی داشته باشد
    const response = {
      success: responseData?.success ?? false,
      data: responseData?.data?.slice(0, 12) || []
    };

    return (
    <div>
      <ShowDataCAT response={response} />
    </div>
  )
}
