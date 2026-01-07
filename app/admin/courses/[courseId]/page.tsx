import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Layers } from "lucide-react";
import { CourseEditForm } from "./course-edit-form";

interface CourseEditPageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseEditPage({ params }: CourseEditPageProps) {
  const { courseId } = await params;

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        include: {
          _count: {
            select: { lessons: true },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const totalLessons = course.sections.reduce(
    (sum, section) => sum + section._count.lessons,
    0
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-start gap-3 sm:gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0 mt-1">
          <Link href="/admin/courses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">{course.title}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Edit course details</p>
        </div>
      </div>

      <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
        {/* Course Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseEditForm course={course} />
          </CardContent>
        </Card>

        {/* Sections Link Card */}
        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Layers className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{course.sections.length} Sections</p>
                <p className="text-sm text-muted-foreground">{totalLessons} Lessons</p>
              </div>
            </div>
            <Button variant="accent" asChild className="w-full">
              <Link href={`/admin/courses/${course.id}/sections`}>
                Manage Sections & Lessons
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
