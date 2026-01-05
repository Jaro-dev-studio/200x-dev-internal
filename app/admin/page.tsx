import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const [courseCount, userCount, purchaseCount, revenue] = await Promise.all([
    db.course.count(),
    db.user.count(),
    db.purchase.count(),
    db.purchase.findMany({
      include: { course: true },
    }),
  ]);

  const totalRevenue = revenue.reduce(
    (sum, p) => sum + (p.course?.priceInCents || 0),
    0
  );

  const stats = [
    {
      title: "Total Courses",
      value: courseCount,
      icon: BookOpen,
    },
    {
      title: "Total Users",
      value: userCount,
      icon: Users,
    },
    {
      title: "Total Purchases",
      value: purchaseCount,
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
        <CardContent className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/admin/courses">View All Courses</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/courses/new">Create New Course</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

