"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { hash, compare } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateNameSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
});

export interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function updateName(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  console.log("[User] Starting name update...");

  const session = await auth();
  if (!session?.user?.id) {
    console.log("[User] No authenticated user found");
    return { success: false, error: "You must be logged in to update your name" };
  }

  const rawData = {
    name: formData.get("name"),
  };

  const validatedFields = updateNameSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log("[User] Name validation failed");
    return {
      success: false,
      error: validatedFields.error.issues[0].message,
    };
  }

  const { name } = validatedFields.data;

  try {
    console.log("[User] Updating user name in database...");
    await db.user.update({
      where: { id: session.user.id },
      data: { name },
    });

    console.log("[User] Name updated successfully");
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    
    return { success: true, message: "Name updated successfully" };
  } catch (error) {
    console.log("[User] Failed to update name:", error);
    return { success: false, error: "Failed to update name. Please try again." };
  }
}

export async function updatePassword(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  console.log("[User] Starting password update...");

  const session = await auth();
  if (!session?.user?.id) {
    console.log("[User] No authenticated user found");
    return { success: false, error: "You must be logged in to update your password" };
  }

  const rawData = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validatedFields = updatePasswordSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log("[User] Password validation failed");
    return {
      success: false,
      error: validatedFields.error.issues[0].message,
    };
  }

  const { currentPassword, newPassword, confirmPassword } = validatedFields.data;

  if (newPassword !== confirmPassword) {
    console.log("[User] Passwords do not match");
    return { success: false, error: "New passwords do not match" };
  }

  try {
    console.log("[User] Fetching user from database...");
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    if (!user?.passwordHash) {
      console.log("[User] User has no password (OAuth account)");
      return { success: false, error: "Cannot change password for OAuth accounts" };
    }

    console.log("[User] Verifying current password...");
    const isValid = await compare(currentPassword, user.passwordHash);

    if (!isValid) {
      console.log("[User] Current password is incorrect");
      return { success: false, error: "Current password is incorrect" };
    }

    console.log("[User] Hashing new password...");
    const newPasswordHash = await hash(newPassword, 12);

    console.log("[User] Updating password in database...");
    await db.user.update({
      where: { id: session.user.id },
      data: { passwordHash: newPasswordHash },
    });

    console.log("[User] Password updated successfully");
    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    console.log("[User] Failed to update password:", error);
    return { success: false, error: "Failed to update password. Please try again." };
  }
}
