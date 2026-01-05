import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  console.log("[Stripe Webhook] Received webhook event");

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.log("[Stripe Webhook] Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    console.log("[Stripe Webhook] Verifying webhook signature...");
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[Stripe Webhook] Signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Processing event: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_details?.email;
    const courseId = session.metadata?.courseId;

    if (!email || !courseId) {
      console.error("[Stripe Webhook] Missing email or courseId in session");
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    console.log(
      `[Stripe Webhook] Recording purchase for ${email}, course: ${courseId}`
    );

    // Check if purchase already exists
    const existingPurchase = await db.purchase.findFirst({
      where: {
        stripeSessionId: session.id,
      },
    });

    if (existingPurchase) {
      console.log("[Stripe Webhook] Purchase already recorded");
      return NextResponse.json({ received: true });
    }

    // Check if user already exists with this email
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    // Create purchase record
    await db.purchase.create({
      data: {
        email,
        stripeSessionId: session.id,
        courseId,
        userId: existingUser?.id || null,
      },
    });

    console.log("[Stripe Webhook] Purchase recorded successfully");
  }

  return NextResponse.json({ received: true });
}

