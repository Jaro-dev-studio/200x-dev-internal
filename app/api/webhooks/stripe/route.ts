import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { env } from "@/env/server";
import Stripe from "stripe";

const isDevelopment = process.env.NODE_ENV === "development";

export async function POST(req: NextRequest) {
  console.log("[Stripe Webhook] Received webhook event");

  const body = await req.text();
  let event: Stripe.Event;

  // Skip signature verification in development
  if (isDevelopment) {
    console.log("[Stripe Webhook] Development mode - skipping signature verification");
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch {
      console.error("[Stripe Webhook] Failed to parse webhook body");
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  } else {
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      console.log("[Stripe Webhook] Missing stripe-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    if (!env.STRIPE_WEBHOOK_SECRET) {
      console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    try {
      console.log("[Stripe Webhook] Verifying webhook signature...");
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error("[Stripe Webhook] Signature verification failed:", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  console.log(`[Stripe Webhook] Processing event: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_details?.email;
    const type = session.metadata?.type;
    const courseId = session.metadata?.courseId;
    const productId = session.metadata?.productId;
    const amountPaid = session.amount_total || 0; // Amount paid in cents

    if (!email) {
      console.error("[Stripe Webhook] Missing email in session");
      return NextResponse.json(
        { error: "Missing email" },
        { status: 400 }
      );
    }

    // Check if user already exists with this email
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    // Handle digital product purchase
    if (type === "digital_product" && productId) {
      console.log(
        `[Stripe Webhook] Recording product purchase for ${email}, product: ${productId}`
      );

      // Check if purchase already exists
      const existingPurchase = await db.productPurchase.findFirst({
        where: {
          stripeSessionId: session.id,
        },
      });

      if (existingPurchase) {
        console.log("[Stripe Webhook] Product purchase already recorded");
        return NextResponse.json({ received: true });
      }

      // Create product purchase record
      await db.productPurchase.create({
        data: {
          email,
          stripeSessionId: session.id,
          productId,
          amountPaid,
          userId: existingUser?.id || null,
        },
      });

      console.log("[Stripe Webhook] Product purchase recorded successfully");
      return NextResponse.json({ received: true });
    }

    // Handle course purchase (default behavior for backwards compatibility)
    if (courseId) {
      console.log(
        `[Stripe Webhook] Recording course purchase for ${email}, course: ${courseId}`
      );

      // Check if purchase already exists
      const existingPurchase = await db.coursePurchase.findFirst({
        where: {
          stripeSessionId: session.id,
        },
      });

      if (existingPurchase) {
        console.log("[Stripe Webhook] Course purchase already recorded");
        return NextResponse.json({ received: true });
      }

      // Create course purchase record
      await db.coursePurchase.create({
        data: {
          email,
          stripeSessionId: session.id,
          courseId,
          amountPaid,
          userId: existingUser?.id || null,
        },
      });

      console.log("[Stripe Webhook] Course purchase recorded successfully");
      return NextResponse.json({ received: true });
    }

    console.error("[Stripe Webhook] Missing courseId or productId in session");
    return NextResponse.json(
      { error: "Missing required data" },
      { status: 400 }
    );
  }

  return NextResponse.json({ received: true });
}


