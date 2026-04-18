// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { getUserId } from "@/lib/auth";

// export async function GET(req: Request) {
//   const userId = await getUserId();
//   if (!userId) {
//     return NextResponse.json({ ok: false, reason: "AUTH_REQUIRED" }, { status: 401 });
//   }

//   const { searchParams } = new URL(req.url);
//   const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
//   const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") ?? "10", 10) || 10));

//   const [total, orders] = await Promise.all([
//     db.order.count({ where: { userId } }),
//     db.order.findMany({
//       where: { userId },
//       orderBy: { createdAt: "desc" },
//       skip: (page - 1) * pageSize,
//       take: pageSize,
//       include: {
//         items: {
//           include: {
//             product: { select: { id: true, title: true, price: true, images: true, slug: true } },
//           },
//         },
//       },
//     }),
//   ]);

//   const totalPages = Math.max(1, Math.ceil(total / pageSize));

//   return NextResponse.json({
//     ok: true,
//     orders,
//     pagination: { page, pageSize, total, totalPages },
//   });
// }
