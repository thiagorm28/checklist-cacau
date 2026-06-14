"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/app/components/Calendar";

type ReportEntry = {
  id: number;
  name: string;
  tasks: { id: number; title: string; completed: boolean }[];
  total: number;
  completed: number;
};

export function ReportClient({ date, report }: { date: string; report: ReportEntry[] }) {
  const router = useRouter();
  const [showCalendar, setShowCalendar] = useState(false);

  const totalTasks = report.reduce((a, e) => a + e.total, 0);
  const totalDone = report.reduce((a, e) => a + e.completed, 0);

  const dateLabel = new Date(date + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  function handleDateChange(newDate: string) {
    setShowCalendar(false);
    router.push(`/admin/reports?date=${newDate}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-choco-500 dark:text-choco-400 text-sm capitalize">{dateLabel}</p>

        {/* Botão que abre/fecha o calendário */}
        <div className="relative">
          <button
            onClick={() => setShowCalendar((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-choco-200 dark:border-choco-600 bg-white dark:bg-choco-800 text-sm font-medium text-choco-700 dark:text-choco-300 hover:bg-choco-50 dark:hover:bg-choco-700 transition shadow-sm"
          >
            <svg className="w-4 h-4 text-choco-500 dark:text-choco-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
          </button>

          {showCalendar && (
            <div className="absolute right-0 top-full mt-2 z-50">
              <Calendar value={date} onChange={handleDateChange} />
            </div>
          )}
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-choco-800 rounded-xl shadow p-5 text-center border border-choco-100 dark:border-choco-700">
          <p className="text-3xl font-bold text-choco-600 dark:text-choco-300">{totalDone}</p>
          <p className="text-sm text-choco-500 dark:text-choco-400 mt-1">Concluídas</p>
        </div>
        <div className="bg-white dark:bg-choco-800 rounded-xl shadow p-5 text-center border border-choco-100 dark:border-choco-700">
          <p className="text-3xl font-bold text-choco-400 dark:text-choco-500">{totalTasks - totalDone}</p>
          <p className="text-sm text-choco-500 dark:text-choco-400 mt-1">Pendentes</p>
        </div>
        <div className="bg-white dark:bg-choco-800 rounded-xl shadow p-5 text-center border border-choco-100 dark:border-choco-700">
          <p className="text-3xl font-bold text-choco-600 dark:text-choco-300">
            {totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 100}%
          </p>
          <p className="text-sm text-choco-500 dark:text-choco-400 mt-1">Aproveitamento geral</p>
        </div>
      </div>

      {report.length === 0 ? (
        <p className="text-choco-400 dark:text-choco-500 text-sm">Nenhum funcionário cadastrado.</p>
      ) : (
        <div className="space-y-4">
          {report.map((emp) => (
            <div key={emp.id} className="bg-white dark:bg-choco-800 rounded-xl shadow overflow-hidden border border-choco-100 dark:border-choco-700">
              <div className="bg-choco-50 dark:bg-choco-700 px-5 py-3 border-b border-choco-100 dark:border-choco-600 flex items-center justify-between">
                <h2 className="font-semibold text-choco-800 dark:text-choco-200">{emp.name}</h2>
                <span className={`text-sm font-medium ${emp.completed === emp.total ? "text-green-600 dark:text-green-400" : "text-choco-600 dark:text-choco-300"}`}>
                  {emp.completed}/{emp.total} tarefas
                </span>
              </div>
              {emp.tasks.length === 0 ? (
                <p className="px-5 py-3 text-choco-400 dark:text-choco-500 text-sm">Sem tarefas para esta data.</p>
              ) : (
                <ul className="divide-y divide-choco-100 dark:divide-choco-700">
                  {emp.tasks.map((task) => (
                    <li key={task.id} className="px-5 py-2.5 flex items-center gap-3">
                      <span className={`text-lg ${task.completed ? "text-green-500 dark:text-green-400" : "text-choco-200 dark:text-choco-700"}`}>
                        {task.completed ? "✓" : "○"}
                      </span>
                      <span className={`text-sm ${task.completed ? "text-choco-700 dark:text-choco-300" : "text-choco-400 dark:text-choco-500"}`}>
                        {task.title}
                      </span>
                      {task.completed && (
                        <span className="ml-auto text-xs text-green-600 dark:text-green-400 font-medium">Concluída</span>
                      )}
                      {!task.completed && (
                        <span className="ml-auto text-xs text-choco-500 dark:text-choco-400 font-medium">Pendente</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
