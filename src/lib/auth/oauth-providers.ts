export type OAuthProviderId = "google" | "microsoft-entra-id" | "twitter";

/** Providers that have both client id + secret configured in env. */
export function configuredOAuthProviders(): OAuthProviderId[] {
  const out: OAuthProviderId[] = [];
  if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    out.push("google");
  }
  if (
    process.env.AUTH_MICROSOFT_ENTRA_ID_ID &&
    process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET
  ) {
    out.push("microsoft-entra-id");
  }
  if (process.env.AUTH_TWITTER_ID && process.env.AUTH_TWITTER_SECRET) {
    out.push("twitter");
  }
  return out;
}

export function oauthConfigured(id: OAuthProviderId): boolean {
  return configuredOAuthProviders().includes(id);
}
