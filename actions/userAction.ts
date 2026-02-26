"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache"; // این را ایمپورت کن

//fetch user
export default async function FetchUser() {
  noStore();
  try {
    const fetchUsers = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: fetchUsers };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "خطا در دریافت اطلاعات" };
  }
}

// update user

export async function UpdateUser(id: string, isActive: any) {
  try {
    const updateUser = await db.user.update({
      where: { id: id },
      data: {
        isActive: isActive,
      },
    });
    return { success: true, data: updateUser };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "خطا در تغییر وضعیت کاربر" };
  }
}

export async function ChargeUserWallet(phoneNumber: string, amount: number) {
  if (!phoneNumber || !amount) {
    return { success: false, error: "لطفا تمامی فیلد ها را پر کنید" };
  }

  try {
    const chargeUser = await db.user.update({
      where: { phoneNumber: phoneNumber },
      data: {
        userWallet: {
          increment: amount,
        },
      },
    });
    revalidatePath("/adminp/user-managment", "page");
    return {
      success: true,
      message: "شارژ با موفقیت انجام شد",
      userWallet: chargeUser.userWallet,
    };
  } catch (error) {
    console.error("Charge Error:", error);
    return { success: false, error: "خطا در شارژ کیف پول کاربر" };
  }
}

export interface DashboardStats {
  success: boolean;
  userCount: number;
  totalWallets: number;
  error?: string;
}
export async function GetInfoFromUsersInDB(): Promise<DashboardStats> {
  noStore();
  try {
    const userCount = await db.user.count({});
    const totalWallets = await db.user.aggregate({ _sum: { userWallet: true } });
    return {
      success: true,
      userCount,
      totalWallets: totalWallets._sum.userWallet || 0,
    };
  } catch (error) {
    console.error("Stats Error:", error);
    return { success: false, userCount: 0, totalWallets: 0 };
  }
}

// update profile user

export async function UpdateProfileUser(userId: string, username: string) {
  if (!userId || !username) {
    return { success: false, error: "اطلاعات ناقص است" };
  }

  try {
    const updateUser = await db.user.update({
      where: { id: userId },
      data: {
        username: username,
      },
    });
    revalidatePath("/", "layout");
    return { success: true, data: updateUser };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, error: "خطا در تغییر اطلاعات کاربر" };
  }
}




export async function CreateUser(phoneNumber: string, role: "user" | "admin") {
  try {
    const clean = phoneNumber.replace(/\s/g, "");

    if (!/^(\+98|0)?9\d{9}$/.test(clean)) {
      return { success: false, message: "شماره موبایل معتبر نیست" };
    }

    const normalized = clean.startsWith("+98")
      ? "0" + clean.slice(3)
      : clean;

    const exists = await db.user.findUnique({
      where: { phoneNumber: normalized },
    });

    if (exists) {
      return { success: false, message: "کاربر با این شماره قبلاً ثبت شده است" };
    }

    const created = await db.user.create({
      data: {
        phoneNumber: normalized,
        role,
        isActive: true,
      },
    });

    return { success: true, user: created };
  } catch (e) {
    return { success: false, message: "خطا در ایجاد کاربر" };
  }
}