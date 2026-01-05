import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="flex-1">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-5 w-96" />
        </div>
        <Skeleton className="h-7 w-32" />
      </div>

      {/* Progress bar */}
      <Skeleton className="h-3 w-full rounded-full" />

      {/* Sections */}
      <div className="space-y-6">
        {[1, 2, 3].map((sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="flex items-center gap-4 rounded-lg border border-border p-4"
                  >
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-48" />
                      <div className="flex gap-2 mt-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-14" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

