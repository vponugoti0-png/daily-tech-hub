const DEV_FALLBACK = "daily-tech-hub-v3-dev-secret-change-me";

/**
 * Returns AUTH_SECRET. In production, refuses to run with a missing or default secret.
 */
export function getAuthSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production") {
    if (!s || s === DEV_FALLBACK) {
      throw new Error(
        "AUTH_SECRET must be set to a strong unique value in production",
      );
    }
    return s;
  }
  return s || DEV_FALLBACK;
}

export { DEV_FALLBACK as AUTH_SECRET_DEV_FALLBACK };
