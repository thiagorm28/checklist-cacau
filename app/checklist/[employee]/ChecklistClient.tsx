"use client";

import { useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  overdueDate?: string;
};

function formatOverdueLabel(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "short", day: "numeric", month: "short",
  });
}

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
  const [expandedDesc, setExpandedDesc] = useState<Set<string>>(new Set());
  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { setPwError("As senhas não coincidem."); return; }
    setPwLoading(true);
    setPwError("");
    const res = await fetch("/api/employees/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, currentPassword: pwForm.current, newPassword: pwForm.next }),
    });
    const data = await res.json();
    setPwLoading(false);
    if (!res.ok) { setPwError(data.error); return; }
    setPwSuccess(true);
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => { setShowPwForm(false); setPwSuccess(false); }, 2000);
  }

  const TRUNCATE_AT = 80;

  function toggleDesc(key: string, e: React.MouseEvent) {
    e.stopPropagation();
    setExpandedDesc((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const completed = tasks.filter((t) => t.completed).length;

  async function toggle(task: Task) {
    setLoading(task.id);
    const taskDate = task.overdueDate ?? date;
    if (task.completed) {
      await fetch("/api/completions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id, date: taskDate }),
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: false } : t)));
    } else {
      await fetch("/api/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id, employeeId, date: taskDate }),
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
        {tasks.map((task) => {
          const descKey = `${task.id}-${task.overdueDate ?? date}`;
          const isExpanded = expandedDesc.has(descKey);
          const isLong = !!task.description && task.description.length > TRUNCATE_AT;
          return (
          <button
            key={descKey}
            onClick={() => toggle(task)}
            disabled={loading === task.id}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left ${
              task.completed
                ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                : task.overdueDate
                ? "bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600"
                : "bg-white dark:bg-choco-800 border-choco-200 dark:border-choco-700 hover:border-choco-400 dark:hover:border-choco-500"
            } disabled:opacity-60`}
          >
            <span
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                task.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : task.overdueDate
                  ? "border-amber-400 dark:border-amber-500"
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
              <p className={`text-sm font-medium ${
                task.completed
                  ? "text-green-800 dark:text-green-400 line-through"
                  : task.overdueDate
                  ? "text-amber-800 dark:text-amber-300"
                  : "text-choco-800 dark:text-choco-200"
              }`}>
                {task.title}
              </p>
              {task.overdueDate && !task.completed && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  Atrasada · {formatOverdueLabel(task.overdueDate)}
                </p>
              )}
              {task.description && (
                <p className="text-xs text-choco-400 dark:text-choco-500 mt-0.5">
                  {isExpanded || !isLong
                    ? task.description
                    : task.description.slice(0, TRUNCATE_AT) + "…"}
                  {isLong && (
                    <span
                      onClick={(e) => toggleDesc(descKey, e)}
                      className="ml-1 text-choco-500 dark:text-choco-400 hover:text-choco-700 dark:hover:text-choco-200 cursor-pointer underline"
                    >
                      {isExpanded ? "ver menos" : "ver mais"}
                    </span>
                  )}
                </p>
              )}
            </div>
          </button>
          );
        })}
      </div>

      <div className="mt-6">
        {showPwForm ? (
          <div className="bg-white dark:bg-choco-800 rounded-2xl border border-choco-100 dark:border-choco-700 shadow p-5">
            <p className="text-sm font-semibold text-choco-700 dark:text-choco-200 mb-4">Alterar senha</p>
            {pwSuccess ? (
              <p className="text-green-600 dark:text-green-400 text-sm">Senha alterada com sucesso!</p>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-3">
                {(["current", "next", "confirm"] as const).map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-choco-600 dark:text-choco-300 mb-1">
                      {field === "current" ? "Senha atual" : field === "next" ? "Nova senha" : "Confirmar nova senha"}
                    </label>
                    <input
                      type="password"
                      value={pwForm[field]}
                      onChange={(e) => setPwForm((f) => ({ ...f, [field]: e.target.value }))}
                      required
                      className="w-full border border-choco-200 dark:border-choco-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-choco-700 text-choco-900 dark:text-choco-100 focus:outline-none focus:ring-2 focus:ring-choco-400 dark:focus:ring-choco-300"
                    />
                  </div>
                ))}
                {pwError && <p className="text-red-500 dark:text-red-400 text-sm">{pwError}</p>}
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={pwLoading || !pwForm.current || !pwForm.next || !pwForm.confirm}
                    className="bg-choco-600 hover:bg-choco-700 dark:bg-choco-500 dark:hover:bg-choco-400 text-white text-sm px-4 py-2 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {pwLoading ? "Salvando..." : "Salvar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowPwForm(false); setPwError(""); setPwForm({ current: "", next: "", confirm: "" }); }}
                    className="text-sm text-choco-500 dark:text-choco-400 hover:text-choco-700 dark:hover:text-choco-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowPwForm(true)}
            className="text-xs text-choco-400 dark:text-choco-500 hover:text-choco-600 dark:hover:text-choco-300 transition underline"
          >
            Alterar senha
          </button>
        )}
      </div>
    </div>
  );
}
