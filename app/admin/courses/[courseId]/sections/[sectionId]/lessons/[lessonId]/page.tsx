import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { LessonEditForm } from "./lesson-edit-form";
import { AttachmentManager } from "./attachment-manager";
import { QuizEditor } from "./quiz-editor";
import { WistiaPlayer } from "@/app/dashboard/courses/[courseId]/lessons/[lessonId]/wistia-player";

interface LessonEditPageProps {
  params: Promise<{
    courseId: string;
    sectionId: string;
    lessonId: string;
  }>;
}

export default async function LessonEditPage({ params }: LessonEditPageProps) {
  const { courseId, sectionId, lessonId } = await params;

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      section: {
        include: { course: true },
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

  if (!lesson || lesson.section.id !== sectionId) {
    notFound();
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-start gap-3 sm:gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0 mt-1">
          <Link href={`/admin/courses/${courseId}/sections`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground truncate">
            {lesson.section.course.title} / {lesson.section.title}
          </p>
          <h1 className="text-xl font-bold sm:text-3xl">{lesson.title}</h1>
        </div>
      </div>

      <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
        {/* Lesson Content */}
        <div className="space-y-6">
          {lesson.wistiaVideoId && (
            <Card>
              <CardHeader>
                <CardTitle>Video Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <WistiaPlayer videoId={lesson.wistiaVideoId} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Lesson Details</CardTitle>
            </CardHeader>
            <CardContent>
              <LessonEditForm lesson={lesson} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <AttachmentManager
                lessonId={lesson.id}
                attachments={lesson.attachments}
              />
            </CardContent>
          </Card>
        </div>

        {/* Quiz */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <QuizEditor lessonId={lesson.id} quiz={lesson.quiz} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
