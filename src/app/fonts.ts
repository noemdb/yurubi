// src/app/fonts.ts
// Instanciar fuentes UNA SOLA VEZ aquí y exportar.
// Importar en layout.tsx raíz — nunca re-importar en componentes.

import { Playfair_Display, Lora, Nunito } from "next/font/google";

// ── Display / Marca / H1–H2 ──────────────────────────────────
export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  preload: true,
});

// ── Cuerpo de texto / H3 / Narrativa ────────────────────────
export const lora = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  preload: true,
});

// ── UI funcional / CTA / Microcopy ──────────────────────────
export const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal"],
  preload: false, // No crítica para LCP
});
