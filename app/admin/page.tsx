import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, DollarSign, TrendingUp, Package } from "lucide-react";

export default async function AdminDashboard() {
  const [
    courseCount,
    productCount,
    userCount,
    coursePurchaseCount,
    productPurchaseCount,
    coursePurchases,
    productPurchases,
  ] = await Promise.all([
    db.course.count(),
    db.digitalProduct.count(),
    db.user.count(),
    db.coursePurchase.count(),
    db.productPurchase.count(),
    db.coursePurchase.findMany({
      select: { amountPaid: true },
    }),
    db.productPurchase.findMany({
      select: { amountPaid: true },
    }),
  ]);

  const courseRevenue = coursePurchases.reduce(
    (sum, p) => sum + p.amountPaid,
    0
  );

  const productRevenue = productPurchases.reduce(
    (sum, p) => sum + p.amountPaid,
    0
  );

  const totalRevenue = courseRevenue + productRevenue;

  const stats = [
    {
      title: "Total Courses",
      value: courseCount,
      icon: BookOpen,
    },
    {
      title: "Total Products",
      value: productCount,
      icon: Package,
    },
    {
      title: "Total Users",
      value: userCount,
      icon: Users,
    },
    {
      title: "Total Purchases",
      value: coursePurchaseCount + productPurchaseCount,
      icon: TrendingUp,
    },
    {
      title: "Total Revenue",
      value: `$${(totalRevenue / 100).toFixed(2)}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your courses and content
          </p>
        </div>
        <Button variant="accent" asChild>
          <Link href="/admin/courses/new">Create Course</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <Link href="/admin/courses">View All Courses</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/courses/new">Create New Course</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/products">View All Products</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/products/new">Create New Product</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

