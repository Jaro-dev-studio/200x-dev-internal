import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CursorrrulesClient } from "./client";

export const dynamic = "force-dynamic";

export default async function CursorrulesPage() {
  const session = await auth();

  // First, ensure the product exists or create it
  let product = await db.digitalProduct.findUnique({
    where: { slug: "cursorrules" },
  });

  // If product doesn't exist, create it
  if (!product) {
    product = await db.digitalProduct.create({
      data: {
        slug: "cursorrules",
        title: "The Battle-Tested .cursorrules File",
        description: "The ultimate .cursorrules file, by an OpenAI Engineering Manager. 50+ production apps. Every edge case already solved.",
        priceInCents: 4900,
        published: true,
      },
    });
  }

  // Check if user has purchased this product
  let hasPurchased = false;
  if (session?.user?.id) {
    const purchase = await db.productPurchase.findFirst({
      where: {
        userId: session.user.id,
        productId: product.id,
      },
    });
    hasPurchased = !!purchase;
  }

  return (
    <CursorrrulesClient
      productId={product.id}
      priceInCents={product.priceInCents}
      hasPurchased={hasPurchased}
      isLoggedIn={!!session?.user}
    />
  );
}
