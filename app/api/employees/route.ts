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

  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });

  try {
    const employee = await prisma.employee.create({ data: { name: name.trim() } });
    return NextResponse.json(employee, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Funcionário já existe" }, { status: 409 });
  }
}
