import { prisma } from "@/lib/prisma";
import { isTaskDueOnDate, todayString } from "@/lib/recurrence";
import { notFound } from "next/navigation";
import { ChecklistClient } from "./ChecklistClient";
import { Logo } from "@/app/components/Logo";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default async function ChecklistPage({ params }: { params: Promise<{ employee: string }> }) {
  const { employee: encodedName } = await params;
  const name = decodeURIComponent(encodedName);
  const today = todayString();

  const employee = await prisma.employee.findUnique({
    where: { name },
    include: {
      tasks: true,
      completions: { where: { date: today } },
    },
  });

  if (!employee) notFound();

  const dueTasks = employee.tasks.filter((t) => isTaskDueOnDate(t, today));
  const completedIds = new Set(employee.completions.map((c) => c.taskId));

  const tasks = dueTasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    completed: completedIds.has(t.id),
  }));

  const dateLabel = new Date(today + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div className="min-h-screen bg-choco-50 dark:bg-choco-900 relative">
      <div className="absolute top-4 right-4 text-choco-600 dark:text-choco-300">
        <ThemeToggle />
      </div>
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <Logo className="h-7 w-auto text-choco-700 dark:text-choco-200 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-choco-800 dark:text-choco-100">{employee.name}</h1>
          <p className="text-sm text-choco-500 dark:text-choco-400 mt-1 capitalize">{dateLabel}</p>
        </div>

        <ChecklistClient
          employeeId={employee.id}
          tasks={tasks}
          date={today}
        />

        <div className="mt-6 text-center">
          <a href="/" className="text-xs text-choco-400 dark:text-choco-600 hover:text-choco-600 dark:hover:text-choco-400 transition">
            ← Voltar
          </a>
        </div>
      </div>
    </div>
  );
}
