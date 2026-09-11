"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dth-theme");
    const preferLight = stored === "light";
    setLight(preferLight);
    document.documentElement.classList.toggle("light", preferLight);
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("dth-theme", next ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-lg border border-[var(--ink-border)] bg-[var(--panel)] p-2 text-[var(--ink-fg)] transition hover:bg-[var(--panel-2)]"
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
    >
      {light ? <Moon className="h-4 w-4" aria-hidden /> : <Sun className="h-4 w-4" aria-hidden />}
    </button>
  );
}
