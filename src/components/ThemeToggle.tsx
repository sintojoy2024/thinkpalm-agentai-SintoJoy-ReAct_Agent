"use client";

import { Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:border-[var(--brand)] hover:text-[var(--text-primary)] transition-colors shadow-[var(--shadow-sm)]"
    >
      {isLight ? <Sun className="w-3.5 h-3.5 text-[var(--brand)]" /> : <Moon className="w-3.5 h-3.5" />}
      <span className="hidden sm:inline">{isLight ? "Light" : "Dark"}</span>
      <ChevronDown className="w-3 h-3 opacity-50 hidden sm:inline" />
    </button>
  );
}
