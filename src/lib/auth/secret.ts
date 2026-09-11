const DEV_FALLBACK = "daily-tech-hub-v3-dev-secret-change-me";

function isProductionBuild(): boolean {
  return (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.npm_lifecycle_event === "build"
  );
}

/**
 * Returns AUTH_SECRET. In production runtime, refuses missing/default secret.
 * During `next build`, allows a temporary fallback so Docker can compile routes
 * that import auth at module load (real secret must still be set at runtime).
 */
export function getAuthSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production" && !isProductionBuild()) {
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
