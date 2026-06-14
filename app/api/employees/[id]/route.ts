import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const { name, cpf, birthDate } = await req.json();
  if (!name?.trim() || !cpf || !birthDate)
    return NextResponse.json({ error: "Nome, CPF e data de nascimento são obrigatórios" }, { status: 400 });

  try {
    const employee = await prisma.employee.update({
      where: { id: Number(id) },
      data: { name: name.trim(), cpf, birthDate },
    });
    return NextResponse.json(employee);
  } catch {
    return NextResponse.json({ error: "Nome ou CPF já cadastrado" }, { status: 409 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.employee.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
