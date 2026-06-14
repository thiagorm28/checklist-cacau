import { prisma } from "@/lib/prisma";
import { TasksClient } from "./TasksClient";

export default async function TasksPage() {
  const [tasks, employees] = await Promise.all([
    prisma.task.findMany({
      include: { employee: { select: { name: true } } },
      orderBy: [{ employee: { name: "asc" } }, { title: "asc" }],
    }),
    prisma.employee.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-choco-800 dark:text-choco-100 mb-6">Tarefas</h1>
      <TasksClient initialTasks={tasks} employees={employees} />
    </div>
  );
}
