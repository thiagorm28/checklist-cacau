import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyEmployeePassword } from "@/lib/employeeAuth";

export async function POST(req: Request) {
  const { employeeId, password } = await req.json();

  if (!employeeId || !password)
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const employee = await prisma.employee.findUnique({ where: { id: Number(employeeId) } });

  if (!employee || !(await verifyEmployeePassword(employee, password)))
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });

  return NextResponse.json({ ok: true });
}
