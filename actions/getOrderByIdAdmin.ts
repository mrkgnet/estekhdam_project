// actions/getOrderByIdAdmin.ts
"use server";
import { db } from "@/lib/db";

export async function getOrderByIdAdmin(id: string) {
  try {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            phoneNumber: true,
            username: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                features: true,
                specs: true,
                durationType: true,
                duration: true,
                hours: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { ok: false as const, error: "ORDER_NOT_FOUND" };
    }

    return { ok: true as const, order };
  } catch (error) {
    console.error("Database Error (getOrderByIdAdmin):", error);
    return { ok: false as const, error: "DB_ERROR" };
  }
}
