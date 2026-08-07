// actions/admin/orders/Actions.ts (یا مسیر دلخواه شما)
'use server'
import { infoCurentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getAllOrders(page: number = 1, limit: number = 10, searchQuery: string = "") {
  try {
    const currentUser = await infoCurentUser();

    // ۱. بررسی دسترسی ادمین
    if (!currentUser || currentUser.role !== "admin") {
      return { 
        success: false, 
        message: "دسترسی غیرمجاز." 
      };
    }

    // ۲. منطق تبدیل کلمه فارسی به وضعیت دیتابیس برای جستجو
    const q = searchQuery.toLowerCase().trim();
    let statusFilter = undefined;
    if ("موفق".includes(q) && q !== "") statusFilter = 'SUCCESS';
    else if ("در انتظار".includes(q) && q !== "") statusFilter = 'PENDING';
    else if ("ناموفق".includes(q) && q !== "") statusFilter = 'FAILED';

    // ۳. ساخت شرط جستجو (Where Clause)
    const whereCondition = searchQuery ? {
        OR: [
            { user: { phoneNumber: { contains: searchQuery } } },
            { user: { email: { contains: searchQuery, mode: 'insensitive' as const } } },
            { refId: { contains: searchQuery } }, // امکان سرچ با کد رهگیری
            { subscriptionPlan: { title: { contains: searchQuery, mode: 'insensitive' as const } } }, // جستجو در عنوان پلن
            ...(statusFilter ? [{ status: statusFilter as any }] : [])
        ]
    } : {};

    const skip = (page - 1) * limit;

    // ۴. واکشی همزمان تعداد کل و داده‌های صفحه جاری
    const [totalCount, orders] = await db.$transaction([
        db.order.count({ where: whereCondition }),
        db.order.findMany({
            where: whereCondition,
            skip,
            take: limit,
            include: {
                user: {
                    select: { phoneNumber: true, email: true }
                },
                subscriptionPlan: { // تغییر از product به subscriptionPlan
                    select: { title: true, price: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return { 
      success: true, 
      data: orders,
      totalPages,
      totalCount
    };

  } catch (error) {
    console.error("Error fetching orders:", error);
    return { 
      success: false, 
      message: "خطایی در دریافت اطلاعات سفارشات رخ داد." 
    };
  }
}
