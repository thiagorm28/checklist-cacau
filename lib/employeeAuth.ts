import bcrypt from "bcryptjs";
import type { Employee } from "@prisma/client";

export async function verifyEmployeePassword(employee: Employee, password: string): Promise<boolean> {
  if (employee.passwordHash) {
    return bcrypt.compare(password, employee.passwordHash);
  }
  return password === employee.cpf + "@cacau";
}
