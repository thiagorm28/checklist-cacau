import { prisma } from "@/lib/prisma";
import { todayString, isTaskDueOnDate } from "@/lib/recurrence";
import Link from "next/link";

export default async function AdminDashboard() {
  const today = todayString();
  const employees = await prisma.employee.findMany({
    include: { tasks: true, completions: { where: { date: today } } },
    orderBy: { name: "asc" },
  });

  const totalDue = employees.reduce(
    (acc, emp) => acc + emp.tasks.filter((t) => isTaskDueOnDate(t, today)).length,
    0
  );
  const totalDone = employees.reduce((acc, emp) => acc + emp.completions.length, 0);

  const dateLabel = new Date(today + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-choco-800 dark:text-choco-100 mb-1">Dashboard</h1>
      <p className="text-choco-500 dark:text-choco-400 text-sm mb-6 capitalize">{dateLabel}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-choco-800 rounded-xl shadow p-5 text-center border border-choco-100 dark:border-choco-700">
          <p className="text-3xl font-bold text-choco-600 dark:text-choco-300">{employees.length}</p>
          <p className="text-sm text-choco-500 dark:text-choco-400 mt-1">Funcionários</p>
        </div>
        <div className="bg-white dark:bg-choco-800 rounded-xl shadow p-5 text-center border border-choco-100 dark:border-choco-700">
          <p className="text-3xl font-bold text-choco-600 dark:text-choco-300">{totalDone}</p>
          <p className="text-sm text-choco-500 dark:text-choco-400 mt-1">Tarefas concluídas hoje</p>
        </div>
        <div className="bg-white dark:bg-choco-800 rounded-xl shadow p-5 text-center border border-choco-100 dark:border-choco-700">
          <p className="text-3xl font-bold text-choco-600 dark:text-choco-300">{totalDue - totalDone}</p>
          <p className="text-sm text-choco-500 dark:text-choco-400 mt-1">Tarefas pendentes hoje</p>
        </div>
      </div>

      <div className="bg-white dark:bg-choco-800 rounded-xl shadow p-5 border border-choco-100 dark:border-choco-700">
        <h2 className="text-lg font-semibold text-choco-800 dark:text-choco-100 mb-4">Resumo do dia</h2>
        {employees.length === 0 ? (
          <p className="text-choco-400 dark:text-choco-500 text-sm">
            Nenhum funcionário cadastrado.{" "}
            <Link href="/admin/employees" className="text-choco-600 dark:text-choco-300 underline">Cadastrar agora</Link>
          </p>
        ) : (
          <div className="space-y-3">
            {employees.map((emp) => {
              const due = emp.tasks.filter((t) => isTaskDueOnDate(t, today));
              const done = emp.completions.length;
              const pct = due.length > 0 ? Math.round((done / due.length) * 100) : 100;
              return (
                <div key={emp.id} className="flex items-center gap-4">
                  <p className="w-36 text-sm font-medium text-choco-700 dark:text-choco-300 truncate">{emp.name}</p>
                  <div className="flex-1 bg-choco-100 dark:bg-choco-700 rounded-full h-3">
                    <div
                      className="bg-choco-500 dark:bg-choco-400 h-3 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-sm text-choco-500 dark:text-choco-400 w-20 text-right">{done}/{due.length} tarefas</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/admin/reports" className="bg-choco-600 hover:bg-choco-700 dark:bg-choco-500 dark:hover:bg-choco-400 text-white text-sm px-4 py-2 rounded-lg transition">
          Ver relatório completo
        </Link>
        <Link href="/" className="bg-white dark:bg-choco-800 border border-choco-300 dark:border-choco-600 text-choco-700 dark:text-choco-300 text-sm px-4 py-2 rounded-lg hover:bg-choco-50 dark:hover:bg-choco-700 transition">
          Ver checklist dos funcionários
        </Link>
      </div>
    </div>
  );
}
