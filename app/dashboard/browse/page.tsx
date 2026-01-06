import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Package, Play, CheckCircle } from "lucide-react";
import { BrowseBuyButton } from "./buy-button";

export default async function BrowsePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Fetch all published courses and products
  const [courses, products, purchasedCourses, purchasedProducts] = await Promise.all([
    db.course.findMany({
      where: { published: true },
      include: {
        sections: {
          include: {
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.digitalProduct.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }),
    db.coursePurchase.findMany({
      where: { userId: session.user.id },
      select: { courseId: true },
    }),
    db.productPurchase.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    }),
  ]);

  const purchasedCourseIds = new Set(purchasedCourses.map((p) => p.courseId));
  const purchasedProductIds = new Set(purchasedProducts.map((p) => p.productId));

  const hasNoCourses = courses.length === 0;
  const hasNoProducts = products.length === 0;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold">Browse</h1>
        <p className="text-muted-foreground">
          Explore and purchase courses and digital products
        </p>
      </div>

      {/* Courses Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Courses</h2>
        </div>

        {hasNoCourses ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">No courses available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const isPurchased = purchasedCourseIds.has(course.id);
              const totalLessons = course.sections.reduce(
                (sum, section) => sum + section._count.lessons,
                0
              );

              return (
                <Card key={course.id} className="overflow-hidden flex flex-col">
                  {course.thumbnail && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      {isPurchased && (
                        <Badge className="bg-green-500 shrink-0">Owned</Badge>
                      )}
                    </div>
                    {course.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    <div className="flex gap-4 text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {course.sections.length} sections
                      </span>
                      <span className="flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        {totalLessons} lessons
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {course.priceInCents === 0
                          ? "Free"
                          : `$${(course.priceInCents / 100).toFixed(2)}`}
                      </span>
                      {isPurchased ? (
                        <Button variant="outline" asChild>
                          <Link href={`/dashboard/courses/${course.id}`}>
                            <CheckCircle className="h-4 w-4" />
                            Access
                          </Link>
                        </Button>
                      ) : (
                        <BrowseBuyButton
                          type="course"
                          id={course.id}
                          email={session.user.email!}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Products Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Digital Products</h2>
        </div>

        {hasNoProducts ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">No products available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const isPurchased = purchasedProductIds.has(product.id);

              return (
                <Card key={product.id} className="overflow-hidden flex flex-col">
                  {product.thumbnail && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{product.title}</CardTitle>
                      {isPurchased && (
                        <Badge className="bg-green-500 shrink-0">Owned</Badge>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {product.priceInCents === 0
                          ? "Free"
                          : `$${(product.priceInCents / 100).toFixed(2)}`}
                      </span>
                      {isPurchased ? (
                        <Button variant="outline" asChild>
                          <Link href={`/dashboard/products/${product.slug}`}>
                            <CheckCircle className="h-4 w-4" />
                            Access
                          </Link>
                        </Button>
                      ) : (
                        <BrowseBuyButton
                          type="product"
                          id={product.id}
                          email={session.user.email!}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}


