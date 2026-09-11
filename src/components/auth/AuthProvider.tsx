"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { mergeServerProgress, pushLocalProgressToServer } from "@/lib/progress";
import { authedFetch } from "@/lib/auth/client";

export type AuthUser = { id: number; email: string; name: string };

type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const epoch = useRef(0);

  const refresh = useCallback(async () => {
    const myEpoch = ++epoch.current;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", { credentials: "same-origin" });
      const data = (await res.json()) as {
        user: AuthUser | null;
        progress?: Array<{
          track: string;
          slug: string;
          completed: boolean;
          quizScore?: number;
          quizTotal?: number;
          stepIndex?: number;
          updatedAt: string;
        }>;
      };
      if (myEpoch !== epoch.current) return;
      setUser(data.user);
      if (data.user) {
        await pushLocalProgressToServer();
        if (myEpoch !== epoch.current) return;
        if (data.progress?.length) {
          const map = Object.fromEntries(
            data.progress.map((p) => [
              `${p.track}:${p.slug}`,
              {
                completed: p.completed,
                quizScore: p.quizScore,
                quizTotal: p.quizTotal,
                stepIndex: p.stepIndex,
                updatedAt: p.updatedAt,
              },
            ]),
          );
          mergeServerProgress(map);
        }
        window.dispatchEvent(new Event("dth-progress"));
      }
    } catch {
      if (myEpoch !== epoch.current) return;
      setUser(null);
    } finally {
      if (myEpoch === epoch.current) setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    // Invalidate any in-flight refresh so it cannot resurrect the session UI.
    epoch.current += 1;
    setUser(null);
    setLoading(false);
    try {
      await authedFetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* client already cleared */
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ user, loading, refresh, logout }),
    [user, loading, refresh, logout],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
