import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { DashboardWrapper } from "./dashboard-wrapper";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  // Fetch fresh user data from database
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  if (!user) {
    redirect("/auth/login");
  }

  const userIsAdmin = isAdmin(user.email);

  const signOutAction = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <DashboardWrapper
      user={user}
      isAdmin={userIsAdmin}
      signOutAction={signOutAction}
    >
      {children}
    </DashboardWrapper>
  );
}
