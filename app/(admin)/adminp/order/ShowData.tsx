// app/(admin)/adminp/order/ShowData.tsx
'use client'
import deleteOrderAction from '@/actions/admin/order/delete/Actions';
import DeleteButton from '@/components/ui/DeleteButton';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import { Trash2 } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

type OrderType = {
    id: string;
    pricePaid: number;
    status: string;
    createdAt: Date | string;
    expiresAt: Date | string | null;
    isActive: boolean;
    user: {
        phoneNumber: string;
        email: string | null;
    } | null;
    // 👈 تغییر اول: اینجا به تایپ‌اسکریپت می‌گوییم محصول ممکن است null باشد
    product: {
        name: string;
        newPrice: number | null;
    } | null;
};

interface ShowDataProps {
    orders: OrderType[];
    totalPages: number;
    currentPage: number;
    limit: number;
}

export default function ShowData({ orders, totalPages, currentPage, limit }: ShowDataProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentUrlQuery = searchParams.get("query") || "";
    const [searchTerm, setSearchTerm] = useState(currentUrlQuery);

    useEffect(() => {
        if (searchTerm === currentUrlQuery) return;

        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (searchTerm) {
                params.set("query", searchTerm);
                params.set("page", "1");
            } else {
                params.delete("query");
            }
            router.replace(`${pathname}?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, currentUrlQuery, pathname, router, searchParams]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SUCCESS':
                return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">موفق</span>;
            case 'PENDING':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-md">در انتظار</span>;
            case 'FAILED':
                return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md">ناموفق</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">{status}</span>;
        }
    };

    const getRemainingTimeBadge = (expiresAt: Date | string | null, isActive: boolean) => {
        if (!isActive) {
            return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200">غیرفعال</span>;
        }

        if (!expiresAt) {
            return <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-100">دائمی</span>;
        }

        const now = new Date();
        const expirationDate = new Date(expiresAt);
        const diffTime = expirationDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-md border border-red-100">منقضی شده</span>;
        }

        return <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md border border-orange-100">
            {diffDays} روز مانده
        </span>;
    };

    if (orders.length === 0 && !currentUrlQuery) {
        return (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200 text-gray-500">
                هیچ سفارشی برای نمایش وجود ندارد.
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="جستجو (شماره، نام محصول، ایمیل، وضعیت)..."
                className="md:w-1/3"
            />

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">ردیف</th>
                                <th className="px-6 py-4 font-medium">کاربر</th>
                                <th className="px-6 py-4 font-medium">محصول</th>
                                <th className="px-6 py-4 font-medium">اعتبار دسترسی</th>
                                <th className="px-6 py-4 font-medium">وضعیت</th>
                                <th className="px-6 py-4 font-medium">مبلغ پرداختی</th>
                                <th className="px-6 py-4 font-medium">تاریخ ثبت</th>
                                <th className="px-6 py-4 font-medium">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(currentPage - 1) * limit + index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                {/* 👈 استفاده از علامت سوال و مدیریت رنگ برای کاربر حذف شده */}
                                                <span className={`font-medium ${order.user ? 'text-gray-800' : 'text-red-500 bg-red-50 px-2 py-1 rounded-md text-xs w-fit'}`}>
                                                    {order.user?.phoneNumber ?? "کاربر حذف شده"}
                                                </span>

                                                {/* 👈 اضافه کردن علامت سوال برای ایمیل */}
                                                {order.user?.email && (
                                                    <span className="text-xs text-gray-500">{order.user.email}</span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {/* 👈 تغییر دوم: استفاده از علامت سوال و مدیریت محصول حذف شده */}
                                            <div className="flex flex-col">
                                                <span className={`font-medium ${order.product ? 'text-gray-800' : 'text-red-500 bg-red-50 px-2 py-1 rounded-md text-xs w-fit'}`}>
                                                    {order.product?.name ?? "محصول حذف شده"}
                                                </span>
                                                {order.product?.newPrice && order.product.newPrice > 0 && (
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        ارزش: {order.product.newPrice.toLocaleString('fa-IR')} تومان
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getRemainingTimeBadge(order.expiresAt, order.isActive)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {order.pricePaid === 0 ? (
                                                <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded-md text-xs">رایگان / تخصیص دستی</span>
                                            ) : (
                                                <span className="font-medium">
                                                    {order.pricePaid.toLocaleString('fa-IR')} <span className="text-xs text-gray-500">تومان</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString('fa-IR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            <DeleteButton
                                                id={order.id}
                                                action={deleteOrderAction}
                                                itemName="این سفارش"
                                                className="p-1.5 text-red-600 cursor-pointer flex bg-red-50 gap-1 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </DeleteButton>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        نتیجه‌ای برای جستجوی <span className="font-bold text-gray-700">"{searchTerm}"</span> یافت نشد.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                    <Pagination totalPages={totalPages} currentPage={currentPage} />
                </div>
            )}
        </div>
    )
}
