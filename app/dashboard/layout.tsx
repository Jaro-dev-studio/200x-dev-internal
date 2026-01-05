import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { BookOpen, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";

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

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-border bg-card overflow-y-auto">
        <div className="flex h-full flex-col">
          <div className="border-b border-border p-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-semibold">200x Courses</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <NavLink href="/dashboard" exact>
              <BookOpen className="h-4 w-4" />
              Courses
            </NavLink>
            <NavLink href="/dashboard/settings">
              <Settings className="h-4 w-4" />
              Settings
            </NavLink>
            {userIsAdmin && (
              <NavLink href="/admin">
                <Settings className="h-4 w-4" />
                Admin Panel
              </NavLink>
            )}
          </nav>

          <div className="border-t border-border p-4">
            <div className="mb-2 text-sm font-medium">{user.name}</div>
            <div className="mb-3 text-sm text-muted-foreground">
              {user.email}
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button
                variant="accent"
                size="sm"
                className="w-full"
                type="submit"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}

