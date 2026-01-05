import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isImpersonated?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    isImpersonated?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isImpersonated?: boolean;
  }
}


