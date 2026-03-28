// src/app/fonts.ts
// ÚNICA fuente de verdad tipográfica del proyecto.
// Importar SOLO desde este archivo — nunca re-importar next/font en componentes.

import { Carlito } from "next/font/google";

export const carlito = Carlito({
  subsets: ["latin"],
  variable: "--font-carlito", // CSS custom property inyectada en <html>
  display: "swap",            // Equivalente al font-display: swap del CSS original
  weight: ["400", "700"],     // Estilo regular y negrita compatible con Calibri
  style: ["normal", "italic"],
  preload: true,              // Crítica para LCP
  fallback: [
    "Calibri",                // Prioridad nativa si está instalada en el sistema
    "Candara",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
  adjustFontFallback: true,   // next/font ajusta métricas del fallback para evitar CLS
});
