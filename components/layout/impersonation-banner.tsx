import { auth } from "@/auth";

export async function ImpersonationBanner() {
  const session = await auth();

  if (!session?.user?.isImpersonated) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-accent text-accent-foreground py-2 px-4 text-center text-sm font-medium">
      Signed in as {session.user.name || session.user.email}
    </div>
  );
}
