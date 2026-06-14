import { prisma } from "@/lib/prisma";
import { EmployeesClient } from "./EmployeesClient";

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold text-choco-800 dark:text-choco-100 mb-6">Funcionários</h1>
      <EmployeesClient initialEmployees={employees} />
    </div>
  );
}
