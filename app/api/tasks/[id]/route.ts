import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const { title, description, employeeId, recurrenceType, recurrenceDays } = await req.json();

  const task = await prisma.task.update({
    where: { id: Number(id) },
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      employeeId: Number(employeeId),
      recurrenceType,
      recurrenceDays: JSON.stringify(recurrenceDays ?? []),
    },
    include: { employee: { select: { name: true } } },
  });
  return NextResponse.json(task);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.task.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
