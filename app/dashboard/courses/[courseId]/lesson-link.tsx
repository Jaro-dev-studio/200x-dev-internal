"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface LessonLinkProps {
  href: string;
  isLocked: boolean;
  children: ReactNode;
}

export function LessonLink({ href, isLocked, children }: LessonLinkProps) {
  if (isLocked) {
    return (
      <div className="flex items-center gap-3 rounded-lg p-3 cursor-not-allowed opacity-50">
        {children}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
    >
      {children}
    </Link>
  );
}



