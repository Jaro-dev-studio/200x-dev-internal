import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, ShoppingCart } from "lucide-react";
import { ProductEditForm } from "./product-edit-form";

interface ProductEditPageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { productId } = await params;

  const product = await db.digitalProduct.findUnique({
    where: { id: productId },
    include: {
      purchases: {
        select: { amountPaid: true },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const purchaseCount = product.purchases.length;
  const totalRevenue = product.purchases.reduce((sum, p) => sum + p.amountPaid, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-muted-foreground">Edit product details</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Product Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductEditForm product={product} />
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <ShoppingCart className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{purchaseCount} Purchases</p>
                <p className="text-sm text-muted-foreground">
                  ${(totalRevenue / 100).toFixed(2)} revenue
                </p>
              </div>
            </div>
            {product.published && (
              <Button variant="outline" asChild className="w-full">
                <Link href={`/products/${product.slug}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  View Product Page
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

