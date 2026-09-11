import { configuredOAuthProviders } from "@/lib/auth/oauth-providers";
import { LoginClient } from "@/components/auth/LoginClient";

export default function LoginPage() {
  return <LoginClient oauthConfigured={configuredOAuthProviders()} />;
}
