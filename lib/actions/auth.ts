"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AuthError } from "next-auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

export async function login(
  _prevState: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  console.log("[Auth] Starting login process...");

  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validatedFields = loginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log("[Auth] Login validation failed");
    return {
      success: false,
      error: validatedFields.error.issues[0].message,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    console.log("[Auth] Attempting to sign in user...");
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("[Auth] Login successful");
  } catch (error) {
    if (error instanceof AuthError) {
      console.log("[Auth] Login failed - invalid credentials");
      return {
        success: false,
        error: "Invalid email or password",
      };
    }
    throw error;
  }

  // Get callback URL from form data or default to dashboard
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";
  redirect(callbackUrl);
}

export async function register(
  _prevState: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  console.log("[Auth] Starting registration process...");

  const rawData = {
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
  };

  const validatedFields = registerSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.log("[Auth] Registration validation failed");
    return {
      success: false,
      error: validatedFields.error.issues[0].message,
    };
  }

  const { email, name, password } = validatedFields.data;

  // Check if user already exists
  console.log("[Auth] Checking if user already exists...");
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("[Auth] User already exists with this email");
    return {
      success: false,
      error: "An account with this email already exists. Please login instead.",
    };
  }

  // Hash password and create user
  console.log("[Auth] Creating new user account...");
  const passwordHash = await hash(password, 12);

  const user = await db.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });

  // Link any existing purchases with this email to the new user
  console.log("[Auth] Linking existing purchases to user...");
  await db.purchase.updateMany({
    where: {
      email,
      userId: null,
    },
    data: {
      userId: user.id,
    },
  });

  console.log("[Auth] Registration successful, signing in...");

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // Shouldn't happen since we just created the user
      console.log("[Auth] Auto-login failed after registration");
      return {
        success: false,
        error: "Account created but login failed. Please login manually.",
      };
    }
    throw error;
  }

  redirect("/dashboard");
}

