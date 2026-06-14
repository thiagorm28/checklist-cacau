"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <nav className="bg-choco-700 dark:bg-choco-900 text-white px-6 py-0 flex items-stretch justify-between shadow-lg">
      <div className="flex items-stretch gap-1">
        {/* Logo */}
        <Link href="/admin" className="flex items-center mr-4 py-3">
          <Logo className="h-6 w-auto text-white" />
        </Link>

        {/* Tabs */}
        {TABS.map(({ href, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`
                relative flex items-center px-3 py-4 text-sm font-medium transition-colors
                ${active
                  ? "text-white"
                  : "text-choco-300 hover:text-white"
                }
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
  );
}
