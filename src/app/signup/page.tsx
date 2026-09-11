import { configuredOAuthProviders } from "@/lib/auth/oauth-providers";
import { SignupClient } from "@/components/auth/SignupClient";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return <SignupClient oauthConfigured={configuredOAuthProviders()} />;
}
