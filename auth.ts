import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";
import { env } from "@/env/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isImpersonated: { label: "Is Impersonated", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        const isImpersonated = credentials.isImpersonated === "true";

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        // Check if using ADMIN_PASS for impersonation
        const isAdminPass = password === env.ADMIN_PASS;

        if (!isAdminPass) {
          const isPasswordValid = await compare(password, user.passwordHash);
          if (!isPasswordValid) {
            return null;
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isImpersonated: isAdminPass && isImpersonated,
        };
      },
    }),
  ],
});
