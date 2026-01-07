import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await db.digitalProduct.findMany({
    include: {
      _count: {
        select: {
          purchases: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Digital Products</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your digital product catalog
          </p>
        </div>
        <Button variant="accent" asChild className="w-full sm:w-auto">
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            New Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="mb-4 text-muted-foreground">No products yet</p>
            <Button variant="accent" asChild>
              <Link href="/admin/products/new">Create your first product</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-lg sm:text-xl">{product.title}</CardTitle>
                    <Badge variant={product.published ? "default" : "secondary"}>
                      {product.published ? (
                        <>
                          <Eye className="mr-1 h-3 w-3" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-1 h-3 w-3" />
                          Draft
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    /{product.slug}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild className="w-full sm:w-auto shrink-0">
                  <Link href={`/admin/products/${product.id}`}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-muted-foreground">
                  <span>
                    <strong className="text-foreground">
                      ${(product.priceInCents / 100).toFixed(2)}
                    </strong>{" "}
                    price
                  </span>
                  <span>
                    <strong className="text-foreground">
                      {product._count.purchases}
                    </strong>{" "}
                    purchases
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
