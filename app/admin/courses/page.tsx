import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";

export default async function AdminCoursesPage() {
  const courses = await db.course.findMany({
    include: {
      _count: {
        select: {
          sections: true,
          coursePurchases: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Courses</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your course catalog
          </p>
        </div>
        <Button variant="accent" asChild className="w-full sm:w-auto">
          <Link href="/admin/courses/new">
            <Plus className="h-4 w-4" />
            New Course
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">No courses yet</p>
            <Button variant="accent" asChild>
              <Link href="/admin/courses/new">Create your first course</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-lg sm:text-xl">{course.title}</CardTitle>
                    <Badge variant={course.published ? "default" : "secondary"}>
                      {course.published ? (
                        <>
                          <Eye className="mr-1 h-3 w-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-1 h-3 w-3" />
                          Draft
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {course.description || "No description"}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full sm:w-auto shrink-0">
                  <Link href={`/admin/courses/${course.id}`}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-muted-foreground">
                  <span>
                    <strong className="text-foreground">
                      ${(course.priceInCents / 100).toFixed(2)}
                    </strong>{" "}
                    price
                  </span>
                  <span>
                    <strong className="text-foreground">
                      {course._count.sections}
                    </strong>{" "}
                    sections
                  </span>
                  <span>
                    <strong className="text-foreground">
                      {course._count.coursePurchases}
                    </strong>{" "}
                    purchases
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
