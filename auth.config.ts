import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // AUTH_URL is set in .env — trustHost is still needed for Vercel/proxy environments
  // where X-Forwarded-Host headers are present.
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

        const dbUser = await getOrCreateGoogleUser({
          name: user.name ?? "Google User",
          email: user.email,
          avatarUrl: user.image ?? null,
          oauthId: account.providerAccountId,
        });

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