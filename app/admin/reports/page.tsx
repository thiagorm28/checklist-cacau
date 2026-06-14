import { prisma } from "@/lib/prisma";
import { isTaskDueOnDate, todayString } from "@/lib/recurrence";
import { ReportClient } from "./ReportClient";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date: dateParam } = await searchParams;
  const date = dateParam ?? todayString();

  const employees = await prisma.employee.findMany({
    include: { tasks: true, completions: { where: { date } } },
    orderBy: { name: "asc" },
  });

  const report = employees.map((emp) => {
    const dueTasks = emp.tasks.filter((t) => isTaskDueOnDate(t, date));
    const completedIds = new Set(emp.completions.map((c) => c.taskId));
    return {
      id: emp.id,
      name: emp.name,
      tasks: dueTasks.map((t) => ({
        id: t.id,
        title: t.title,
        completed: completedIds.has(t.id),
      })),
      total: dueTasks.length,
      completed: dueTasks.filter((t) => completedIds.has(t.id)).length,
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-choco-800 dark:text-choco-100 mb-6">Relatório do Dia</h1>
      <ReportClient date={date} report={report} />
    </div>
  );
}
