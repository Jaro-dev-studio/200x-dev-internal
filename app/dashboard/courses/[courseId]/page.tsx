import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Circle,
  Lock,
  FileText,
} from "lucide-react";
import { LessonLink } from "./lesson-link";

interface CoursePageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Check if user has purchased this course
  const coursePurchase = await db.coursePurchase.findFirst({
    where: {
      userId: session.user.id,
      courseId,
    },
  });

  if (!coursePurchase) {
    redirect("/dashboard");
  }

  const course = await db.course.findUnique({
    where: { id: courseId },
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

  // Get user's progress
  const lessonProgress = await db.lessonProgress.findMany({
    where: {
      userId: session.user.id,
      lessonId: {
        in: course.sections.flatMap((s) => s.lessons.map((l) => l.id)),
      },
    },
  });

  const progressMap = new Map(
    lessonProgress.map((p) => [p.lessonId, p.completed])
  );

  // Get quiz attempts for mandatory quizzes
  const quizAttempts = await db.quizAttempt.findMany({
    where: {
      userId: session.user.id,
      quiz: {
        lesson: {
          section: { courseId },
        },
      },
    },
    include: { quiz: true },
  });

  const passedQuizzes = new Set(
    quizAttempts.filter((a) => a.passed).map((a) => a.quizId)
  );

  // Calculate totals
  const totalLessons = course.sections.reduce(
    (sum, section) => sum + section.lessons.length,
    0
  );
  const completedLessons = course.sections.reduce(
    (sum, section) =>
      sum +
      section.lessons.filter((lesson) => progressMap.get(lesson.id)).length,
    0
  );
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Determine which lessons are locked
  const isLessonLocked = (
    sectionIndex: number,
    lessonIndex: number
  ): boolean => {
    // If sequential progress is not required, all lessons are unlocked
    if (!course.requireSequentialProgress) return false;

    // First lesson is never locked
    if (sectionIndex === 0 && lessonIndex === 0) return false;

    // Find previous lesson
    let prevLesson = null;
    if (lessonIndex > 0) {
      prevLesson = course.sections[sectionIndex].lessons[lessonIndex - 1];
    } else if (sectionIndex > 0) {
      const prevSection = course.sections[sectionIndex - 1];
      prevLesson = prevSection.lessons[prevSection.lessons.length - 1];
    }

    if (!prevLesson) return false;

    // Check if previous lesson is completed
    const prevCompleted = progressMap.get(prevLesson.id);
    if (!prevCompleted) return true;

    // Check if previous lesson has mandatory quiz that needs to be passed
    if (prevLesson.quiz?.isMandatory && !passedQuizzes.has(prevLesson.quiz.id)) {
      return true;
    }

    return false;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 mt-1">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold sm:text-3xl">{course.title}</h1>
            {course.description && (
              <p className="text-muted-foreground text-sm sm:text-base">{course.description}</p>
            )}
          </div>
        </div>
        <Badge variant="secondary" className="text-base sm:text-lg shrink-0 ml-11 sm:ml-0">
          {progressPercent}% Complete
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Sections */}
      <div className="space-y-4 sm:space-y-6">
        {course.sections.map((section, sectionIndex) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                Section {sectionIndex + 1}: {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.lessons.map((lesson, lessonIndex) => {
                  const isCompleted = progressMap.get(lesson.id);
                  const isLocked = isLessonLocked(sectionIndex, lessonIndex);
                  const hasQuiz = !!lesson.quiz;

                  return (
                    <LessonLink
                      key={lesson.id}
                      href={`/dashboard/courses/${courseId}/lessons/${lesson.id}`}
                      isLocked={isLocked}
                    >
                      <div className="flex-shrink-0">
                        {isLocked ? (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        ) : isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{lesson.title}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          {lesson.wistiaVideoId && (
                            <span className="flex items-center gap-1">
                              <Play className="h-3 w-3" />
                              Video
                            </span>
                          )}
                          {hasQuiz && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              Quiz{lesson.quiz?.isMandatory && " (Required)"}
                            </span>
                          )}
                        </div>
                      </div>
                      {!isLocked && !isCompleted && (
                        <Button size="sm" variant="ghost">
                          Start
                        </Button>
                      )}
                    </LessonLink>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
