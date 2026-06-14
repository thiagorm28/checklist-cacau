"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EmployeeOption = { id: number; name: string };

export function EmployeeSelector({ employees }: { employees: EmployeeOption[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<EmployeeOption | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function selectEmployee(emp: EmployeeOption) {
    setSelected(emp);
    setPassword("");
    setError("");
  }

  function goBack() {
    setSelected(null);
    setPassword("");
    setError("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/employees/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: selected.id, password }),
    });

    if (res.ok) {
      router.push(`/checklist/${encodeURIComponent(selected.name)}`);
    } else {
      setError("Senha incorreta. Tente novamente.");
      setLoading(false);
    }
  }

  if (selected) {
    return (
      <div className="bg-white dark:bg-choco-800 rounded-2xl shadow-lg p-6 border border-choco-100 dark:border-choco-700">
        <p className="text-sm text-choco-500 dark:text-choco-400 mb-1">Entrando como</p>
        <p className="text-lg font-semibold text-choco-800 dark:text-choco-100 mb-5">{selected.name}</p>

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-choco-600 dark:text-choco-300 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              autoFocus
              required
              className="w-full border border-choco-200 dark:border-choco-600 rounded-xl px-3 py-2 text-sm bg-white dark:bg-choco-700 text-choco-900 dark:text-choco-100 placeholder:text-choco-300 dark:placeholder:text-choco-500 focus:outline-none focus:ring-2 focus:ring-choco-400 dark:focus:ring-choco-300"
            />
          </div>

          {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-choco-600 hover:bg-choco-700 dark:bg-choco-500 dark:hover:bg-choco-400 text-white text-sm px-4 py-2 rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <button
          onClick={goBack}
          className="mt-4 text-xs text-choco-400 dark:text-choco-500 hover:text-choco-600 dark:hover:text-choco-300 transition"
        >
          ← Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-choco-800 rounded-2xl shadow-lg p-4 space-y-2 border border-choco-100 dark:border-choco-700">
      {employees.map((emp) => (
        <button
          key={emp.id}
          onClick={() => selectEmployee(emp)}
          className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-choco-800 dark:text-choco-200 hover:bg-choco-50 dark:hover:bg-choco-700 hover:text-choco-900 dark:hover:text-white transition border border-transparent hover:border-choco-200 dark:hover:border-choco-600"
        >
          {emp.name}
        </button>
      ))}
    </div>
  );
}
