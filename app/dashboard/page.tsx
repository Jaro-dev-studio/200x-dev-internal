import Link from "next/link";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, CheckCircle, Package, Download, ExternalLink } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Get user's purchased courses with progress
  const [coursePurchases, productPurchases, lessonProgress] = await Promise.all([
    db.coursePurchase.findMany({
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
    }),
    db.productPurchase.findMany({
      where: { userId: session.user.id },
      include: {
        product: true,
      },
    }),
    db.lessonProgress.findMany({
      where: { userId: session.user.id },
    }),
  ]);

  const progressMap = new Map(
    lessonProgress.map((p) => [p.lessonId, p.completed])
  );

  // Calculate progress for each course
  const coursesWithProgress = coursePurchases.map((coursePurchase) => {
    const totalLessons = coursePurchase.course.sections.reduce(
      (sum, section) => sum + section.lessons.length,
      0
    );
    const completedLessons = coursePurchase.course.sections.reduce(
      (sum, section) =>
        sum +
        section.lessons.filter((lesson) => progressMap.get(lesson.id)).length,
      0
    );
    const progressPercent =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Find first incomplete lesson
    let nextLesson: { sectionId: string; lessonId: string } | null = null;
    for (const section of coursePurchase.course.sections) {
      for (const lesson of section.lessons) {
        if (!progressMap.get(lesson.id)) {
          nextLesson = { sectionId: section.id, lessonId: lesson.id };
          break;
        }
      }
      if (nextLesson) break;
    }

    return {
      ...coursePurchase,
      totalLessons,
      completedLessons,
      progressPercent,
      nextLesson,
    };
  });

  const hasAnyPurchases = coursesWithProgress.length > 0 || productPurchases.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {session.user.name}</h1>
        <p className="text-muted-foreground">
          Continue learning from where you left off
        </p>
      </div>

      {!hasAnyPurchases ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-4 text-lg text-muted-foreground">
              You haven&apos;t purchased any courses or products yet
            </p>
            <Button variant="accent" asChild>
              <Link href="/dashboard/browse">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Courses Section */}
          {coursesWithProgress.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                My Courses
              </h2>
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
            </div>
          )}

          {/* Digital Products Section */}
          {productPurchases.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                My Digital Products
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {productPurchases.map(({ product }) => (
                  <Card key={product.id} className="overflow-hidden">
                    {product.thumbnail && (
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{product.title}</CardTitle>
                        <Badge className="bg-green-500">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Purchased
                        </Badge>
                      </div>
                      {product.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="accent" asChild className="flex-1">
                          <Link href={`/dashboard/products/${product.slug}`}>
                            <ExternalLink className="h-4 w-4" />
                            Access Product
                          </Link>
                        </Button>
                        {product.fileUrl && (
                          <Button variant="outline" asChild>
                            <a href={product.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

