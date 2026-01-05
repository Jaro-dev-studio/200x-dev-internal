import Link from "next/link";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, CheckCircle } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Get user's purchased courses with progress
  const purchases = await db.purchase.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          sections: {
            include: {
              lessons: true,
            },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  // Get progress for all lessons
  const lessonProgress = await db.lessonProgress.findMany({
    where: { userId: session.user.id },
  });

  const progressMap = new Map(
    lessonProgress.map((p) => [p.lessonId, p.completed])
  );

  // Calculate progress for each course
  const coursesWithProgress = purchases.map((purchase) => {
    const totalLessons = purchase.course.sections.reduce(
      (sum, section) => sum + section.lessons.length,
      0
    );
    const completedLessons = purchase.course.sections.reduce(
      (sum, section) =>
        sum +
        section.lessons.filter((lesson) => progressMap.get(lesson.id)).length,
      0
    );
    const progressPercent =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Find first incomplete lesson
    let nextLesson: { sectionId: string; lessonId: string } | null = null;
    for (const section of purchase.course.sections) {
      for (const lesson of section.lessons) {
        if (!progressMap.get(lesson.id)) {
          nextLesson = { sectionId: section.id, lessonId: lesson.id };
          break;
        }
      }
      if (nextLesson) break;
    }

    return {
      ...purchase,
      totalLessons,
      completedLessons,
      progressPercent,
      nextLesson,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {session.user.name}</h1>
        <p className="text-muted-foreground">
          Continue learning from where you left off
        </p>
      </div>

      {coursesWithProgress.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-4 text-lg text-muted-foreground">
              You haven&apos;t purchased any courses yet
            </p>
            <Button variant="accent" asChild>
              <Link href="/">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {coursesWithProgress.map(
            ({
              course,
              totalLessons,
              completedLessons,
              progressPercent,
              nextLesson,
            }) => (
              <Card key={course.id} className="overflow-hidden">
                {course.thumbnail && (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    {progressPercent === 100 ? (
                      <Badge className="bg-green-500">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Complete
                      </Badge>
                    ) : (
                      <Badge variant="secondary">{progressPercent}%</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {completedLessons} of {totalLessons} lessons completed
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Progress bar */}
                  <div className="mb-4 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-accent transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex gap-2">
                    {nextLesson ? (
                      <Button variant="accent" asChild className="flex-1">
                        <Link
                          href={`/dashboard/courses/${course.id}/lessons/${nextLesson.lessonId}`}
                        >
                          <Play className="h-4 w-4" />
                          Continue
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="accent" asChild className="flex-1">
                        <Link href={`/dashboard/courses/${course.id}`}>
                          View Course
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/courses/${course.id}`}>
                        Overview
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}

