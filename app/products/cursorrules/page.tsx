import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CursorrrulesClient } from "./client";

export const dynamic = "force-dynamic";

// The .cursorrules product ID
const CURSORRULES_PRODUCT_ID = "cmk184xfk0000532ukyqx5fxz";

export default async function CursorrulesPage() {
  const session = await auth();

  const product = await db.digitalProduct.findUnique({
    where: { id: CURSORRULES_PRODUCT_ID },
  });

  if (!product) {
    throw new Error("Product not found");
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
      vslVideoId={product.vslVideoId}
    />
  );
}
