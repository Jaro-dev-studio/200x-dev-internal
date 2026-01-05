import { auth } from "@/auth";
import { ProductsClient } from "./client";

export default async function ProductsPage() {
  const session = await auth();
  const isSignedIn = !!session?.user?.id;

  return <ProductsClient isSignedIn={isSignedIn} />;
}
