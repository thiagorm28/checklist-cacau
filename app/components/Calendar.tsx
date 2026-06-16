"use client";

import { useState } from "react";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function diasNoMes(ano: number, mes: number) {
  return new Date(ano, mes + 1, 0).getDate();
}

function primeiroDiaDoMes(ano: number, mes: number) {
  return new Date(ano, mes, 1).getDay();
}

function hojeStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function Calendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const [viewAno, setViewAno] = useState(() => parseInt(value.split("-")[0]));
  const [viewMes, setViewMes] = useState(() => parseInt(value.split("-")[1]) - 1);

  const totalDias = diasNoMes(viewAno, viewMes);
  const primeiroDia = primeiroDiaDoMes(viewAno, viewMes);
  const hoje = hojeStr();

  function mesAnterior() {
    if (viewMes === 0) { setViewAno((a) => a - 1); setViewMes(11); }
    else setViewMes((m) => m - 1);
  }

  function proximoMes() {
    if (viewMes === 11) { setViewAno((a) => a + 1); setViewMes(0); }
    else setViewMes((m) => m + 1);
  }

  function selecionar(dia: number) {
    const str = `${viewAno}-${String(viewMes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    onChange(str);
  }

  // Build grid cells: nulls for padding + day numbers
  const celulas: (number | null)[] = Array(primeiroDia).fill(null);
  for (let d = 1; d <= totalDias; d++) celulas.push(d);
  while (celulas.length % 7 !== 0) celulas.push(null);

  return (
    <div className="bg-white dark:bg-choco-800 rounded-2xl shadow-xl border border-choco-200 dark:border-choco-700 p-4 w-72 select-none">
      {/* Header — mês e ano + navegação */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={mesAnterior}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-choco-500 dark:text-choco-300 hover:bg-choco-100 dark:hover:bg-choco-700 transition font-semibold text-lg leading-none"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-choco-800 dark:text-choco-100 tracking-wide">
          {MESES[viewMes]} {viewAno}
        </span>
        <button
          type="button"
          onClick={proximoMes}
          className="w-8 h-8 flex items-center justify-center rounded-xl text-choco-500 dark:text-choco-300 hover:bg-choco-100 dark:hover:bg-choco-700 transition font-semibold text-lg leading-none"
        >
          ›
        </button>
      </div>

      {/* Cabeçalho dias da semana */}
      <div className="grid grid-cols-7 mb-1">
        {DIAS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-choco-400 dark:text-choco-500 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grade de dias */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {celulas.map((dia, i) => {
          if (!dia) return <div key={i} className="aspect-square" />;

          const dataStr = `${viewAno}-${String(viewMes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
          const selecionado = dataStr === value;
          const ehHoje = dataStr === hoje;

          return (
            <button
              key={i}
              type="button"
              onClick={() => selecionar(dia)}
              className={`
                aspect-square rounded-xl text-xs font-medium transition-all flex items-center justify-center
                ${selecionado
                  ? "bg-choco-600 dark:bg-choco-400 text-white dark:text-choco-900 shadow-sm"
                  : ehHoje
                  ? "bg-choco-100 dark:bg-choco-700 text-choco-700 dark:text-choco-200 font-bold ring-1 ring-choco-300 dark:ring-choco-600"
                  : "text-choco-700 dark:text-choco-300 hover:bg-choco-100 dark:hover:bg-choco-700"
                }
              `}
            >
              {dia}
            </button>
          );
        })}
      </div>

      {/* Rodapé — data selecionada */}
      <div className="mt-3 pt-3 border-t border-choco-100 dark:border-choco-700 text-center">
        <span className="text-xs text-choco-500 dark:text-choco-400">
          {new Date(value + "T12:00:00").toLocaleDateString("pt-BR", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
