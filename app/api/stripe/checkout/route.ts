import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { z } from "zod";

const checkoutSchema = z.object({
  courseId: z.string().min(1),
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

    const { courseId } = validatedData.data;

    // Fetch the course
    console.log("[Stripe Checkout] Fetching course data...");
    const course = await db.course.findUnique({
      where: { id: courseId, published: true },
    });

    if (!course) {
      console.log("[Stripe Checkout] Course not found or not published");
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    console.log("[Stripe Checkout] Creating Stripe checkout session...");
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
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
      },
      success_url: `${appUrl}/auth/register?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/courses/${course.id}`,
    });

    console.log("[Stripe Checkout] Checkout session created successfully");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Stripe Checkout] Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}


