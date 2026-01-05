"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with dashes only"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
  priceInCents: z.coerce.number().min(0, "Price must be positive"),
  published: z.coerce.boolean().optional(),
  fileUrl: z.string().url().optional().or(z.literal("")),
  content: z.string().optional(),
});

export interface ActionResult {
  success: boolean;
  error?: string;
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    throw new Error("Unauthorized");
  }
  return session;
}

// ============================================================================
// DIGITAL PRODUCTS
// ============================================================================

export async function createProduct(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Products] Creating new product...");

    const rawData = {
      slug: formData.get("slug"),
      title: formData.get("title"),
      description: formData.get("description"),
      thumbnail: formData.get("thumbnail"),
      priceInCents: formData.get("priceInCents"),
      fileUrl: formData.get("fileUrl"),
      content: formData.get("content"),
    };

    const validatedData = productSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    const product = await db.digitalProduct.create({
      data: {
        slug: validatedData.data.slug,
        title: validatedData.data.title,
        description: validatedData.data.description || null,
        thumbnail: validatedData.data.thumbnail || null,
        priceInCents: validatedData.data.priceInCents,
        fileUrl: validatedData.data.fileUrl || null,
        content: validatedData.data.content || null,
      },
    });

    console.log("[Products] Product created successfully:", product.id);
    revalidatePath("/admin/products");
    redirect(`/admin/products/${product.id}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("[Products] Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(
  productId: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Products] Updating product:", productId);

    const rawData = {
      slug: formData.get("slug"),
      title: formData.get("title"),
      description: formData.get("description"),
      thumbnail: formData.get("thumbnail"),
      priceInCents: formData.get("priceInCents"),
      published: formData.get("published") === "on",
      fileUrl: formData.get("fileUrl"),
      content: formData.get("content"),
    };

    const validatedData = productSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    await db.digitalProduct.update({
      where: { id: productId },
      data: {
        slug: validatedData.data.slug,
        title: validatedData.data.title,
        description: validatedData.data.description || null,
        thumbnail: validatedData.data.thumbnail || null,
        priceInCents: validatedData.data.priceInCents,
        published: validatedData.data.published,
        fileUrl: validatedData.data.fileUrl || null,
        content: validatedData.data.content || null,
      },
    });

    console.log("[Products] Product updated successfully");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("[Products] Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log("[Products] Deleting product:", productId);

    await db.digitalProduct.delete({
      where: { id: productId },
    });

    console.log("[Products] Product deleted successfully");
    revalidatePath("/admin/products");
    redirect("/admin/products");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("[Products] Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
