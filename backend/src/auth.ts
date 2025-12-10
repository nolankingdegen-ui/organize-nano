import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "./env";
import { db } from "./db";
console.log("🔐 [Auth] Initializing Better Auth...");
export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "sqlite",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BACKEND_URL,
  plugins: [expo()],
  trustedOrigins: [
    "vibecode://",
    "http://localhost:3000",
    env.BACKEND_URL,
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
    },
  },
});
console.log("✅ [Auth] Better Auth initialized");
console.log("🔗 [Auth] Base URL:", env.BACKEND_URL);
