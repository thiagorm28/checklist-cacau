"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm text-choco-300 hover:text-white transition"
    >
      Sair
    </button>
  );
}
