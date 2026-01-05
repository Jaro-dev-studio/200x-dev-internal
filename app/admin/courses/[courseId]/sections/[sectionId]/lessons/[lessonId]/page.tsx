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
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/courses/${courseId}/sections`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">
            {lesson.section.course.title} / {lesson.section.title}
          </p>
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Lesson Content */}
        <div className="space-y-6">
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

