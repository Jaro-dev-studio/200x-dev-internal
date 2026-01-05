import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseLoading() {
  return (
    <div className="space-y-12">
      <div>
        <Skeleton className="h-9 w-32" />
        <Skeleton className="mt-2 h-5 w-72" />
      </div>

      {/* Courses Section */}
      <section className="space-y-6">
        <Skeleton className="h-6 w-24" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden flex flex-col">
              <Skeleton className="aspect-video w-full" />
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="space-y-6">
        <Skeleton className="h-6 w-36" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden flex flex-col">
              <Skeleton className="aspect-video w-full" />
              <CardHeader className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

