import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  Play,
  FileText,
  CheckCircle,
  Lock,
} from "lucide-react";
import { BuyButton } from "./buy-button";

interface CoursePreviewPageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CoursePreviewPage({
  params,
}: CoursePreviewPageProps) {
  const { courseId } = await params;

  const course = await db.course.findUnique({
    where: { id: courseId, published: true },
    include: {
      sections: {
        include: {
          lessons: {
            include: {
              quiz: true,
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const session = await auth();

  // Check if user already purchased
  let hasPurchased = false;
  if (session?.user?.id) {
    const coursePurchase = await db.coursePurchase.findFirst({
      where: {
        userId: session.user.id,
        courseId,
      },
    });
    hasPurchased = !!coursePurchase;
  }

  const totalLessons = course.sections.reduce(
    (sum, s) => sum + s.lessons.length,
    0
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold">Back to Courses</span>
          </Link>
          <nav className="flex items-center gap-4">
            {session?.user ? (
              <Button variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-accent/5 to-transparent py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <Badge className="mb-4" variant="secondary">
                Online Course
              </Badge>
              <h1 className="mb-4 text-4xl font-bold">{course.title}</h1>
              <p className="mb-6 text-lg text-muted-foreground">
                {course.description || "No description available"}
              </p>

              <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {course.sections.length} sections
                </span>
                <span className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  {totalLessons} lessons
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">
                  ${(course.priceInCents / 100).toFixed(2)}
                </span>
                {hasPurchased ? (
                  <Button variant="accent" size="lg" asChild>
                    <Link href={`/dashboard/courses/${courseId}`}>
                      <CheckCircle className="h-4 w-4" />
                      Go to Course
                    </Link>
                  </Button>
                ) : (
                  <BuyButton courseId={courseId} />
                )}
              </div>
            </div>

            {course.thumbnail && (
              <div className="overflow-hidden rounded-xl bg-muted">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-2xl font-bold">Course Curriculum</h2>

          <div className="space-y-4">
            {course.sections.map((section, sIndex) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Section {sIndex + 1}: {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {section.lessons.map((lesson, lIndex) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 rounded-lg border border-border p-3"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm">
                          {sIndex + 1}.{lIndex + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{lesson.title}</p>
                          <div className="flex gap-2 text-xs text-muted-foreground">
                            {lesson.wistiaVideoId && (
                              <span className="flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                Video
                              </span>
                            )}
                            {lesson.quiz && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                Quiz
                              </span>
                            )}
                          </div>
                        </div>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="mb-4 text-muted-foreground">
              Ready to start learning?
            </p>
            {hasPurchased ? (
              <Button variant="accent" size="lg" asChild>
                <Link href={`/dashboard/courses/${courseId}`}>
                  Continue Learning
                </Link>
              </Button>
            ) : (
              <BuyButton courseId={courseId} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

