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
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/courses/${course.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">Manage sections and lessons</p>
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
