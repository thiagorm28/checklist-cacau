import { prisma } from "@/lib/prisma";
import { EmployeeSelector } from "./EmployeeSelector";
import { Logo } from "@/app/components/Logo";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const employees = await prisma.employee.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-choco-50 dark:bg-choco-900 flex flex-col items-center justify-center px-4 relative">
      <div className="absolute top-4 right-4 text-choco-600 dark:text-choco-300">
        <ThemeToggle />
      </div>
      <div className="text-center mb-8">
        <Logo className="h-10 w-auto text-choco-700 dark:text-choco-200 mx-auto mb-6" />
        <p className="text-choco-500 dark:text-choco-400 mt-1 text-sm">
          Selecione seu nome para ver suas tarefas de hoje
        </p>
      </div>

      <div className="w-full max-w-sm">
        {employees.length === 0 ? (
          <div className="bg-white dark:bg-choco-800 rounded-2xl shadow p-6 text-center border border-choco-100 dark:border-choco-700">
            <p className="text-choco-400 dark:text-choco-500 text-sm">Nenhum funcionário cadastrado.</p>
            <Link href="/login" className="text-choco-600 dark:text-choco-300 text-sm underline mt-2 inline-block">
              Área do administrador
            </Link>
          </div>
        ) : (
          <EmployeeSelector employees={employees} />
        )}
      </div>

      <Link href="/login" className="mt-8 text-xs text-choco-400 dark:text-choco-600 hover:text-choco-600 dark:hover:text-choco-400 transition">
        Administrador
      </Link>
    </div>
  );
}
