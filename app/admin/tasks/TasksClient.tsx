"use client";

import { useState } from "react";
import type { Employee } from "@prisma/client";

type Task = {
  id: number;
  title: string;
  description: string | null;
  employeeId: number;
  recurrenceType: string;
  recurrenceDays: string;
  employee: { name: string };
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function RecurrenceLabel({ type, days }: { type: string; days: number[] }) {
  if (type === "daily") return <span className="text-green-600 dark:text-green-400">Diária</span>;
  if (type === "weekly") {
    const names = days.map((d) => WEEKDAYS[d]).join(", ");
    return <span className="text-blue-600 dark:text-blue-400">Semanal: {names}</span>;
  }
  if (type === "monthly") {
    return <span className="text-purple-600 dark:text-purple-400">Mensal: dias {days.join(", ")}</span>;
  }
  return null;
}

const inputClass =
  "w-full border border-choco-200 dark:border-choco-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-choco-700 text-choco-900 dark:text-choco-100 placeholder:text-choco-300 dark:placeholder:text-choco-500 focus:outline-none focus:ring-2 focus:ring-choco-400 dark:focus:ring-choco-300";

function TaskForm({
  employees,
  initial,
  onSave,
  onCancel,
}: {
  employees: Employee[];
  initial?: Partial<Task>;
  onSave: (data: Omit<Task, "id" | "employee">) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [employeeId, setEmployeeId] = useState(initial?.employeeId?.toString() ?? "");
  const [recurrenceType, setRecurrenceType] = useState(initial?.recurrenceType ?? "daily");
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initial?.recurrenceDays ? JSON.parse(initial.recurrenceDays) : []
  );
  const [monthDay, setMonthDay] = useState<string>(
    initial?.recurrenceDays && initial.recurrenceType === "monthly"
      ? JSON.parse(initial.recurrenceDays).join(", ")
      : ""
  );
  const [loading, setLoading] = useState(false);

  function toggleDay(d: number) {
    setSelectedDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  function getRecurrenceDays(): number[] {
    if (recurrenceType === "daily") return [];
    if (recurrenceType === "weekly") return selectedDays;
    if (recurrenceType === "monthly") {
      return monthDay
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => n >= 1 && n <= 31);
    }
    return [];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !employeeId) return;
    setLoading(true);
    await onSave({
      title,
      description: description || null,
      employeeId: Number(employeeId),
      recurrenceType,
      recurrenceDays: JSON.stringify(getRecurrenceDays()),
    });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-choco-600 dark:text-choco-300 mb-1">Título *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-choco-600 dark:text-choco-300 mb-1">Funcionário *</label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            className={inputClass}
          >
            <option value="">Selecione...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-choco-600 dark:text-choco-300 mb-1">Descrição</label>
        <input
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-choco-600 dark:text-choco-300 mb-1">Recorrência *</label>
        <select
          value={recurrenceType}
          onChange={(e) => { setRecurrenceType(e.target.value); setSelectedDays([]); setMonthDay(""); }}
          className="border border-choco-200 dark:border-choco-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-choco-700 text-choco-900 dark:text-choco-100 focus:outline-none focus:ring-2 focus:ring-choco-400 dark:focus:ring-choco-300"
        >
          <option value="daily">Diária (todos os dias)</option>
          <option value="weekly">Semanal (dias da semana)</option>
          <option value="monthly">Mensal (dias do mês)</option>
        </select>
      </div>

      {recurrenceType === "weekly" && (
        <div>
          <label className="block text-xs font-medium text-choco-600 dark:text-choco-300 mb-2">Dias da semana</label>
          <div className="flex gap-2">
            {WEEKDAYS.map((day, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleDay(i)}
                className={`px-2 py-1 rounded-lg text-xs font-medium border transition ${
                  selectedDays.includes(i)
                    ? "bg-choco-600 dark:bg-choco-500 text-white border-choco-600 dark:border-choco-500"
                    : "bg-white dark:bg-choco-700 text-choco-600 dark:text-choco-300 border-choco-300 dark:border-choco-600 hover:border-choco-500 dark:hover:border-choco-400"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {recurrenceType === "monthly" && (
        <div>
          <label className="block text-xs font-medium text-choco-600 dark:text-choco-300 mb-1">
            Dias do mês (ex: 1, 15)
          </label>
          <input
            value={monthDay}
            onChange={(e) => setMonthDay(e.target.value)}
            placeholder="1, 15"
            className="border border-choco-200 dark:border-choco-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-choco-700 text-choco-900 dark:text-choco-100 focus:outline-none focus:ring-2 focus:ring-choco-400 dark:focus:ring-choco-300"
          />
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="bg-choco-600 hover:bg-choco-700 dark:bg-choco-500 dark:hover:bg-choco-400 text-white text-sm px-4 py-2 rounded-xl transition disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" onClick={onCancel} className="text-sm text-choco-500 dark:text-choco-400 hover:text-choco-700 dark:hover:text-choco-200">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function TasksClient({
  initialTasks,
  employees,
}: {
  initialTasks: Task[];
  employees: Employee[];
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  async function handleAdd(data: Omit<Task, "id" | "employee">) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const task = await res.json();
    setTasks((prev) => [...prev, task]);
    setShowForm(false);
  }

  async function handleEdit(id: number, data: Omit<Task, "id" | "employee">) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const task = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    setEditId(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Excluir esta tarefa?")) return;
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const grouped = tasks.reduce<Record<string, Task[]>>((acc, t) => {
    const name = t.employee.name;
    if (!acc[name]) acc[name] = [];
    acc[name].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-choco-800 rounded-xl shadow p-5 border border-choco-100 dark:border-choco-700">
        {showForm ? (
          <TaskForm employees={employees} onSave={handleAdd} onCancel={() => setShowForm(false)} />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="bg-choco-600 hover:bg-choco-700 dark:bg-choco-500 dark:hover:bg-choco-400 text-white text-sm px-4 py-2 rounded-xl transition"
          >
            + Nova tarefa
          </button>
        )}
      </div>

      {employees.length === 0 && (
        <p className="text-choco-400 dark:text-choco-500 text-sm">Cadastre funcionários primeiro.</p>
      )}

      {Object.entries(grouped).map(([empName, empTasks]) => (
        <div key={empName} className="bg-white dark:bg-choco-800 rounded-xl shadow overflow-hidden border border-choco-100 dark:border-choco-700">
          <div className="bg-choco-50 dark:bg-choco-700 px-5 py-3 border-b border-choco-100 dark:border-choco-600">
            <h2 className="font-semibold text-choco-800 dark:text-choco-200">{empName}</h2>
          </div>
          <div className="divide-y divide-choco-100 dark:divide-choco-700">
            {empTasks.map((task) => (
              <div key={task.id} className="px-5 py-3">
                {editId === task.id ? (
                  <TaskForm
                    employees={employees}
                    initial={task}
                    onSave={(data) => handleEdit(task.id, data)}
                    onCancel={() => setEditId(null)}
                  />
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-choco-800 dark:text-choco-200 text-sm">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-choco-500 dark:text-choco-400 mt-0.5">{task.description}</p>
                      )}
                      <p className="text-xs mt-1">
                        <RecurrenceLabel
                          type={task.recurrenceType}
                          days={JSON.parse(task.recurrenceDays)}
                        />
                      </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button
                        onClick={() => setEditId(task.id)}
                        className="text-choco-600 dark:text-choco-300 hover:text-choco-800 dark:hover:text-choco-100 text-sm font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {tasks.length === 0 && employees.length > 0 && (
        <p className="text-choco-400 dark:text-choco-500 text-sm">Nenhuma tarefa cadastrada. Clique em &quot;+ Nova tarefa&quot; para começar.</p>
      )}
    </div>
  );
}
