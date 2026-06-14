"use client";

import { useState } from "react";
import type { Employee } from "@prisma/client";

export function EmployeesClient({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setEmployees((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    setNewName("");
  }

  async function handleEdit(id: number) {
    if (!editName.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? data : e)).sort((a, b) => a.name.localeCompare(b.name))
    );
    setEditId(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Excluir funcionário e todas as suas tarefas?")) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }

  const inputClass = "w-full border border-choco-200 dark:border-choco-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-choco-700 text-choco-900 dark:text-choco-100 placeholder:text-choco-300 dark:placeholder:text-choco-500 focus:outline-none focus:ring-2 focus:ring-choco-400 dark:focus:ring-choco-300";

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-choco-800 rounded-xl shadow p-5 border border-choco-100 dark:border-choco-700">
        <h2 className="text-base font-semibold text-choco-700 dark:text-choco-200 mb-3">Adicionar funcionário</h2>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nome do funcionário"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-choco-600 hover:bg-choco-700 dark:bg-choco-500 dark:hover:bg-choco-400 text-white text-sm px-4 py-2 rounded-xl transition disabled:opacity-60 whitespace-nowrap"
          >
            Adicionar
          </button>
        </form>
        {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}
      </div>

      <div className="bg-white dark:bg-choco-800 rounded-xl shadow overflow-hidden border border-choco-100 dark:border-choco-700">
        {employees.length === 0 ? (
          <p className="text-choco-400 dark:text-choco-500 text-sm p-5">Nenhum funcionário cadastrado.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-choco-50 dark:bg-choco-700 border-b border-choco-100 dark:border-choco-600">
              <tr>
                <th className="text-left px-5 py-3 text-choco-600 dark:text-choco-300 font-medium">Nome</th>
                <th className="text-right px-5 py-3 text-choco-600 dark:text-choco-300 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-choco-100 dark:divide-choco-700">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-choco-50 dark:hover:bg-choco-700 transition">
                  <td className="px-5 py-3">
                    {editId === emp.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border border-choco-300 dark:border-choco-600 rounded-lg px-2 py-1 text-sm w-48 bg-white dark:bg-choco-700 text-choco-900 dark:text-choco-100 focus:outline-none focus:ring-2 focus:ring-choco-400"
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium text-choco-800 dark:text-choco-200">{emp.name}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right space-x-2">
                    {editId === emp.id ? (
                      <>
                        <button
                          onClick={() => handleEdit(emp.id)}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="text-choco-400 dark:text-choco-500 hover:text-choco-600"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditId(emp.id); setEditName(emp.name); setError(""); }}
                          className="text-choco-600 dark:text-choco-300 hover:text-choco-800 dark:hover:text-choco-100 font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                        >
                          Excluir
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
