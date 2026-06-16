import type { Task } from "@prisma/client";

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function isTaskDueOnDate(task: Task, dateStr: string): boolean {
  const days: (number | string)[] = JSON.parse(task.recurrenceDays);
  const date = new Date(dateStr + "T00:00:00");

  if (task.recurrenceType === "daily") return true;
  if (task.recurrenceType === "weekly") return (days as number[]).includes(date.getDay());
  if (task.recurrenceType === "monthly") return (days as number[]).includes(date.getDate());
  if (task.recurrenceType === "once") return days[0] === dateStr;
  return false;
}

export function getMostRecentOccurrenceBefore(task: Task, dateStr: string, maxDaysBack = 31): string | null {
  const base = new Date(dateStr + "T00:00:00");
  for (let i = 1; i <= maxDaysBack; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    const s = formatDate(d);
    if (isTaskDueOnDate(task, s)) return s;
  }
  return null;
}

export function todayString(): string {
  return formatDate(new Date());
}

export function subtractDays(dateStr: string, n: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() - n);
  return formatDate(d);
}
