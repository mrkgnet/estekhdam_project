// app/actions/admin/contact/update/Actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
// ایمپورت دیتابیس خود را اینجا قرار دهید (مثال: Prisma)
// import prisma from "@/lib/prisma"; 

export async function markAsReadAction(id: string) {
    try {
        // تغییر وضعیت در دیتابیس (مثال با پریزما)
        
        await db.contact.update({
            where: { id },
            data: { isRead: true }
        });
        

        // مسیر صفحه‌ای که لیست پیام‌ها در آن است را برای بروزرسانی کش وارد کنید
        revalidatePath('/adminp/contacts'); 
        return { success: true };
    } catch (error) {
        console.error("Error updating contact:", error);
        return { success: false, message: "خطا در بروزرسانی وضعیت پیام" };
    }
}
