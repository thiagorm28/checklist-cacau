import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cacau Show — Checklist",
    short_name: "Checklist",
    description: "Sistema de checklist de tarefas para funcionários",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf6f0",
    theme_color: "#3d2208",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
