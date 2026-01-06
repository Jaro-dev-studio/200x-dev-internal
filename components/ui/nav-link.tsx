"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  className?: string;
  /** Additional path prefixes that should trigger active state */
  activePathPrefixes?: string[];
}

export function NavLink({ href, children, exact = false, className, activePathPrefixes = [] }: NavLinkProps) {
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
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-accent/10 text-accent font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
}
