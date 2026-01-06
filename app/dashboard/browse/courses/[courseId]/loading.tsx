import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseLandingLoading() {
  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Hero Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Skeleton className="mb-4 h-6 w-24" />
          <Skeleton className="mb-4 h-9 w-3/4" />
          <Skeleton className="mb-2 h-5 w-full" />
          <Skeleton className="mb-6 h-5 w-2/3" />

          <div className="mb-6 flex gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>

        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>

      {/* Curriculum */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="mt-1 h-3 w-20" />
                      </div>
                      <Skeleton className="h-4 w-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
