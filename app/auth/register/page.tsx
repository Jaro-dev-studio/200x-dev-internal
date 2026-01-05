import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { RegisterForm } from "./register-form";

interface RegisterPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

async function getEmailFromStripeSession(
  sessionId: string
): Promise<string | null> {
  try {
    console.log("[Register] Fetching Stripe session...");
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.customer_details?.email || null;
  } catch (error) {
    console.log("[Register] Failed to fetch Stripe session:", error);
    return null;
  }
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { session_id } = await searchParams;

  let prefilledEmail: string | null = null;
  let isEmailLocked = false;

  // If session_id is provided, fetch email from Stripe
  if (session_id) {
    prefilledEmail = await getEmailFromStripeSession(session_id);
    if (prefilledEmail) {
      isEmailLocked = true;
    } else {
      // Invalid session, redirect to register without prefill
      redirect("/auth/register");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <RegisterForm
        prefilledEmail={prefilledEmail}
        isEmailLocked={isEmailLocked}
      />
    </div>
  );
}

