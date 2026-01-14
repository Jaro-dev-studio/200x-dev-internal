import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  FileText,
} from "lucide-react";
import { WistiaPlayer } from "./wistia-player";
import { LessonQuiz } from "./lesson-quiz";
import {
  CompletionProvider,
  LessonCompletionBadge,
  LessonCompletionCard,
} from "./client";

interface LessonPageProps {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = await params;

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

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      section: {
        include: {
          course: {
            include: {
              sections: {
                where: { isHidden: false },
                include: {
                  lessons: {
                    where: { isHidden: false },
                    orderBy: { order: "asc" },
                  },
                },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
      attachments: true,
      quiz: {
        include: {
          questions: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!lesson || lesson.section.courseId !== courseId || lesson.isHidden || lesson.section.isHidden) {
    notFound();
  }

  // Get progress
  const progress = await db.lessonProgress.findUnique({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
  });

  // Get quiz attempts
  const quizAttempts = lesson.quiz
    ? await db.quizAttempt.findMany({
        where: {
          userId: session.user.id,
          quizId: lesson.quiz.id,
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const hasPassedQuiz = quizAttempts.some((a) => a.passed);

  // Find previous and next lessons
  const allLessons = lesson.section.course.sections.flatMap((s) =>
    s.lessons.map((l) => ({ ...l, sectionId: s.id }))
  );
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Check if can proceed to next lesson
  // If sequential progress is not required, users can always proceed
  const canProceed =
    !lesson.section.course.requireSequentialProgress ||
    (progress?.completed && (!lesson.quiz?.isMandatory || hasPassedQuiz));

  return (
    <CompletionProvider
      lessonId={lessonId}
      userId={session.user.id}
      initialCompleted={!!progress?.completed}
    >
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 mt-4">
            <Link href={`/dashboard/courses/${courseId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground truncate">
              {lesson.section.course.title} / {lesson.section.title}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold sm:text-2xl">{lesson.title}</h1>
              <LessonCompletionBadge />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Video */}
            {lesson.wistiaVideoId && (
              <Card>
                <CardContent className="p-0">
                  <WistiaPlayer videoId={lesson.wistiaVideoId} />
                </CardContent>
              </Card>
            )}

            {/* Content */}
            {lesson.content && (
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {lesson.content.split("\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mark as complete */}
            <LessonCompletionCard />

            {/* Navigation */}
          <div className="flex justify-between">
            {prevLesson ? (
              <Button variant="outline" asChild>
                <Link
                  href={`/dashboard/courses/${courseId}/lessons/${prevLesson.id}`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Link>
              </Button>
            ) : (
              <div />
            )}
            {nextLesson && (
              canProceed ? (
                <Button variant="accent" asChild>
                  <Link href={`/dashboard/courses/${courseId}/lessons/${nextLesson.id}`}>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button variant="accent" disabled>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Attachments */}
          {lesson.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attachments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {lesson.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{attachment.name}</span>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quiz */}
          {lesson.quiz && (
            <LessonQuiz
              quiz={lesson.quiz}
              userId={session.user.id}
              attempts={quizAttempts}
              hasPassedQuiz={hasPassedQuiz}
            />
          )}
        </div>
      </div>
    </div>
    </CompletionProvider>
  );
}
