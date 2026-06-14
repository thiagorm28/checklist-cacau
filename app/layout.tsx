import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cacau Show — Checklist",
  description: "Sistema de checklist de tarefas para funcionários",
  icons: {
    icon: "/cacau-icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${geist.className} min-h-full bg-choco-50 dark:bg-choco-900 text-choco-900 dark:text-choco-50 transition-colors`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
