"use client";

import { Suspense } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { login, type AuthActionResult } from "@/lib/actions/auth";
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
import { Skeleton } from "@/components/ui/skeleton";

const initialState: AuthActionResult = {
  success: false,
};

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to access your courses</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

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
          />

          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Your password"
            autoComplete="current-password"
            required
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" variant="accent" className="w-full" isLoading={isPending}>
            Sign in
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

function LoginFormSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Skeleton className="mx-auto h-8 w-32" />
        <Skeleton className="mx-auto mt-2 h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-background">
      <Suspense fallback={<LoginFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
