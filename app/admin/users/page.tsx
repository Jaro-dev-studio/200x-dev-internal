import { db } from "@/lib/db";
import { UsersClient } from "./client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [users, courses, products] = await Promise.all([
    db.user.findMany({
      include: {
        coursePurchases: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        productPurchases: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.course.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: { title: "asc" },
    }),
    db.digitalProduct.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: { title: "asc" },
    }),
  ]);

  return <UsersClient users={users} courses={courses} products={products} />;
}
