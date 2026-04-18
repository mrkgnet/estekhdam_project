// app/(admin)/adminp/order/FetchData.tsx
import BackButton from '@/components/ui/BackButton'
import ShowData from './ShowData'
import { getAllOrders } from '@/actions/admin/order/fetch/Actions'

type Props = {
  currentPage: number;
  searchQuery: string;
  limit: number;
}

export default async function FetchData({ currentPage, searchQuery, limit }: Props) {
    // فراخوانی تابع
    const allOrders = await getAllOrders(currentPage, limit, searchQuery)

    // اگر خطایی رخ داد یا داده‌ای نبود
    if (!allOrders?.success || !allOrders?.data) {
        return (
            <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg">
                {allOrders?.message || "خطایی در دریافت اطلاعات رخ داد."}
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">لیست سفارشات و تخصیص‌ها</h1>
                    <p className="text-gray-500 text-sm mt-1">مدیریت محصولات خریداری شده یا اختصاص یافته به کاربران</p>
                </div>
                <div>
                    <BackButton />
                </div>
            </div>

            {/* پاس دادن اطلاعات صفحه‌بندی به کلاینت */}
            <ShowData 
                orders={allOrders.data} 
                totalPages={allOrders.totalPages || 1}
                currentPage={currentPage}
                limit={limit}
            />
        </div>
    )
}
