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
          purchases: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">
            Manage your course catalog
          </p>
        </div>
        <Button variant="accent" asChild>
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
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
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
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/courses/${course.id}`}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 text-sm text-muted-foreground">
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
                      {course._count.purchases}
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

