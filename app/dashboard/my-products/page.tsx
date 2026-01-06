import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Download, ExternalLink, CheckCircle } from "lucide-react";

export default async function MyProductsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Get user's purchased products
  const productPurchases = await db.productPurchase.findMany({
    where: { userId: session.user.id },
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Products</h1>
        <p className="text-muted-foreground">
          Access your purchased digital products
        </p>
      </div>

      {productPurchases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-4 text-lg text-muted-foreground">
              You haven&apos;t purchased any products yet
            </p>
            <Button variant="accent" asChild>
              <Link href="/dashboard/browse">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {productPurchases.map(({ product, createdAt }) => (
            <Card key={product.id} className="overflow-hidden">
              {product.thumbnail && (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                  <Badge className="bg-green-500">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Purchased
                  </Badge>
                </div>
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Purchased on {new Date(createdAt).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="accent" asChild className="flex-1">
                    <Link href={`/dashboard/products/${product.slug}`}>
                      <ExternalLink className="h-4 w-4" />
                      Access Product
                    </Link>
                  </Button>
                  {product.fileUrl && (
                    <Button variant="outline" asChild>
                      <a href={product.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
