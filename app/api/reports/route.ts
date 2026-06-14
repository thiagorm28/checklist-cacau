import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { isTaskDueOnDate, todayString } from "@/lib/recurrence";

export async function GET(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? todayString();

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
        description: t.description,
        completed: completedIds.has(t.id),
      })),
      total: dueTasks.length,
      completed: dueTasks.filter((t) => completedIds.has(t.id)).length,
    };
  });

  return NextResponse.json({ date, report });
}
