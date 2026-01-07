import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
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

  return (
    <div className="space-y-6 md:space-y-8">
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
