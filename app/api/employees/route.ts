import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const employees = await prisma.employee.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { name, cpf, birthDate } = await req.json();
  if (!name?.trim() || !cpf || !birthDate)
    return NextResponse.json({ error: "Nome, CPF e data de nascimento são obrigatórios" }, { status: 400 });

  try {
    const employee = await prisma.employee.create({
      data: { name: name.trim(), cpf, birthDate },
    });
    return NextResponse.json(employee, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Nome ou CPF já cadastrado" }, { status: 409 });
  }
}
