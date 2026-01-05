import Stripe from "stripe";
import { env } from "@/env/server";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backwards compatibility - use getStripe() in server actions
export const stripe = {
  get checkout() {
    return getStripe().checkout;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

