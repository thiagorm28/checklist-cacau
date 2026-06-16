"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Logo } from "@/app/components/Logo";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { SignOutButton } from "./SignOutButton";

const TABS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/employees", label: "Funcionários", exact: false },
  { href: "/admin/tasks", label: "Tarefas", exact: false },
  { href: "/admin/reports", label: "Relatório", exact: false },
];

export function AdminNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav className="hidden md:flex bg-choco-700 dark:bg-choco-900 text-white px-6 py-0 items-stretch justify-between shadow-lg">
        <div className="flex items-stretch gap-1">
          <Link href="/admin" className="flex items-center mr-4 py-3">
            <Logo className="h-6 w-auto text-white" />
          </Link>

          {TABS.map(({ href, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  relative flex items-center px-3 py-4 text-sm font-medium transition-colors
                  ${active ? "text-white" : "text-choco-300 hover:text-white"}
                `}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-choco-300 dark:bg-choco-400 rounded-t" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </nav>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden flex items-center justify-between bg-choco-700 dark:bg-choco-900 text-white px-4 py-3 shadow-lg">
        <Link href="/admin">
          <Logo className="h-6 w-auto text-white" />
        </Link>

        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir menu"
          className="p-1 rounded text-choco-200 hover:text-white transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── Mobile drawer panel ── */}
      <div
        className={`
          md:hidden fixed top-0 left-0 z-50 h-full w-64
          bg-choco-800 dark:bg-choco-950 text-white shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-choco-700 dark:border-choco-800">
          <Logo className="h-6 w-auto text-white" />
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Fechar menu"
            className="p-1 rounded text-choco-300 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.map(({ href, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${active
                    ? "bg-choco-600 dark:bg-choco-700 text-white"
                    : "text-choco-300 hover:bg-choco-700 dark:hover:bg-choco-800 hover:text-white"
                  }
                `}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div className="px-5 py-4 border-t border-choco-700 dark:border-choco-800 flex items-center justify-between">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </>
  );
}
