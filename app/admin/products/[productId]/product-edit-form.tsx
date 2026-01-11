"use client";

import { useActionState } from "react";
import { updateProduct, deleteProduct, type ActionResult } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { ProductFileUploader } from "./product-file-uploader";
import type { DigitalProduct } from "@prisma/client";

interface ProductEditFormProps {
  product: DigitalProduct;
}

const initialState: ActionResult = {
  success: false,
};

export function ProductEditForm({ product }: ProductEditFormProps) {
  const updateProductWithId = updateProduct.bind(null, product.id);
  const [state, formAction, isPending] = useActionState(
    updateProductWithId,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-500">
          Product updated successfully!
        </div>
      )}

      <Input
        name="title"
        label="Product Title"
        defaultValue={product.title}
        required
      />

      <Input
        name="slug"
        label="URL Slug"
        defaultValue={product.slug}
        helperText="Lowercase letters, numbers, and dashes only. Will be used in the URL."
        required
      />

      <Textarea
        name="description"
        label="Description"
        defaultValue={product.description || ""}
        rows={4}
      />

      <Input
        name="vslVideoId"
        label="VSL Wistia Video ID"
        defaultValue={product.vslVideoId || ""}
        helperText="The Wistia video ID for the landing page hero."
      />

      <Input
        name="priceInCents"
        type="number"
        label="Price (in cents)"
        defaultValue={product.priceInCents}
        helperText="Enter price in cents. e.g., 2900 = $29.00"
        required
      />

      <Input
        name="thumbnail"
        type="url"
        label="Thumbnail URL"
        defaultValue={product.thumbnail || ""}
      />

      <ProductFileUploader
        productId={product.id}
        currentFileUrl={product.fileUrl}
      />

      <Textarea
        name="content"
        label="Content (shown after purchase)"
        defaultValue={product.content || ""}
        rows={6}
      />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          name="published"
          defaultChecked={product.published}
          className="h-4 w-4 rounded border-border"
        />
        <label htmlFor="published" className="text-sm">
          Published (visible to customers)
        </label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="accent" isLoading={isPending}>
          Save Changes
        </Button>
        <form
          action={async () => {
            if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
              await deleteProduct(product.id);
            }
          }}
        >
          <Button type="submit" variant="destructive">
            Delete Product
          </Button>
        </form>
      </div>
    </form>
  );
}
