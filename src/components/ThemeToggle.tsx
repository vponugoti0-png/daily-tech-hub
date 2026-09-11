"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dth-theme");
    // Default light (easy on eyes). Only go dark if user chose it.
    const preferDark = stored === "dark";
    setDark(preferDark);
    document.documentElement.classList.toggle("dark", preferDark);
    document.documentElement.classList.remove("light");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.classList.remove("light");
    localStorage.setItem("dth-theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-lg border border-[var(--ink-border)] bg-[var(--panel)] p-2 text-[var(--ink-fg)] transition hover:bg-[var(--panel-2)]"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
    </button>
  );
}
