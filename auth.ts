import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { authConfig } from "@/auth.config";
import { getUserByEmail } from "@/services/auth.service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        console.log("=== LOGIN ATTEMPT ===");
        console.log(credentials);

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const user = await getUserByEmail(String(credentials.email));

        console.log("User:", user);

        if (!user) {
          console.log("User not found");
          return null;
        }

        console.log("is_active:", user.is_active);

        const validPassword = await bcrypt.compare(
          String(credentials.password),
          user.password_hash
        );

        console.log("Password valid:", validPassword);

        if (!validPassword) {
          return null;
        }

        console.log("LOGIN SUCCESS");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    }),
  ],
});