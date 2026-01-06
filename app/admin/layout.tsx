import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { BookOpen, LayoutDashboard, Settings, LogOut, ArrowLeft, Package, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/ui/nav-link";
import { signOut } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect("/dashboard");
  }

  return (
    <div className="light-mode flex min-h-screen font-sans bg-background text-foreground">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-border bg-card overflow-y-auto">
        <div className="flex h-full flex-col">
          <div className="border-b border-border p-4">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Settings className="h-4 w-4" />
              </div>
              <span className="font-semibold">Admin Panel</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <NavLink href="/admin" exact>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink href="/admin/courses">
              <BookOpen className="h-4 w-4" />
              Courses
            </NavLink>
            <NavLink href="/admin/products">
              <Package className="h-4 w-4" />
              Products
            </NavLink>
            <NavLink href="/admin/users">
              <Users className="h-4 w-4" />
              Users
            </NavLink>
          </nav>

          <div className="border-t border-border p-4">
            <div className="mb-3 text-sm text-muted-foreground">
              {session.user.email}
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
