import type { Task } from "@prisma/client";

export function isTaskDueOnDate(task: Task, dateStr: string): boolean {
  const days: number[] = JSON.parse(task.recurrenceDays);
  const date = new Date(dateStr + "T00:00:00");

  if (task.recurrenceType === "daily") return true;
  if (task.recurrenceType === "weekly") return days.includes(date.getDay());
  if (task.recurrenceType === "monthly") return days.includes(date.getDate());
  return false;
}

export function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
