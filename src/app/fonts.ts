// src/app/fonts.ts
// ÚNICA fuente de verdad tipográfica del proyecto.
// Importar SOLO desde este archivo — nunca re-importar next/font en componentes.

import { Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",    // CSS custom property inyectada en <html>
  display: "swap",            // Equivalente al font-display: swap del CSS original
  weight: ["300", "400", "500", "600", "700"], // Los 5 pesos del CSS original
  style: ["normal"],
  preload: true,              // Crítica para LCP — Inter está en hero y cuerpo
  fallback: [
    "-apple-system",          // Fallback del CSS original preservado
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
  adjustFontFallback: true,   // next/font ajusta métricas del fallback para evitar CLS
});
