"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateName, updatePassword, type ActionResult } from "@/lib/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SettingsFormProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

const initialState: ActionResult = {
  success: false,
};

export function SettingsForm({ user }: SettingsFormProps) {
  const [nameState, nameAction, isNamePending] = useActionState(updateName, initialState);
  const [passwordState, passwordAction, isPasswordPending] = useActionState(updatePassword, initialState);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  // Reset password form after successful update
  useEffect(() => {
    if (passwordState.success && passwordFormRef.current) {
      passwordFormRef.current.reset();
    }
  }, [passwordState.success]);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={nameAction} className="space-y-4">
            {nameState.error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {nameState.error}
              </div>
            )}
            {nameState.success && nameState.message && (
              <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-500">
                {nameState.message}
              </div>
            )}

            <Input
              key={user.name}
              name="name"
              label="Name"
              defaultValue={user.name || ""}
              placeholder="Your name"
              required
            />

            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Email:</span> {user.email}
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="accent" isLoading={isNamePending}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={passwordFormRef} action={passwordAction} className="space-y-4">
            {passwordState.error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {passwordState.error}
              </div>
            )}
            {passwordState.success && passwordState.message && (
              <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-500">
                {passwordState.message}
              </div>
            )}

            <Input
              name="currentPassword"
              type="password"
              label="Current Password"
              placeholder="Enter your current password"
              required
            />

            <Input
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter new password"
              helperText="Must be at least 8 characters"
              required
            />

            <Input
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              required
            />

            <div className="flex justify-end">
              <Button type="submit" variant="accent" isLoading={isPasswordPending}>
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
