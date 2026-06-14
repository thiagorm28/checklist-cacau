"use client";

import { useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
};

export function ChecklistClient({
  employeeId,
  tasks: initialTasks,
  date,
}: {
  employeeId: number;
  tasks: Task[];
  date: string;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState<number | null>(null);

  const completed = tasks.filter((t) => t.completed).length;

  async function toggle(task: Task) {
    setLoading(task.id);
    if (task.completed) {
      await fetch("/api/completions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id, date }),
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: false } : t)));
    } else {
      await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id, employeeId, date }),
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t)));
    }
    setLoading(null);
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-choco-800 rounded-2xl shadow p-6 text-center border border-choco-100 dark:border-choco-700">
        <p className="text-choco-400 dark:text-choco-500 text-sm">Nenhuma tarefa para hoje.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-sm text-choco-500 dark:text-choco-400">
          {completed}/{tasks.length} tarefas concluídas
        </p>
        {completed === tasks.length && tasks.length > 0 && (
          <span className="text-sm text-green-600 dark:text-green-400 font-semibold">Tudo concluído! 🎉</span>
        )}
      </div>

      <div className="mb-4">
        <div className="bg-choco-100 dark:bg-choco-800 rounded-full h-2">
          <div
            className="bg-choco-500 dark:bg-choco-400 h-2 rounded-full transition-all"
            style={{ width: `${tasks.length > 0 ? (completed / tasks.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => toggle(task)}
            disabled={loading === task.id}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left ${
              task.completed
                ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                : "bg-white dark:bg-choco-800 border-choco-200 dark:border-choco-700 hover:border-choco-400 dark:hover:border-choco-500"
            } disabled:opacity-60`}
          >
            <span
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                task.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-choco-300 dark:border-choco-600"
              }`}
            >
              {task.completed && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.completed ? "text-green-800 dark:text-green-400 line-through" : "text-choco-800 dark:text-choco-200"}`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-choco-400 dark:text-choco-500 mt-0.5 truncate">{task.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
