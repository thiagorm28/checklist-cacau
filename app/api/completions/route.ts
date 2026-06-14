import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const employeeId = searchParams.get("employeeId");

  const completions = await prisma.taskCompletion.findMany({
    where: {
      ...(date ? { date } : {}),
      ...(employeeId ? { employeeId: Number(employeeId) } : {}),
    },
  });
  return NextResponse.json(completions);
}

export async function POST(req: Request) {
  const { taskId, employeeId, date } = await req.json();
  if (!taskId || !employeeId || !date) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  try {
    const completion = await prisma.taskCompletion.create({
      data: { taskId: Number(taskId), employeeId: Number(employeeId), date },
    });
    return NextResponse.json(completion, { status: 201 });
  } catch {
    // já completada — retorna 200 igualmente
    const existing = await prisma.taskCompletion.findUnique({
      where: { taskId_date: { taskId: Number(taskId), date } },
    });
    return NextResponse.json(existing);
  }
}

export async function DELETE(req: Request) {
  const { taskId, date } = await req.json();
  await prisma.taskCompletion.deleteMany({ where: { taskId: Number(taskId), date } });
  return NextResponse.json({ ok: true });
}
