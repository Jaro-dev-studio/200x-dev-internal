"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createProduct, type ActionResult } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const initialState: ActionResult = {
  success: false,
};

export default function NewProductPage() {
  const [state, formAction, isPending] = useActionState(
    createProduct,
    initialState
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Digital Product</h1>
          <p className="text-muted-foreground">
            Set up a new digital product for sale
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {state.error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <Input
              name="title"
              label="Product Title"
              placeholder="e.g., Ultimate Cursor Rules File"
              required
            />

            <Input
              name="slug"
              label="URL Slug"
              placeholder="e.g., cursorrules"
              helperText="Lowercase letters, numbers, and dashes only. Will be used in the URL."
              required
            />

            <Textarea
              name="description"
              label="Description"
              placeholder="What does this product include?"
              rows={4}
            />

            <Input
              name="priceInCents"
              type="number"
              label="Price (in cents)"
              placeholder="2900"
              defaultValue="0"
              helperText="Enter price in cents. e.g., 2900 = $29.00"
              required
            />

            <Input
              name="thumbnail"
              type="url"
              label="Thumbnail URL"
              placeholder="https://example.com/image.jpg"
            />

            <Input
              name="fileUrl"
              type="url"
              label="File Download URL"
              placeholder="https://example.com/file.zip"
              helperText="URL to the downloadable file (optional)"
            />

            <Textarea
              name="content"
              label="Content (shown after purchase)"
              placeholder="Content to display to customers after purchase..."
              rows={6}
            />

            <div className="flex gap-4">
              <Button type="submit" variant="accent" isLoading={isPending}>
                Create Product
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/products">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

