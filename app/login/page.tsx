"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Logo } from "@/app/components/Logo";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Email ou senha incorretos.");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-choco-50 dark:bg-choco-900 px-4 relative">
      <div className="absolute top-4 right-4 text-choco-600 dark:text-choco-300">
        <ThemeToggle />
      </div>
      <div className="bg-white dark:bg-choco-800 rounded-2xl shadow-xl p-8 w-full max-w-sm border border-choco-100 dark:border-choco-700">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo className="h-8 w-auto text-choco-700 dark:text-choco-200" />
          </div>
          <p className="text-sm text-choco-500 dark:text-choco-400 mt-1">Área do Administrador</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-choco-600 dark:text-choco-300 mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-choco-200 dark:border-choco-600 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-choco-700 text-choco-900 dark:text-choco-100 placeholder:text-choco-300 dark:placeholder:text-choco-500 focus:outline-none focus:ring-2 focus:ring-choco-400 dark:focus:ring-choco-300 transition"
              placeholder="admin@cacaushow.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-choco-600 dark:text-choco-300 mb-1.5 uppercase tracking-wide">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-choco-200 dark:border-choco-600 rounded-xl px-3 py-2.5 text-sm bg-white dark:bg-choco-700 text-choco-900 dark:text-choco-100 placeholder:text-choco-300 dark:placeholder:text-choco-500 focus:outline-none focus:ring-2 focus:ring-choco-400 dark:focus:ring-choco-300 transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-choco-600 hover:bg-choco-700 dark:bg-choco-500 dark:hover:bg-choco-400 text-white font-semibold rounded-xl py-2.5 text-sm transition disabled:opacity-60 mt-2"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
