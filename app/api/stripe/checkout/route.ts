import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { env } from "@/env/client";
import { z } from "zod";

const checkoutSchema = z.object({
  courseId: z.string().optional(),
  productId: z.string().optional(),
  email: z.string().email().optional(), // Pre-fill customer email if logged in
}).refine((data) => data.courseId || data.productId, {
  message: "Either courseId or productId is required",
});

export async function POST(req: NextRequest) {
  try {
    console.log("[Stripe Checkout] Starting checkout session creation...");

    const body = await req.json();
    const validatedData = checkoutSchema.safeParse(body);

    if (!validatedData.success) {
      console.log("[Stripe Checkout] Invalid request body");
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { courseId, productId, email } = validatedData.data;
    const appUrl = env.NEXT_PUBLIC_APP_URL;

    // Determine success URL based on whether user is logged in (email provided)
    const successUrl = email
      ? `${appUrl}/dashboard?purchase=success`
      : `${appUrl}/auth/register?session_id={CHECKOUT_SESSION_ID}`;

    // Handle digital product checkout
    if (productId) {
      console.log("[Stripe Checkout] Fetching digital product data...");
      const product = await db.digitalProduct.findUnique({
        where: { id: productId, published: true },
      });

      if (!product) {
        console.log("[Stripe Checkout] Digital product not found or not published");
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      console.log("[Stripe Checkout] Creating Stripe checkout session for digital product...");
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: email || undefined, // Pre-fill email if provided
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: product.title,
                description: product.description || undefined,
                images: product.thumbnail ? [product.thumbnail] : undefined,
              },
              unit_amount: product.priceInCents,
            },
            quantity: 1,
          },
        ],
        metadata: {
          productId: product.id,
          type: "digital_product",
        },
        success_url: successUrl,
        cancel_url: `${appUrl}/products/${product.slug}`,
      });

      console.log("[Stripe Checkout] Checkout session created successfully for digital product");
      return NextResponse.json({ url: session.url });
    }

    // Handle course checkout
    if (courseId) {
      console.log("[Stripe Checkout] Fetching course data...");
      const course = await db.course.findUnique({
        where: { id: courseId, published: true },
      });

      if (!course) {
        console.log("[Stripe Checkout] Course not found or not published");
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
      }

      console.log("[Stripe Checkout] Creating Stripe checkout session for course...");
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: email || undefined, // Pre-fill email if provided
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: course.title,
                description: course.description || undefined,
                images: course.thumbnail ? [course.thumbnail] : undefined,
              },
              unit_amount: course.priceInCents,
            },
            quantity: 1,
          },
        ],
        metadata: {
          courseId: course.id,
          type: "course",
        },
        success_url: successUrl,
        cancel_url: `${appUrl}/products/${course.slug}`,
      });

      console.log("[Stripe Checkout] Checkout session created successfully for course");
      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Stripe Checkout] Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}


