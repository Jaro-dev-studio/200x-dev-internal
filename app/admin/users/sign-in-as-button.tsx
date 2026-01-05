"use client";

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { signInAs } from "@/lib/actions/auth";
import { useTransition } from "react";

interface SignInAsButtonProps {
  userId: string;
}

export function SignInAsButton({ userId }: SignInAsButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await signInAs(userId);
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      <LogIn className="h-4 w-4" />
      {isPending ? "Signing in..." : "Sign in as"}
    </Button>
  );
}

