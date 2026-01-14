"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Package, ShoppingBag, Settings, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  exact?: boolean;
  activePathPrefixes?: string[];
}

interface DashboardWrapperProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
  };
  isAdmin: boolean;
  signOutAction: () => Promise<void>;
}

const navItems: NavItem[] = [
  {
    label: "My Courses",
    href: "/dashboard",
    icon: <BookOpen className="h-4 w-4" />,
    exact: true,
    activePathPrefixes: ["/dashboard/courses"],
  },
  {
    label: "My Products",
    href: "/dashboard/my-products",
    icon: <Package className="h-4 w-4" />,
    activePathPrefixes: ["/dashboard/products"],
  },
  {
    label: "Browse",
    href: "/dashboard/browse",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
];

function NavLink({
  href,
  children,
  exact = false,
  activePathPrefixes = [],
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  activePathPrefixes?: string[];
  onClick?: () => void;
}) {
  const pathname = usePathname();

  const matchesPrefix = activePathPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  const isActive = exact
    ? pathname === href || matchesPrefix
    : pathname === href || pathname.startsWith(href + "/") || matchesPrefix;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-accent/10 text-accent font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export function DashboardWrapper({
  children,
  user,
  isAdmin,
  signOutAction,
}: DashboardWrapperProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Close mobile menu on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const sidebarContent = (
    <>
      <div className="border-b border-border p-4">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={closeMobileMenu}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-semibold">200x Courses</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            exact={item.exact}
            activePathPrefixes={item.activePathPrefixes}
            onClick={closeMobileMenu}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 p-4 pt-0">
        <NavLink href="/dashboard/settings" onClick={closeMobileMenu}>
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
        {isAdmin && (
          <NavLink href="/admin" onClick={closeMobileMenu}>
            <Settings className="h-4 w-4" />
            Admin Panel
          </NavLink>
        )}
      </div>

      <div className="border-t border-border p-4">
        <div className="mb-2 text-sm font-medium">{user.name}</div>
        <div className="mb-3 text-sm text-muted-foreground">{user.email}</div>
        <form action={signOutAction}>
          <Button variant="accent" size="sm" className="w-full" type="submit">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>
    </>
  );

  return (
    <div className="light-mode flex min-h-screen flex-col font-sans bg-background text-foreground md:flex-row">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-semibold">200x Courses</span>
        </Link>
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </header>

      {/* Mobile Sidebar Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Sidebar Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <span className="text-lg font-semibold">Menu</span>
          <button
            type="button"
            onClick={closeMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex h-full flex-col overflow-y-auto">{sidebarContent}</div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card overflow-y-auto md:flex">
        <div className="flex h-full flex-col">{sidebarContent}</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl px-4 py-4 md:px-8 md:py-8">{children}</div>
      </main>
    </div>
  );
}
