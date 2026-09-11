import { configuredOAuthProviders } from "@/lib/auth/oauth-providers";
import { LoginClient } from "@/components/auth/LoginClient";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <LoginClient oauthConfigured={configuredOAuthProviders()} />;
}
