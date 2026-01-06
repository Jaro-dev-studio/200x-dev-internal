"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register, type AuthActionResult } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RegisterFormProps {
  prefilledEmail: string | null;
  isEmailLocked: boolean;
}

const initialState: AuthActionResult = {
  success: false,
};

export function RegisterForm({
  prefilledEmail,
  isEmailLocked,
}: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          {isEmailLocked
            ? "Complete your registration to access your purchased course"
            : "Sign up to access courses"}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {state.error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            defaultValue={prefilledEmail || ""}
            disabled={isEmailLocked}
            className={isEmailLocked ? "bg-muted cursor-not-allowed" : ""}
          />

          {isEmailLocked && (
            <p className="text-xs text-muted-foreground">
              This email is linked to your purchase and cannot be changed.
            </p>
          )}

          <Input
            name="name"
            type="text"
            label="Name"
            placeholder="Your name"
            autoComplete="name"
            required
          />

          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Create a password"
            autoComplete="new-password"
            required
            helperText="Must be at least 8 characters"
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" variant="accent" className="w-full" isLoading={isPending}>
            Create account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
