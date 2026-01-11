import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getWistiaVideoDuration } from "@/lib/wistia";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlignLeft, Play, Paperclip, HelpCircle, Clock } from "lucide-react";
import { SectionManager } from "../section-manager";

interface SectionsPageProps {
  params: Promise<{ courseId: string }>;
}

export default async function SectionsPage({ params }: SectionsPageProps) {
  const { courseId } = await params;

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      sections: {
        include: {
          lessons: {
            include: {
              quiz: true,
              _count: {
                select: { attachments: true },
              },
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

  // Auto-fetch missing video durations (excluding hidden lessons)
  const lessonsNeedingDuration = course.sections
    .flatMap((s) => s.lessons)
    .filter((l) => !l.isHidden && l.wistiaVideoId && !l.videoDurationSeconds);

  if (lessonsNeedingDuration.length > 0) {
    console.log(`[Sections] Fetching durations for ${lessonsNeedingDuration.length} lessons...`);
    
    const durationUpdates = await Promise.all(
      lessonsNeedingDuration.map(async (lesson) => {
        const duration = await getWistiaVideoDuration(lesson.wistiaVideoId!);
        return { id: lesson.id, duration };
      })
    );

    // Update lessons with fetched durations
    await Promise.all(
      durationUpdates
        .filter((u) => u.duration !== null)
        .map((u) =>
          db.lesson.update({
            where: { id: u.id },
            data: { videoDurationSeconds: u.duration },
          })
        )
    );

    // Update the in-memory course data with the new durations
    for (const update of durationUpdates) {
      if (update.duration !== null) {
        for (const section of course.sections) {
          const lesson = section.lessons.find((l) => l.id === update.id);
          if (lesson) {
            lesson.videoDurationSeconds = update.duration;
          }
        }
      }
    }

    console.log(`[Sections] Updated ${durationUpdates.filter((u) => u.duration !== null).length} lesson durations`);
  }

  // Calculate lesson statistics
  const allLessons = course.sections.flatMap((s) => s.lessons);
  const totalLessons = allLessons.length;
  const lessonsWithContent = allLessons.filter((l) => l.content).length;
  const lessonsWithVideo = allLessons.filter((l) => l.wistiaVideoId).length;
  const lessonsWithAttachments = allLessons.filter((l) => l._count.attachments > 0).length;
  const lessonsWithQuiz = allLessons.filter((l) => l.quiz).length;

  const totalDurationSeconds = allLessons
    .filter((l) => !l.isHidden)
    .reduce((acc, lesson) => acc + (lesson.videoDurationSeconds || 0), 0);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getPercentage = (count: number) => {
    if (totalLessons === 0) return 0;
    return Math.round((count / totalLessons) * 100);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 mt-1">
            <Link href={`/admin/courses/${course.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold sm:text-3xl">{course.title}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Manage sections and lessons</p>
          </div>
        </div>

        {totalLessons > 0 && (
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
              <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Content:</span>
              <span className="font-medium">{lessonsWithContent}/{totalLessons}</span>
              <span className="text-muted-foreground">({getPercentage(lessonsWithContent)}%)</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
              <Play className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Video:</span>
              <span className="font-medium">{lessonsWithVideo}/{totalLessons}</span>
              <span className="text-muted-foreground">({getPercentage(lessonsWithVideo)}%)</span>
            </div>
            {totalDurationSeconds > 0 && (
              <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{formatDuration(totalDurationSeconds)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
              <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Attachments:</span>
              <span className="font-medium">{lessonsWithAttachments}/{totalLessons}</span>
              <span className="text-muted-foreground">({getPercentage(lessonsWithAttachments)}%)</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1">
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Quiz:</span>
              <span className="font-medium">{lessonsWithQuiz}/{totalLessons}</span>
              <span className="text-muted-foreground">({getPercentage(lessonsWithQuiz)}%)</span>
            </div>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sections & Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <SectionManager courseId={course.id} sections={course.sections} />
        </CardContent>
      </Card>
    </div>
  );
}
