"use client";

import { useState } from "react";
import type { Employee } from "@prisma/client";

type FormData = { name: string; cpf: string; birthDate: string };

function formatCpf(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatBirthDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

function sanitizeCpf(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

const inputClass =
  "w-full border border-choco-200 dark:border-choco-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-choco-700 text-choco-900 dark:text-choco-100 placeholder:text-choco-300 dark:placeholder:text-choco-500 focus:outline-none focus:ring-2 focus:ring-choco-400 dark:focus:ring-choco-300";

export function EmployeesClient({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>({ name: "", cpf: "", birthDate: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function openAdd() {
    setEditId(null);
    setForm({ name: "", cpf: "", birthDate: "" });
    setError("");
    setShowForm(true);
  }

  function openEdit(emp: Employee) {
    setEditId(emp.id);
    setForm({ name: emp.name, cpf: emp.cpf ?? "", birthDate: emp.birthDate ?? "" });
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditId(null);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      cpf: form.cpf || null,
      birthDate: form.birthDate || null,
    };

    const url = editId !== null ? `/api/employees/${editId}` : "/api/employees";
    const method = editId !== null ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error); return; }

    if (editId !== null) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === editId ? data : e)).sort((a, b) => a.name.localeCompare(b.name))
      );
    } else {
      setEmployees((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    }
    closeForm();
  }

  async function handleDelete(id: number) {
    if (!confirm("Excluir funcionário e todas as suas tarefas?")) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    if (editId === id) closeForm();
  }

  return (
    <div className="space-y-6">
      {showForm ? (
        <div className="bg-white dark:bg-choco-800 rounded-xl shadow p-5 border border-choco-100 dark:border-choco-700">
          <h2 className="text-base font-semibold text-choco-700 dark:text-choco-200 mb-4">
            {editId !== null ? "Editar funcionário" : "Adicionar funcionário"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-choco-600 dark:text-choco-300 mb-1">Nome *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nome completo"
                  required
                  autoFocus
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-choco-600 dark:text-choco-300 mb-1">CPF *</label>
                <input
                  value={form.cpf ? formatCpf(form.cpf) : ""}
                  onChange={(e) => setForm((f) => ({ ...f, cpf: sanitizeCpf(e.target.value) }))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-choco-600 dark:text-choco-300 mb-1">Data de nascimento *</label>
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => setForm((f) => ({ ...f, birthDate: e.target.value }))}
                  required
                  className={inputClass}
                />
              </div>
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={loading || !form.name.trim() || form.cpf.length !== 11 || !form.birthDate}
                className="bg-choco-600 hover:bg-choco-700 dark:bg-choco-500 dark:hover:bg-choco-400 text-white text-sm px-4 py-2 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="text-sm text-choco-500 dark:text-choco-400 hover:text-choco-700 dark:hover:text-choco-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={openAdd}
          className="bg-choco-600 hover:bg-choco-700 dark:bg-choco-500 dark:hover:bg-choco-400 text-white text-sm px-4 py-2 rounded-xl transition"
        >
          + Adicionar funcionário
        </button>
      )}

      <div className="bg-white dark:bg-choco-800 rounded-xl shadow overflow-hidden border border-choco-100 dark:border-choco-700">
        {employees.length === 0 ? (
          <p className="text-choco-400 dark:text-choco-500 text-sm p-5">Nenhum funcionário cadastrado.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-choco-50 dark:bg-choco-700 border-b border-choco-100 dark:border-choco-600">
              <tr>
                <th className="text-left px-5 py-3 text-choco-600 dark:text-choco-300 font-medium">Nome</th>
                <th className="text-left px-5 py-3 text-choco-600 dark:text-choco-300 font-medium">CPF</th>
                <th className="text-left px-5 py-3 text-choco-600 dark:text-choco-300 font-medium">Nascimento</th>
                <th className="text-right px-5 py-3 text-choco-600 dark:text-choco-300 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-choco-100 dark:divide-choco-700">
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className={`transition ${editId === emp.id ? "bg-choco-50 dark:bg-choco-750" : "hover:bg-choco-50 dark:hover:bg-choco-700"}`}
                >
                  <td className="px-5 py-3 font-medium text-choco-800 dark:text-choco-200">{emp.name}</td>
                  <td className="px-5 py-3 text-choco-500 dark:text-choco-400">
                    {emp.cpf ? formatCpf(emp.cpf) : <span className="text-choco-300 dark:text-choco-600">—</span>}
                  </td>
                  <td className="px-5 py-3 text-choco-500 dark:text-choco-400">
                    {emp.birthDate ? formatBirthDate(emp.birthDate) : <span className="text-choco-300 dark:text-choco-600">—</span>}
                  </td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <button
                      onClick={() => openEdit(emp)}
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
