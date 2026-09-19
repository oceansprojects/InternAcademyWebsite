import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // Explicitly define basePath so Auth.js always routes to /api/auth regardless of AUTH_URL format
  basePath: "/api/auth",
  trustHost: true,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    // Note: admin login is at /admin/login and is handled separately via middleware.
  },

  providers: [],

  callbacks: {

    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user?.email) {
        const { getOrCreateGoogleUser } = await import("@/services/auth.service");

        let requestedRole = "student";
        try {
          const { cookies } = await import("next/headers");
          const cookieStore = await cookies();
          const callbackUrl =
            cookieStore.get("__Secure-authjs.callback-url")?.value ||
            cookieStore.get("authjs.callback-url")?.value ||
            cookieStore.get("__Secure-next-auth.callback-url")?.value ||
            cookieStore.get("next-auth.callback-url")?.value ||
            "";
          if (callbackUrl.includes("/company")) {
            requestedRole = "company";
          }
        } catch {
          // Ignore when headers are unavailable
        }

        const dbUser = await getOrCreateGoogleUser({
          name: user.name ?? "Google User",
          email: user.email,
          avatarUrl: user.image ?? null,
          oauthId: account.providerAccountId,
          role: requestedRole,
        });

        if (dbUser.role === "company") {
          const { ensureCompanyForUser } = await import("@/services/company-auth.service");
          await ensureCompanyForUser(
            dbUser.id,
            dbUser.name ? `${dbUser.name}'s Company` : "My Company",
            dbUser.email
          );
        }

        token.id = dbUser.id;
        token.role = dbUser.role;

        return token;
      }

      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;