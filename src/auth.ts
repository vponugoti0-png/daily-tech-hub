import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Twitter from "next-auth/providers/twitter";
import type { Provider } from "next-auth/providers";
import { upsertOAuthUser } from "@/lib/auth/users";
import { configuredOAuthProviders } from "@/lib/auth/oauth-providers";
import { getAuthSecret } from "@/lib/auth/secret";

function buildProviders(): Provider[] {
  const providers: Provider[] = [];
  const enabled = new Set(configuredOAuthProviders());

  if (enabled.has("google")) {
    providers.push(
      Google({
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        checks: ["pkce", "state", "nonce"],
      }),
    );
  }

  if (enabled.has("microsoft-entra-id")) {
    providers.push(
      MicrosoftEntraID({
        clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
        clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
        issuer:
          process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER ||
          "https://login.microsoftonline.com/common/v2.0",
        checks: ["pkce", "state", "nonce"],
      }),
    );
  }

  if (enabled.has("twitter")) {
    // X OAuth 2.0 — Auth.js uses PKCE + state by default for OAuth 2 providers.
    providers.push(
      Twitter({
        clientId: process.env.AUTH_TWITTER_ID!,
        clientSecret: process.env.AUTH_TWITTER_SECRET!,
        checks: ["pkce", "state"],
      }),
    );
  }

  return providers;
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    uid?: number;
    email?: string;
    name?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: getAuthSecret(),
  trustHost: true,
  providers: buildProviders(),
  // Shorter OAuth session; re-auth via provider when expired.
  session: { strategy: "jwt", maxAge: 60 * 60 * 8, updateAge: 60 * 30 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Restrict post-login redirects to same origin only.
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {
        /* ignore */
      }
      return `${baseUrl}/dashboard`;
    },
    async signIn({ user, account, profile }) {
      if (!account) return false;
      try {
        const email =
          user.email ||
          (typeof profile?.email === "string" ? profile.email : null);
        const name =
          user.name ||
          (typeof profile?.name === "string" ? profile.name : null);
        const subject = account.providerAccountId;
        if (!subject) return false;

        upsertOAuthUser({
          provider: account.provider,
          subject,
          email,
          name,
        });
        return true;
      } catch (e) {
        console.error("[auth] OAuth upsert failed", e);
        return false;
      }
    },
    async jwt({ token, account, user, profile }) {
      if (account) {
        const email =
          user?.email ||
          token.email ||
          (typeof profile?.email === "string" ? profile.email : undefined);
        const subject = account.providerAccountId;
        const dbUser = upsertOAuthUser({
          provider: account.provider,
          subject,
          email,
          name: user?.name || token.name,
        });
        token.uid = dbUser.id;
        token.email = dbUser.email;
        token.name = dbUser.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        session.user.id = String(token.uid);
        session.user.email = token.email ?? session.user.email;
        session.user.name = token.name ?? session.user.name;
      }
      return session;
    },
  },
});
