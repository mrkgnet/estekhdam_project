import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function fetchAllProductDataAction(
  page: number = 1,
  limit: number = 10,
  searchQuery: string = "",
  categoryQuery: string = "",
) {
  try {
    const skip = (page - 1) * limit;
    const whereClause: Prisma.ProductWhereInput = {};

    if (searchQuery) {
      whereClause.name = { contains: searchQuery };
    }

    if (categoryQuery) {
      // ۱. دیکد کردن حروف فارسی از URL
      const decodedCategory = decodeURIComponent(categoryQuery);

      // ۲. پیدا کردن دسته مورد نظر به همراه فرزندانش
      const category = await db.category.findFirst({
        where: { catSlug: decodedCategory },
        include: { children: true },
      });

      if (category) {
        // ۳. گرفتن آیدی خود دسته + آیدی تمام زیردسته‌هایش
        const allCategoryIds = [category.id, ...category.children.map((child) => child.id)];

        // ۴. جستجوی محصولاتی که حداقل یکی از این آیدی‌ها را دارند (سینتکس صحیح PostgreSQL)
        whereClause.categories = {
          some: {
            id: {
              in: allCategoryIds
            }
          }
        };
      } else {
        // اگر دسته اصلا پیدا نشد، کوئری را طوری تنظیم کن که چیزی برنگرداند
        return { success: true, data: [], totalPages: 0 };
      }
    }

    const [result, totalCount] = await Promise.all([
      db.product.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: limit,
      }),
      db.product.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return { success: true, data: result, totalPages,totalCount  };
  } catch (error) {
    console.error(error);
    return { success: false, data: [], totalPages: 0 , totalCount :0};
  }
}
