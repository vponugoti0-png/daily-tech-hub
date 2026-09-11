"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { mergeServerProgress, pushLocalProgressToServer } from "@/lib/progress";

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

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
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
      setUser(data.user);
      if (data.user) {
        await pushLocalProgressToServer();
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
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
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
