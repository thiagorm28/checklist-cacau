"use client";

import { useRouter } from "next/navigation";
import type { Employee } from "@prisma/client";

export function EmployeeSelector({ employees }: { employees: Employee[] }) {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-choco-800 rounded-2xl shadow-lg p-4 space-y-2 border border-choco-100 dark:border-choco-700">
      {employees.map((emp) => (
        <button
          key={emp.id}
          onClick={() => router.push(`/checklist/${encodeURIComponent(emp.name)}`)}
          className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-choco-800 dark:text-choco-200 hover:bg-choco-50 dark:hover:bg-choco-700 hover:text-choco-900 dark:hover:text-white transition border border-transparent hover:border-choco-200 dark:hover:border-choco-600"
        >
          {emp.name}
        </button>
      ))}
    </div>
  );
}
