import { configuredOAuthProviders } from "@/lib/auth/oauth-providers";
import { SignupClient } from "@/components/auth/SignupClient";

export default function SignupPage() {
  return <SignupClient oauthConfigured={configuredOAuthProviders()} />;
}
