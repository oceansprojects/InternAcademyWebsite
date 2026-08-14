import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [],

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      if (nextUrl.pathname.startsWith("/student")) {
        return isLoggedIn;
      }

      if (nextUrl.pathname.startsWith("/admin")) {
        return (
          isLoggedIn &&
          (auth?.user.role === "admin" ||
            auth?.user.role === "super_admin")
        );
      }

      return true;
    },

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