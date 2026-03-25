# 🔤 SPEC TIPOGRÁFICO — Hotel Río Yurubí
## Sistema de Tipografía · Entorno de Desarrollo Dirigido por Agentes IA

**Versión:** 1.0  
**Fecha:** 2025  
**Clasificación:** Staff Engineer — Spec complementario al SPEC TÉCNICO v2.1  
**Dependencia:** Este documento se aplica en conjunto con `SPEC_TECNICO_v2.1_HotelRioYurubi.md`  
**Stack tipográfico:** Playfair Display · Lora · Nunito (todas Google Fonts, gratuitas)

> **Instrucción para el agente:** Este spec tipográfico es **canónico y vinculante**. Toda decisión de tipografía en el proyecto — componentes, tokens de Tailwind, CSS variables, clases utilitarias — debe derivarse de este documento. No usar fuentes distintas a las aquí definidas salvo en el sistema de fallback documentado en la Sección 4.

---

## ÍNDICE

1. [Familias Tipográficas y Roles](#1-familias-tipográficas-y-roles)
2. [Jerarquía de Estilos — Escala Completa](#2-jerarquía-de-estilos--escala-completa)
3. [Implementación en Next.js 16 con `next/font`](#3-implementación-en-nextjs-16-con-nextfont)
4. [Tokens de Tailwind CSS — Configuración Canónica](#4-tokens-de-tailwind-css--configuración-canónica)
5. [CSS Custom Properties (Variables)](#5-css-custom-properties-variables)
6. [Clases Utilitarias de Componentes](#6-clases-utilitarias-de-componentes)
7. [Reglas de Uso (ADTs — Architectural Design Tokens)](#7-reglas-de-uso-adts--architectural-design-tokens)
8. [Aplicación por Componente del Proyecto](#8-aplicación-por-componente-del-proyecto)
9. [Criterios de Aceptación Tipográfica](#9-criterios-de-aceptación-tipográfica)
10. [Anti-patrones Prohibidos](#10-anti-patrones-prohibidos)

---

## 1. Familias Tipográficas y Roles

El sistema usa **tres fuentes con roles estrictamente diferenciados**. No son intercambiables entre roles.

### 1.1 Tabla de Familias y Asignación de Roles

| Fuente | Clasificación | Rol en el Sistema | Variable CSS | Token Tailwind |
|--------|--------------|-------------------|-------------|----------------|
| **Playfair Display** | Serif Display | Display / Marca / Titulares H1–H2 | `--font-display` | `font-display` |
| **Lora** | Serif Text | Cuerpo de texto / H3 / UI narrativa | `--font-body` | `font-body` |
| **Nunito** | Sans Serif Redondeada | UI funcional / CTA / Microcopy | `--font-ui` | `font-ui` |

### 1.2 Justificación de cada fuente

**Playfair Display** — Elegancia clásica sin frialdad corporativa. El contraste moderado entre trazos la hace acogedora, coherente con el imaginario del hotel: casona de montaña, tradición y prestigio. Exclusiva para elementos de máxima jerarquía.

**Lora** — Comparte la raíz clásica de Playfair Display pero está optimizada para lectura en pantallas. Cálida, humana, legible en párrafos largos. Cubre toda la narrativa del hotel: descripciones de habitaciones, servicios, textos institucionales.

**Nunito** — Sans serif redondeada que actúa como contrapunto moderno y accesible. Usada con moderación (máx. 10–15% del contenido visible). Su geometría cálida humaniza los elementos de acción sin romper la elegancia del conjunto.

### 1.3 Disponibilidad y Licencia

| Fuente | Fuente de descarga | Licencia | Pesos disponibles |
|--------|--------------------|----------|------------------|
| Playfair Display | Google Fonts | OFL (gratuita, uso comercial) | 400, 500, 600, 700, 800, 900 · Italic |
| Lora | Google Fonts | OFL (gratuita, uso comercial) | 400, 500, 600, 700 · Italic |
| Nunito | Google Fonts | OFL (gratuita, uso comercial) | 300, 400, 500, 600, 700, 800, 900 |

---

## 2. Jerarquía de Estilos — Escala Completa

### 2.1 Escala Canónica

Todos los valores están expresados como tokens de Tailwind (`text-*`, `leading-*`, `tracking-*`). Los valores rem son referencia para CSS puro.

| Nivel | Fuente | Peso | Tamaño (px) | Tamaño (rem) | Tailwind size | Line Height | Leading Tailwind | Tracking | Uso |
|-------|--------|------|-------------|-------------|--------------|-------------|-----------------|---------|-----|
| **H1** | Playfair Display | 600 (SemiBold) | 48–60px | 3–3.75rem | `text-5xl`–`text-6xl` | 110% | `leading-none` | -1% (`-tracking-tight`) | Hero, portadas, banners principales |
| **H2** | Playfair Display | 400 (Regular) | 32–40px | 2–2.5rem | `text-4xl`–`text-5xl` | 120% | `leading-tight` | -0.5% (`-tracking-tight`) | Títulos de sección en landing |
| **H3** | Lora | 500 (Medium) | 22–26px | 1.375–1.625rem | `text-2xl`–`text-3xl` | 130% | `leading-snug` | 0% (`tracking-normal`) | Subtítulos, encabezados de cards |
| **H4** | Lora | 600 (SemiBold) | 18–20px | 1.125–1.25rem | `text-lg`–`text-xl` | 130% | `leading-snug` | 0% | Títulos secundarios, dashboard headers |
| **Body Large** | Lora | 400 (Regular) | 18px | 1.125rem | `text-lg` | 150% | `leading-relaxed` | 0.5% (`tracking-wide`) | Párrafos destacados, lead text |
| **Body** | Lora | 400 (Regular) | 16px | 1rem | `text-base` | 150% | `leading-relaxed` | 0% (`tracking-normal`) | Texto general, descripciones |
| **Body Small** | Lora | 400 (Regular) | 14px | 0.875rem | `text-sm` | 150% | `leading-relaxed` | 0% | Texto secundario, notas |
| **CTA / Button** | Nunito | 600 (SemiBold) | 16–18px | 1–1.125rem | `text-base`–`text-lg` | 110% | `leading-none` | 1% (`tracking-wide`) | Botones de acción, links primarios |
| **Label / UI** | Nunito | 500 (Medium) | 14px | 0.875rem | `text-sm` | 130% | `leading-snug` | 1% (`tracking-wide`) | Labels de formularios, tabs, badges |
| **Caption / Microcopy** | Nunito | 400 (Regular) | 12–14px | 0.75–0.875rem | `text-xs`–`text-sm` | 140% | `leading-normal` | 2% (`tracking-widest`) | Captions, placeholders, instrucciones |
| **Overline** | Nunito | 700 (Bold) | 11–12px | 0.688–0.75rem | `text-xs` | 140% | `leading-normal` | 8–10% (`tracking-widest`) | Etiquetas superiores, categorías |

### 2.2 Responsive Adjustments

En mobile (`< 640px`) reducir los tamaños de display:

| Nivel | Desktop | Mobile |
|-------|---------|--------|
| H1 | `text-5xl`–`text-6xl` | `text-4xl` |
| H2 | `text-4xl`–`text-5xl` | `text-3xl` |
| H3 | `text-2xl`–`text-3xl` | `text-xl` |
| Body | `text-base` | `text-base` (sin cambio) |

Implementar con prefijo `md:` de Tailwind: `text-4xl md:text-5xl lg:text-6xl`.

---

## 3. Implementación en Next.js 16 con `next/font`

### 3.1 Configuración Canónica de Fuentes

```typescript
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
```

### 3.2 Aplicación en Root Layout

```typescript
// src/app/[locale]/layout.tsx
// Next.js 16: params es async — await antes de usar
import type { Metadata } from "next";
import { playfairDisplay, lora, nunito } from "@/app/fonts";
import "@/app/globals.css";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params; // Next.js 16: params async

  return (
    <html
      lang={locale}
      // Aplicar las 3 variables CSS al elemento raíz
      className={`${playfairDisplay.variable} ${lora.variable} ${nunito.variable}`}
    >
      <body
        // font-body como default del documento completo
        className="font-body antialiased bg-white text-neutral-900"
      >
        {children}
      </body>
    </html>
  );
}
```

### 3.3 Carga y Performance

| Fuente | `preload` | Justificación |
|--------|-----------|--------------|
| Playfair Display | `true` | Visible en LCP (hero H1). Crítica para First Contentful Paint. |
| Lora | `true` | Cuerpo de texto — visible above-the-fold en casi todas las páginas. |
| Nunito | `false` | Solo usada en botones y microcopy. No bloquea LCP. |

**Regla:** `display: "swap"` en las tres fuentes para evitar FOIT (Flash of Invisible Text). Garantiza que el texto se muestre con fallback hasta que cargue la fuente.

---

## 4. Tokens de Tailwind CSS — Configuración Canónica

```typescript
// tailwind.config.ts — sección theme.extend (reemplaza la sección fontFamily del SPEC TÉCNICO v2.1)
// INSTRUCCIÓN PARA EL AGENTE: Este bloque reemplaza completamente el bloque fontFamily
// del tailwind.config.ts del spec principal.

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── TIPOGRAFÍA ──────────────────────────────────────────────
      fontFamily: {
        // Mapeo de tokens a variables CSS inyectadas por next/font
        display: ["var(--font-display)", "Georgia", "Cambria", "serif"],
        body:    ["var(--font-body)", "Georgia", "Cambria", "serif"],
        ui:      ["var(--font-ui)", "ui-sans-serif", "system-ui", "sans-serif"],
        // Aliases para compatibilidad semántica
        sans:    ["var(--font-ui)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif:   ["var(--font-body)", "Georgia", "Cambria", "serif"],
      },

      // ── ESCALA TIPOGRÁFICA EXTENDIDA ─────────────────────────────
      // Tailwind base cubre text-xs hasta text-9xl.
      // Se añaden aliases semánticos para consistencia en el proyecto.
      fontSize: {
        // Display scale (H1 / Hero)
        "display-2xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],  // 60px
        "display-xl":  ["3rem",    { lineHeight: "1.1", letterSpacing: "-0.01em" }],  // 48px
        // Heading scale
        "heading-lg":  ["2.5rem",  { lineHeight: "1.2", letterSpacing: "-0.005em" }], // 40px
        "heading-md":  ["2rem",    { lineHeight: "1.2", letterSpacing: "-0.005em" }], // 32px
        "heading-sm":  ["1.625rem",{ lineHeight: "1.3", letterSpacing: "0" }],        // 26px
        "heading-xs":  ["1.375rem",{ lineHeight: "1.3", letterSpacing: "0" }],        // 22px
        // Body scale
        "body-lg":     ["1.125rem",{ lineHeight: "1.5", letterSpacing: "0.005em" }],  // 18px
        "body-md":     ["1rem",    { lineHeight: "1.5", letterSpacing: "0" }],        // 16px
        "body-sm":     ["0.875rem",{ lineHeight: "1.5", letterSpacing: "0" }],        // 14px
        // UI scale
        "ui-md":       ["1rem",    { lineHeight: "1.1", letterSpacing: "0.01em" }],   // 16px (buttons)
        "ui-sm":       ["0.875rem",{ lineHeight: "1.3", letterSpacing: "0.01em" }],   // 14px (labels)
        "ui-xs":       ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],   // 12px (captions)
        "overline":    ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],   // 12px (overlines)
      },

      // ── COLORES DE MARCA ─────────────────────────────────────────
      // (Sin cambios vs spec principal — se mantiene para referencia completa)
      colors: {
        brand: {
          blue: {
            DEFAULT: "#0c88ee",
            50: "#f0f7ff",
            100: "#e0effe",
            500: "#0c88ee",
            600: "#006cd1",
            700: "#0056ad",
          },
          green: {
            DEFAULT: "#45b072",
            50: "#f2fcf5",
            100: "#e0f8e8",
            500: "#45b072",
            600: "#32925a",
            700: "#2a764b",
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};

export default config;
```

---

## 5. CSS Custom Properties (Variables)

```css
/* src/app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─────────────────────────────────────────────────────────────
   VARIABLES TIPOGRÁFICAS — Hotel Río Yurubí
   Estas variables son inyectadas por next/font en el <html>.
   Definir aquí los fallbacks para entornos sin JS.
   ───────────────────────────────────────────────────────────── */

:root {
  /* Fuentes base — sobreescritas por next/font vía className en <html> */
  --font-display: "Playfair Display", Georgia, Cambria, "Times New Roman", serif;
  --font-body:    "Lora", Georgia, Cambria, "Times New Roman", serif;
  --font-ui:      "Nunito", ui-sans-serif, system-ui, -apple-system, sans-serif;

  /* Escala de tamaños (en rem) */
  --text-display-2xl: 3.75rem;  /* 60px — H1 desktop max */
  --text-display-xl:  3rem;     /* 48px — H1 desktop min */
  --text-heading-lg:  2.5rem;   /* 40px — H2 desktop max */
  --text-heading-md:  2rem;     /* 32px — H2 desktop min */
  --text-heading-sm:  1.625rem; /* 26px — H3 desktop max */
  --text-heading-xs:  1.375rem; /* 22px — H3 desktop min */
  --text-body-lg:     1.125rem; /* 18px — Body large */
  --text-body-md:     1rem;     /* 16px — Body base */
  --text-body-sm:     0.875rem; /* 14px — Body small */
  --text-ui-md:       1rem;     /* 16px — Buttons */
  --text-ui-sm:       0.875rem; /* 14px — Labels */
  --text-ui-xs:       0.75rem;  /* 12px — Captions */

  /* Line heights */
  --leading-display:  1.1;
  --leading-heading:  1.2;
  --leading-subhead:  1.3;
  --leading-body:     1.5;
  --leading-ui:       1.1;
  --leading-caption:  1.4;

  /* Letter spacing */
  --tracking-display:  -0.01em;
  --tracking-heading:  -0.005em;
  --tracking-body:      0em;
  --tracking-ui:        0.01em;
  --tracking-caption:   0.02em;
  --tracking-overline:  0.08em;
}

/* ─────────────────────────────────────────────────────────────
   ESTILOS BASE — Prosa y tipografía global
   ───────────────────────────────────────────────────────────── */

html {
  font-size: 16px; /* base rem */
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  line-height: var(--leading-body);
  letter-spacing: var(--tracking-body);
  color: theme("colors.neutral.900");
  background-color: theme("colors.white");
}

/* Headings base — sin márgenes, el agente los agrega por contexto */
h1, h2 {
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: var(--tracking-display);
  line-height: var(--leading-display);
}

h3, h4 {
  font-family: var(--font-body);
  font-weight: 500;
  letter-spacing: var(--tracking-body);
  line-height: var(--leading-subhead);
}

/* Botones y elementos UI heredan font-ui por defecto */
button, input, select, textarea, label {
  font-family: var(--font-ui);
}
```

---

## 6. Clases Utilitarias de Componentes

Clases semánticas reutilizables definidas con `@layer components` en `globals.css`. El agente las usa directamente en JSX — no reinventa las combinaciones.

```css
/* src/app/globals.css — continuación, @layer components */

@layer components {

  /* ── DISPLAY / HERO ─────────────────────────────────────────── */

  .text-hero {
    @apply font-display text-display-xl md:text-display-2xl
           font-semibold leading-none tracking-tight text-white;
  }

  .text-hero-subtitle {
    @apply font-body text-body-lg md:text-heading-xs
           font-normal leading-relaxed tracking-wide text-white/90;
  }

  /* ── HEADINGS DE SECCIÓN (Landing Page) ─────────────────────── */

  .text-section-title {
    @apply font-display text-heading-md md:text-heading-lg
           font-normal leading-tight tracking-tight text-neutral-900;
  }

  .text-section-subtitle {
    @apply font-body text-body-lg
           font-normal leading-relaxed tracking-wide text-neutral-600;
  }

  /* ── HEADINGS DE CARDS ──────────────────────────────────────── */

  .text-card-title {
    @apply font-body text-heading-xs
           font-medium leading-snug tracking-normal text-neutral-900;
  }

  .text-card-body {
    @apply font-body text-body-md
           font-normal leading-relaxed tracking-normal text-neutral-700;
  }

  .text-card-price {
    @apply font-display text-heading-sm
           font-semibold leading-none tracking-tight text-brand-blue;
  }

  /* ── CUERPO DE TEXTO GENERAL ────────────────────────────────── */

  .text-prose {
    @apply font-body text-body-md
           font-normal leading-relaxed tracking-normal text-neutral-800;
  }

  .text-prose-lg {
    @apply font-body text-body-lg
           font-normal leading-relaxed tracking-wide text-neutral-800;
  }

  /* ── BOTONES Y CTA ───────────────────────────────────────────── */

  .text-cta {
    @apply font-ui text-ui-md
           font-semibold leading-none tracking-wide;
  }

  .text-cta-sm {
    @apply font-ui text-ui-sm
           font-semibold leading-none tracking-wide;
  }

  /* ── FORMULARIOS Y UI FUNCIONAL ─────────────────────────────── */

  .text-label {
    @apply font-ui text-ui-sm
           font-medium leading-snug tracking-wide text-neutral-700;
  }

  .text-input {
    @apply font-ui text-body-md
           font-normal leading-relaxed tracking-normal text-neutral-900;
  }

  .text-placeholder {
    @apply font-ui text-body-md
           font-normal tracking-normal text-neutral-400;
  }

  .text-helper {
    @apply font-ui text-ui-xs
           font-normal leading-normal tracking-wide text-neutral-500;
  }

  .text-error {
    @apply font-ui text-ui-xs
           font-normal leading-normal tracking-wide text-red-600;
  }

  /* ── DASHBOARD / PANEL INTERNO ──────────────────────────────── */

  .text-dashboard-title {
    @apply font-body text-heading-xs md:text-heading-sm
           font-semibold leading-snug tracking-normal text-neutral-900;
  }

  .text-kpi-value {
    @apply font-display text-display-xl
           font-semibold leading-none tracking-tight text-neutral-900;
  }

  .text-kpi-label {
    @apply font-ui text-ui-sm
           font-medium leading-snug tracking-wide text-neutral-500 uppercase;
  }

  .text-table-header {
    @apply font-ui text-ui-xs
           font-semibold leading-normal tracking-widest text-neutral-500 uppercase;
  }

  .text-table-cell {
    @apply font-ui text-body-sm
           font-normal leading-relaxed tracking-normal text-neutral-800;
  }

  .text-badge {
    @apply font-ui text-ui-xs
           font-semibold leading-none tracking-wide uppercase;
  }

  /* ── MICROCOPY Y CAPTIONS ───────────────────────────────────── */

  .text-caption {
    @apply font-ui text-ui-xs
           font-normal leading-normal tracking-widest text-neutral-500;
  }

  .text-overline {
    @apply font-ui text-overline
           font-bold leading-normal tracking-widest text-neutral-400 uppercase;
  }

  /* ── REVIEWS / TESTIMONIOS ───────────────────────────────────── */

  .text-review-quote {
    @apply font-body text-body-lg italic
           font-normal leading-relaxed tracking-wide text-neutral-700;
  }

  .text-review-author {
    @apply font-ui text-ui-sm
           font-semibold leading-snug tracking-wide text-neutral-900;
  }

  /* ── NAVEGACIÓN ──────────────────────────────────────────────── */

  .text-nav-link {
    @apply font-ui text-body-sm
           font-medium leading-none tracking-wide text-neutral-700
           hover:text-brand-blue transition-colors;
  }

  .text-nav-cta {
    @apply font-ui text-body-sm
           font-semibold leading-none tracking-wide;
  }

  /* ── PROMOCIONES / PRECIOS ───────────────────────────────────── */

  .text-promo-title {
    @apply font-display text-heading-xs md:text-heading-sm
           font-normal leading-tight tracking-tight text-neutral-900;
  }

  .text-price-original {
    @apply font-ui text-body-sm
           font-normal leading-none tracking-normal text-neutral-400 line-through;
  }

  .text-price-discount {
    @apply font-display text-heading-sm
           font-semibold leading-none tracking-tight text-green-600;
  }
}
```

---

## 7. Reglas de Uso (ADTs — Architectural Design Tokens)

Estas reglas son **contractuales**. El agente no puede violarlas sin una decisión explícita del equipo.

### ADT-001: Un rol, una fuente

| Situación | Correcto | Incorrecto |
|-----------|----------|-----------|
| Título de sección en landing | `font-display` (Playfair Display) | `font-body` o `font-ui` |
| Párrafo descriptivo de habitación | `font-body` (Lora) | `font-display` |
| Botón "Reservar Ahora" | `font-ui` (Nunito) | `font-body` o `font-display` |
| Label de input en formulario | `font-ui` (Nunito) | `font-body` |
| H3 de una card de servicio | `font-body` (Lora) | `font-display` |

### ADT-002: Jerarquía vertical inviolable

```
Playfair Display  →  Sólo H1 y H2
Lora              →  H3, H4, cuerpo, descripción, narrativa
Nunito            →  Botones, labels, badges, captions, microcopy
```

Nunca usar Playfair Display para texto de cuerpo. Nunca usar Lora para botones. Nunca usar Nunito para titulares de sección.

### ADT-003: Peso de Playfair Display máximo SemiBold (600)

No usar `font-bold` (700) ni pesos superiores en Playfair Display. La fuente tiene un contraste natural de trazo que se deforma visualmente con pesos altos. **Máximo: `font-semibold`**.

### ADT-004: Nunito — Restricción de volumen

Nunito no debe superar el **15% del contenido de texto visible** en cualquier vista. Se usa exclusivamente en:
- Botones y CTAs
- Labels de formularios
- Badges y pills de estado
- Captions e instrucciones cortas
- Overlines / etiquetas de categoría
- Navegación

### ADT-005: Itálica solo en Playfair Display y Lora

Nunito no tiene variante italiana cargada en este proyecto. No aplicar `italic` a elementos con `font-ui`.

### ADT-006: No redefinir en componentes individuales

Los tokens se definen en `tailwind.config.ts` y las clases utilitarias en `globals.css`. Los componentes consumen estas clases — no definen sus propias combinaciones de fuente/tamaño/peso ad hoc.

**Correcto:**
```tsx
<h1 className="text-hero">Tu refugio en Yaracuy</h1>
```

**Incorrecto:**
```tsx
<h1 className="font-['Playfair_Display'] text-6xl font-semibold leading-tight">
  Tu refugio en Yaracuy
</h1>
```

### ADT-007: Fallback stack correcto

| Fuente | Fallback correcto |
|--------|-------------------|
| Playfair Display | `Georgia, Cambria, "Times New Roman", serif` |
| Lora | `Georgia, Cambria, "Times New Roman", serif` |
| Nunito | `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif` |

No usar `Arial` como fallback de fuentes serif. No usar `Helvetica` o `sans-serif` genérico para Playfair o Lora.

---

## 8. Aplicación por Componente del Proyecto

Mapeo directo de las clases utilitarias de la Sección 6 a los componentes del SPEC TÉCNICO v2.1.

### 8.1 Landing Page — Componentes Públicos

| Componente | Elemento | Clase Utilitaria | Notas |
|-----------|----------|-----------------|-------|
| `HeroSection` | Título principal | `text-hero` | Playfair Display 600, 48–60px, blanco |
| `HeroSection` | Subtítulo | `text-hero-subtitle` | Lora 400, 18–22px, blanco/90 |
| `HeroSection` | Botón CTA | `text-cta` | Nunito 600, 16–18px |
| `RoomTypeGrid` | Título de sección | `text-section-title` | Playfair Display 400, 32–40px |
| `RoomTypeGrid` | Bajada de sección | `text-section-subtitle` | Lora 400, 18px |
| `RoomCard` | Nombre de habitación | `text-card-title` | Lora 500, 22–26px |
| `RoomCard` | Descripción | `text-card-body` | Lora 400, 16px |
| `RoomCard` | Precio por noche | `text-card-price` | Playfair Display 600, 22–26px, brand-blue |
| `RoomCard` | Botón "Reservar" | `text-cta-sm` | Nunito 600, 14px |
| `RestaurantSection` | Título | `text-section-title` | — |
| `RestaurantSection` | Párrafo descriptivo | `text-prose-lg` | Lora 400, 18px |
| `PoolSection` | Restricciones / normas | `text-prose` | Lora 400, 16px |
| `PoolSection` | Precio de acceso | `text-card-price` | — |
| `MeetingRoomSection` | Título | `text-section-title` | — |
| `MeetingRoomSection` | Lista de equipamiento | `text-prose` | — |
| `ReviewsCarousel` | Cita del huésped | `text-review-quote` | Lora italic, 18px |
| `ReviewsCarousel` | Nombre del autor | `text-review-author` | Nunito 600, 14px |
| `PromotionBanner` | Título de oferta | `text-promo-title` | Playfair Display 400 |
| `PromotionBanner` | Precio original | `text-price-original` | Nunito, tachado |
| `PromotionBanner` | Precio con descuento | `text-price-discount` | Playfair Display 600, verde |
| `ContactSection` | Título | `text-section-title` | — |
| `ContactSection` | Labels del form | `text-label` | Nunito 500, 14px |
| `ContactSection` | Inputs | `text-input` | Nunito 400, 16px |
| `Footer` | Links | `text-nav-link` | Nunito 500, 14px |
| `Footer` | Copyright / legal | `text-caption` | Nunito 400, 12px |
| `Header` / Nav | Links de navegación | `text-nav-link` | — |
| `Header` / Nav | Botón "Reservar" | `text-nav-cta` | Nunito 600 |

### 8.2 Wizard de Reserva (`BookingWizard`)

| Elemento | Clase Utilitaria | Notas |
|----------|-----------------|-------|
| Título del paso ("Selecciona tu estadía") | `text-dashboard-title` | Lora 600, 22–26px |
| Indicador de paso ("Paso 1 de 3") | `text-caption` | Nunito 400, 12px |
| Labels de campos | `text-label` | Nunito 500, 14px |
| Valores de inputs | `text-input` | Nunito 400, 16px |
| Texto de error de validación | `text-error` | Nunito 400, 12px, rojo |
| Texto de ayuda / hint | `text-helper` | Nunito 400, 12px, gris |
| Resumen (precio total) | `text-card-price` | Playfair Display 600 |
| Botones "Siguiente" / "Confirmar" | `text-cta` | Nunito 600 |
| Notas sobre pago adelantado | `text-prose` | Lora 400, 16px |

### 8.3 Dashboard — Panel Interno

| Elemento | Clase Utilitaria | Notas |
|----------|-----------------|-------|
| Título de página ("Reservas") | `text-dashboard-title` | Lora 600, 22–26px |
| Valor de KPI card | `text-kpi-value` | Playfair Display 600, 48px |
| Label de KPI card ("Reservas Activas") | `text-kpi-label` | Nunito 500, 12px, uppercase |
| Headers de tabla | `text-table-header` | Nunito 600, 12px, uppercase |
| Celdas de tabla | `text-table-cell` | Nunito 400, 14px |
| Badges de estado (PENDING, CONFIRMED) | `text-badge` | Nunito 600, 12px |
| Labels de formulario (Settings) | `text-label` | — |
| Sidebar — nombre del usuario | `text-body-sm font-ui font-semibold` | Nunito 600 |
| Sidebar — links de navegación | `text-nav-link` | Nunito 500 |
| Bitácora — descripción de acción | `text-table-cell` | — |

### 8.4 Emails Transaccionales

Las fuentes web no están disponibles en clientes de email. Usar el fallback stack directamente en el atributo `style` de los templates React Email.

```typescript
// Tokens tipográficos para React Email (inline styles)
export const emailTypography = {
  h1: {
    fontFamily: "'Playfair Display', Georgia, Cambria, serif",
    fontSize: "28px",
    fontWeight: "600",
    lineHeight: "1.2",
    letterSpacing: "-0.01em",
  },
  h2: {
    fontFamily: "'Playfair Display', Georgia, Cambria, serif",
    fontSize: "22px",
    fontWeight: "400",
    lineHeight: "1.3",
  },
  body: {
    fontFamily: "'Lora', Georgia, Cambria, serif",
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "1.5",
  },
  label: {
    fontFamily: "'Nunito', Arial, Helvetica, sans-serif",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  button: {
    fontFamily: "'Nunito', Arial, Helvetica, sans-serif",
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "0.01em",
  },
} as const;
```

---

## 9. Criterios de Aceptación Tipográfica

Criterios verificables por inspección de DOM / computed styles o tests automatizados.

| ID | Criterio | Verificación |
|----|----------|-------------|
| TYP-01 | El elemento `<html>` tiene las 3 variables CSS de fuente cargadas | `getComputedStyle(document.documentElement).getPropertyValue("--font-display")` no vacío |
| TYP-02 | El H1 del hero usa Playfair Display | `getComputedStyle(h1Element).fontFamily` incluye "Playfair Display" |
| TYP-03 | Los párrafos de cuerpo usan Lora | `getComputedStyle(pElement).fontFamily` incluye "Lora" |
| TYP-04 | Los botones CTA usan Nunito | `getComputedStyle(buttonElement).fontFamily` incluye "Nunito" |
| TYP-05 | Playfair Display no supera `font-weight: 600` | `getComputedStyle(h1Element).fontWeight <= "600"` |
| TYP-06 | Las 3 fuentes tienen `font-display: swap` | Network tab → response headers de los woff2 incluyen swap |
| TYP-07 | LCP no regresiona por carga de fuentes | Lighthouse performance ≥ 90 con las fuentes activas |
| TYP-08 | Nunito no tiene `font-style: italic` aplicado | No existe ningún `.italic` en elementos `font-ui` |
| TYP-09 | Los labels de formulario son Nunito, no Lora | `getComputedStyle(labelElement).fontFamily` incluye "Nunito" |
| TYP-10 | Los valores de KPI cards usan Playfair Display | `getComputedStyle(kpiValueEl).fontFamily` incluye "Playfair Display" |
| TYP-11 | Los precios en cards usan Playfair Display | `getComputedStyle(priceEl).fontFamily` incluye "Playfair Display" |
| TYP-12 | El fallback de serif es Georgia (no Arial) | `getComputedStyle(h1Element).fontFamily` incluye "Georgia" en posición 2 |

---

## 10. Anti-patrones Prohibidos

El agente debe rechazar activamente cualquier código que coincida con estos patrones.

```tsx
// ❌ PROHIBIDO: Definir fuente directamente en className con sintaxis arbitraria de Tailwind
<h1 className="font-['Playfair_Display'] text-6xl">...</h1>

// ❌ PROHIBIDO: Usar font-sans (mapea a system-ui) en titulares
<h1 className="font-sans text-5xl">...</h1>

// ❌ PROHIBIDO: Usar Playfair Display con font-bold (700+)
<h1 className="font-display font-bold">...</h1>

// ❌ PROHIBIDO: Usar Nunito en titulares de sección
<h2 className="font-ui text-4xl">Nuestras Habitaciones</h2>

// ❌ PROHIBIDO: Usar font-display en cuerpo de texto o párrafos largos
<p className="font-display text-base leading-relaxed">Descripción de la habitación...</p>

// ❌ PROHIBIDO: Aplicar italic a elementos con font-ui
<span className="font-ui italic">Nota: pago requerido</span>

// ❌ PROHIBIDO: Importar next/font en componentes individuales (solo en fonts.ts)
// En src/components/public/hero/HeroSection.tsx:
import { Playfair_Display } from "next/font/google"; // ← PROHIBIDO aquí

// ❌ PROHIBIDO: Usar style={{ fontFamily: ... }} en componentes web (solo en email templates)
<h1 style={{ fontFamily: "Playfair Display, serif" }}>...</h1>

// ❌ PROHIBIDO: Combinar dos fuentes del mismo rol jerárquico en el mismo nivel
<div>
  <h2 className="font-display">Título</h2>
  <h3 className="font-display">Subtítulo</h3>  {/* H3 debe ser font-body */}
</div>

// ❌ PROHIBIDO: Usar Arial como fallback de fuentes serif
fontFamily: { display: ["var(--font-display)", "Arial", "sans-serif"] } // ← PROHIBIDO
```

---

## Apéndice: Fuentes Alternativas Aprobadas

Solo usar si el cliente rechaza explícitamente alguna de las fuentes principales.

| Fuente principal | Alternativa aprobada | Cambio necesario |
|-----------------|---------------------|-----------------|
| Playfair Display | Cormorant Garamond | Reemplazar import en `fonts.ts` + variable `--font-display` |
| Playfair Display | Libre Baskerville | Ídem — más neutro, menos elegante |
| Lora | Merriweather | Reemplazar import + variable `--font-body` — más compacta |
| Lora | EB Garamond | Ídem — más clásica, menor x-height |
| Nunito | Poppins | Reemplazar import + variable `--font-ui` — más geométrica |
| Nunito | Montserrat | Ídem — más formal, menos redondeada |

Cualquier sustitución requiere actualizar: `fonts.ts`, `tailwind.config.ts` (`fontFamily`), variables en `globals.css`, y este documento (Sección 1.1).

---

*Documento generado para consumo directo por agentes de IA de generación de código.*  
*Versión: 1.0 · Spec complementario al SPEC TÉCNICO v2.1 — Hotel Río Yurubí*  
*Sistema tipográfico: Playfair Display · Lora · Nunito (Google Fonts, OFL)*  
*Toda decisión tipográfica del proyecto se deriva de este documento. No existen TODOs ni placeholders sin decisión tomada.*
