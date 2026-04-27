import { fetchDataProfileAction } from '@/actions/user/dashboard/profile/fetch/Actions'
import ShowDataPU from './ShowDataPU';


export default async function FetchDataPU() {
  const response = await fetchDataProfileAction();

  // مدیریت حالت خطا یا لاگین نبودن کاربر
  if (!response.success || !response.data) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl">
        {response.message || "خطا در دریافت اطلاعات. لطفا وارد حساب کاربری خود شوید."}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
       {/* ارسال پراپ data از پاسخ به جای کل آبجکت response */}
      <ShowDataPU user={response.data} />
    </div>
  )
}
