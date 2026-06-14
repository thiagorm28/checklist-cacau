import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get("employeeId");

  const tasks = await prisma.task.findMany({
    where: employeeId ? { employeeId: Number(employeeId) } : {},
    include: { employee: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { title, description, employeeId, recurrenceType, recurrenceDays } = await req.json();

  if (!title?.trim() || !employeeId || !recurrenceType) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      employeeId: Number(employeeId),
      recurrenceType,
      recurrenceDays: JSON.stringify(recurrenceDays ?? []),
    },
    include: { employee: { select: { name: true } } },
  });
  return NextResponse.json(task, { status: 201 });
}
