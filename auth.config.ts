import type { NextAuthConfig } from "next-auth";

// Auth configuration without database dependencies
// This can be used in Edge Runtime (middleware)
export const authConfig = {
  providers: [], // Providers will be added in auth.ts
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;


