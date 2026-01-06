import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, CheckCircle } from "lucide-react";

interface ProductAccessPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductAccessPage({
  params,
}: ProductAccessPageProps) {
  const { slug } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Find the product
  const product = await db.digitalProduct.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  // Check if user has purchased this product
  const purchase = await db.productPurchase.findFirst({
    where: {
      userId: session.user.id,
      productId: product.id,
    },
  });

  if (!purchase) {
    // Redirect to product page if not purchased
    redirect(`/products/${slug}`);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-500">
              <CheckCircle className="h-4 w-4" />
              Purchased
            </span>
          </div>
          {product.description && (
            <p className="text-muted-foreground mt-1">{product.description}</p>
          )}
        </div>
      </div>

      {/* Download Section */}
      {product.fileUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Download</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="accent" asChild>
              <a href={product.fileUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4" />
                Download File
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content Section */}
      {product.content && (
        <Card>
          <CardHeader>
            <CardTitle>Product Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: product.content }}
                className="whitespace-pre-wrap"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* No content message */}
      {!product.fileUrl && !product.content && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Thank you for your purchase! Content will be available soon.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


