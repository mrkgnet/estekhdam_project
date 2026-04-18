import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { infoCurentUser } from "@/lib/auth";
import { createUserSchema, updateUserSchema } from "@/lib/validations/user";

// ---------------- GET USERS ----------------
export async function GET(req: Request) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 5);

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              phoneNumber: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              role: search === "admin" || search === "user" ? search : undefined,
            },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),

      db.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false, message: "خطا در دریافت کاربران" }, { status: 500 });
  }
}

// ---------------- CREATE USER ----------------
export async function POST(req: Request) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const body = await req.json();

    const validated = createUserSchema.parse(body);

    const user = await db.user.create({
      data: validated,
    });

    return NextResponse.json({
      success: true,
      user,
      message: "کاربر اضافه شد",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false, message: "خطا در ایجاد کاربر" }, { status: 500 });
  }
}

// ---------------- UPDATE USER ----------------
export async function PATCH(req: Request) {
  try {
    const currentUser = await infoCurentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    }

    const body = await req.json();

    const validated = updateUserSchema.parse(body);

    const updatedUser = await db.user.update({
      where: {
        id: validated.id,
      },
      data: {
        phoneNumber: validated.phoneNumber,
        email: validated.email,
        role: validated.role,
        isActive: validated.isActive,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "کاربر بروزرسانی شد",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ success: false, message: "خطا در بروزرسانی کاربر" }, { status: 500 });
  }
}
