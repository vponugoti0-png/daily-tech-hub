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
      className="rounded-lg border border-white/10 bg-white/5 p-2 text-zinc-300 transition hover:border-white/20 hover:text-white"
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
    >
      {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
