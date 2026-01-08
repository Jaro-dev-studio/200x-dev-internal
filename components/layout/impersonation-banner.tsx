import { auth } from "@/auth";
import { ImpersonationBannerClient } from "./impersonation-banner-client";

export async function ImpersonationBanner() {
  const session = await auth();

  if (!session?.user?.isImpersonated) {
    return null;
  }

  return (
    <ImpersonationBannerClient 
      userName={session.user.name || session.user.email || "Unknown User"} 
    />
  );
}
