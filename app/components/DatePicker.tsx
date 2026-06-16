"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar } from "./Calendar";

interface DatePickerProps {
  value: string; // YYYY-MM-DD or ""
  onChange: (value: string) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Initialise Calendar with today if no value yet
  const calendarValue = value || (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function handleSelect(iso: string) {
    onChange(iso);
    setOpen(false);
  }

  let label = "Selecionar data";
  if (value) {
    const [y, m, d] = value.split("-");
    label = `${d}/${m}/${y}`;
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 border border-choco-200 dark:border-choco-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-choco-700 text-left focus:outline-none focus:ring-2 focus:ring-choco-400 dark:focus:ring-choco-300 transition"
      >
        <svg className="w-4 h-4 shrink-0 text-choco-400 dark:text-choco-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className={value ? "text-choco-900 dark:text-choco-100" : "text-choco-300 dark:text-choco-500"}>
          {label}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1">
          <Calendar value={calendarValue} onChange={handleSelect} />
        </div>
      )}
    </div>
  );
}
