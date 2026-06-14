import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyEmployeePassword } from "@/lib/employeeAuth";

export async function POST(req: Request) {
  const { employeeId, currentPassword, newPassword } = await req.json();

  if (!employeeId || !currentPassword || !newPassword)
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  if (newPassword.length < 6)
    return NextResponse.json({ error: "A nova senha deve ter pelo menos 6 caracteres" }, { status: 400 });

  const employee = await prisma.employee.findUnique({ where: { id: Number(employeeId) } });

  if (!employee || !(await verifyEmployeePassword(employee, currentPassword)))
    return NextResponse.json({ error: "Senha atual incorreta" }, { status: 401 });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.employee.update({ where: { id: Number(employeeId) }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}
