"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
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

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function grantProductAccess(
  userId: string,
  productId: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log(`[User] Granting product access: user ${userId}, product ${productId}`);

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const stripeSessionId = `admin_grant_${userId}_${productId}_${Date.now()}`;

    await db.productPurchase.create({
      data: {
        userId,
        productId,
        email: user.email,
        stripeSessionId,
        amountPaid: 0,
      },
    });

    console.log("[User] Product access granted successfully");
    revalidatePath("/admin/users");
    return { success: true, message: "Product access granted" };
  } catch (error) {
    console.error("[User] Error granting product access:", error);
    return { success: false, error: "Failed to grant product access" };
  }
}

export async function revokeProductAccess(
  userId: string,
  productId: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log(`[User] Revoking product access: user ${userId}, product ${productId}`);

    await db.productPurchase.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    console.log("[User] Product access revoked successfully");
    revalidatePath("/admin/users");
    return { success: true, message: "Product access revoked" };
  } catch (error) {
    console.error("[User] Error revoking product access:", error);
    return { success: false, error: "Failed to revoke product access" };
  }
}

export async function grantCourseAccess(
  userId: string,
  courseId: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log(`[User] Granting course access: user ${userId}, course ${courseId}`);

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const stripeSessionId = `admin_grant_${userId}_${courseId}_${Date.now()}`;

    await db.coursePurchase.create({
      data: {
        userId,
        courseId,
        email: user.email,
        stripeSessionId,
        amountPaid: 0,
      },
    });

    console.log("[User] Course access granted successfully");
    revalidatePath("/admin/users");
    return { success: true, message: "Course access granted" };
  } catch (error) {
    console.error("[User] Error granting course access:", error);
    return { success: false, error: "Failed to grant course access" };
  }
}

export async function revokeCourseAccess(
  userId: string,
  courseId: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    console.log(`[User] Revoking course access: user ${userId}, course ${courseId}`);

    await db.coursePurchase.deleteMany({
      where: {
        userId,
        courseId,
      },
    });

    console.log("[User] Course access revoked successfully");
    revalidatePath("/admin/users");
    return { success: true, message: "Course access revoked" };
  } catch (error) {
    console.error("[User] Error revoking course access:", error);
    return { success: false, error: "Failed to revoke course access" };
  }
}
