"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      className="relative flex items-center gap-2 group"
    >
      {/* Sun icon */}
      <svg
        className={`w-4 h-4 transition-opacity ${isDark ? "opacity-40" : "opacity-100 text-choco-200"}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z"
        />
      </svg>

      {/* Toggle track */}
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          isDark ? "bg-choco-400" : "bg-choco-500/60"
        }`}
      >
        {/* Toggle thumb */}
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
            isDark ? "translate-x-[18px]" : "translate-x-[3px]"
          }`}
        />
      </span>

      {/* Moon icon */}
      <svg
        className={`w-4 h-4 transition-opacity ${isDark ? "opacity-100 text-choco-200" : "opacity-40"}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        />
      </svg>
    </button>
  );
}
