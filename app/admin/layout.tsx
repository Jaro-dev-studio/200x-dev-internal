import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { AdminWrapper } from "./admin-wrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect("/dashboard");
  }

  const signOutAction = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <AdminWrapper userEmail={session.user.email} signOutAction={signOutAction}>
      {children}
    </AdminWrapper>
  );
}
