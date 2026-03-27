# 🔤 SPEC TIPOGRÁFICO v2.0 — Hotel Río Yurubí
## Sistema de Tipografía · Identidad Visual EDUSYS · Entorno de Desarrollo Dirigido por Agentes IA

**Versión:** 2.0  
**Fecha:** 2025  
**Clasificación:** Staff Engineer — Spec complementario al SPEC TÉCNICO v2.1  
**Reemplaza:** `SpecTipográfico.md` (sistema Playfair Display + Lora + Nunito)  
**Dependencia:** Este documento se aplica en conjunto con `SPEC_TECNICO_v2.1_HotelRioYurubi.md`  
**Stack tipográfico:** Inter (única familia, Google Fonts, gratuita) — pesos 300, 400, 500, 600, 700

> **Instrucción para el agente:** Este spec tipográfico es **canónico y vinculante**. Reemplaza completamente el sistema serif anterior (Playfair Display + Lora + Nunito). El proyecto adopta la identidad visual EDUSYS: moderna, profesional, clara y sans-serif. Toda decisión tipográfica debe derivarse exclusivamente de este documento. No usar fuentes distintas a Inter salvo en el sistema de fallback documentado en la Sección 4.

---

> **⚠️ Nota sobre el CSS fuente provisto:**
> El bloque `@font-face` original contenía errores de sintaxis que causarían fallos silenciosos en producción:
> - `font-family` usaba la query string de Google Fonts como nombre (`'Inter:wght@300;400;500;600;700'`) — inválido como identificador CSS.
> - `format('google-fonts')` no es un formato reconocido por ningún navegador.
> - La URL apuntaba a la hoja de estilos de Google Fonts, no a un archivo `.woff2` directo.
>
> **Solución aplicada:** Se implementa Inter vía `next/font/google` (ADR-003 del spec técnico), que genera automáticamente el `@font-face` correcto con subsets optimizados, self-hosting en Vercel y `font-display: swap`. El resultado es idéntico al CSS original pero sintácticamente válido y con mejor performance.

---

## ÍNDICE

1. [Familia Tipográfica y Rol](#1-familia-tipográfica-y-rol)
2. [Identidad Visual EDUSYS aplicada al Hotel](#2-identidad-visual-edusys-aplicada-al-hotel)
3. [Jerarquía de Estilos — Escala Completa](#3-jerarquía-de-estilos--escala-completa)
4. [Implementación en Next.js 16 con `next/font`](#4-implementación-en-nextjs-16-con-nextfont)
5. [Tokens de Tailwind CSS — Configuración Canónica](#5-tokens-de-tailwind-css--configuración-canónica)
6. [CSS Custom Properties (Variables)](#6-css-custom-properties-variables)
7. [Clases Utilitarias de Componentes](#7-clases-utilitarias-de-componentes)
8. [Reglas de Uso (ADTs — Architectural Design Tokens)](#8-reglas-de-uso-adts--architectural-design-tokens)
9. [Aplicación por Componente del Proyecto](#9-aplicación-por-componente-del-proyecto)
10. [Criterios de Aceptación Tipográfica](#10-criterios-de-aceptación-tipográfica)
11. [Anti-patrones Prohibidos](#11-anti-patrones-prohibidos)

---

## 1. Familia Tipográfica y Rol

### 1.1 Sistema Mono-familiar

A diferencia de la v1.0 (tres familias con roles separados), este sistema usa **una única familia — Inter — con diferenciación exclusivamente por peso y tamaño**. Esto es coherente con la identidad EDUSYS: plataforma SaaS educativa moderna, funcional, sin ornamentación.

| Fuente | Clasificación | Rol | Variable CSS | Token Tailwind |
|--------|--------------|-----|-------------|----------------|
| **Inter** | Sans Serif Humanista | Todo el sistema tipográfico | `--font-sans` | `font-sans` |

### 1.2 Pesos Cargados y Sus Roles

| Peso | Nombre | Token Tailwind | Uso principal |
|------|--------|---------------|---------------|
| 300 | Light | `font-light` | Subtítulos grandes, taglines, texto decorativo |
| 400 | Regular | `font-normal` | Cuerpo de texto, párrafos, descripciones |
| 500 | Medium | `font-medium` | Labels, navegación, texto de UI secundario |
| 600 | SemiBold | `font-semibold` | Títulos de sección, cards, CTAs, dashboard |
| 700 | Bold | `font-bold` | Títulos principales, KPIs, énfasis crítico |

### 1.3 Disponibilidad y Licencia

| Fuente | Fuente | Licencia | URL |
|--------|--------|----------|-----|
| Inter | Google Fonts / rsms.me | OFL 1.1 (gratuita, uso comercial) | `fonts.google.com/specimen/Inter` |

### 1.4 Por qué Inter encaja con EDUSYS

Inter fue diseñada específicamente para interfaces digitales. Su geometría neutral, altura de x elevada y espaciado optimizado para pantallas la hace ideal para una plataforma de gestión como EDUSYS: **legible en tablas, formularios, dashboards y textos largos simultáneamente**. Elimina la fricción visual entre el componente de landing (emocional) y el dashboard (funcional) al usar una sola voz tipográfica consistente.

---

## 2. Identidad Visual EDUSYS aplicada al Hotel

### 2.1 Principios de Comunicación que Guían las Decisiones Tipográficas

Los brand guidelines de EDUSYS definen tres atributos de personalidad que se traducen directamente en decisiones tipográficas:

| Atributo EDUSYS | Traducción tipográfica | Implementación |
|----------------|----------------------|----------------|
| **Professional & Trustworthy** | Consistencia absoluta, sin mezcla de familias, jerarquía clara | Una familia, diferenciación solo por peso |
| **Supportive & Empowering** | Legibilidad óptima, texto sin fricciones, espaciado generoso | `leading-relaxed` en cuerpo, tamaños base 16px |
| **Innovative & Forward-Thinking** | Sans-serif moderna, sin serifas clásicas, escala funcional | Inter en lugar de Playfair/Lora |

### 2.2 Tono de Escritura y Tipografía

EDUSYS define su estilo como **"Clear & Direct"** y **"Engaging & Motivational"**. Esto impacta en:

- **Tamaños de texto**: nunca demasiado pequeños (mínimo 12px visible en UI)
- **Pesos**: SemiBold/Bold para CTAs y mensajes clave — coherente con el tono motivacional
- **Tracking**: neutro o ligeramente amplio en labels y overlines — refuerza claridad
- **Line height**: generoso en cuerpo — refuerza el carácter "supportive"

---

## 3. Jerarquía de Estilos — Escala Completa

### 3.1 Escala Canónica

| Nivel | Peso | Tamaño (px) | Tamaño (rem) | Tailwind size | Line Height | Leading Tailwind | Tracking | Uso |
|-------|------|-------------|-------------|--------------|-------------|-----------------|---------|-----|
| **Display / H1** | 700 (Bold) | 48–60px | 3–3.75rem | `text-5xl`–`text-6xl` | 110% | `leading-none` | -2% (`tracking-tighter`) | Hero, portadas |
| **H2** | 600 (SemiBold) | 36–40px | 2.25–2.5rem | `text-4xl`–`text-5xl` | 115% | `leading-tight` | -1% (`tracking-tight`) | Títulos de sección |
| **H3** | 600 (SemiBold) | 24–28px | 1.5–1.75rem | `text-2xl`–`text-3xl` | 125% | `leading-snug` | -0.5% (`tracking-tight`) | Títulos de cards, subsecciones |
| **H4** | 500 (Medium) | 18–20px | 1.125–1.25rem | `text-lg`–`text-xl` | 130% | `leading-snug` | 0% (`tracking-normal`) | Títulos secundarios, dashboard |
| **Body Large** | 400 (Regular) | 18px | 1.125rem | `text-lg` | 160% | `leading-loose` | 0% (`tracking-normal`) | Párrafos destacados, lead text |
| **Body** | 400 (Regular) | 16px | 1rem | `text-base` | 150% | `leading-relaxed` | 0% (`tracking-normal`) | Texto general |
| **Body Small** | 400 (Regular) | 14px | 0.875rem | `text-sm` | 145% | `leading-relaxed` | 0% | Notas, texto secundario |
| **CTA / Button** | 600 (SemiBold) | 15–16px | 0.9375–1rem | `text-sm`–`text-base` | 100% | `leading-none` | 1% (`tracking-wide`) | Botones primarios y secundarios |
| **Label / UI** | 500 (Medium) | 13–14px | 0.8125–0.875rem | `text-sm` | 130% | `leading-snug` | 0.5% (`tracking-wide`) | Labels, tabs, pills |
| **Caption** | 400 (Regular) | 12px | 0.75rem | `text-xs` | 140% | `leading-normal` | 1% (`tracking-wide`) | Captions, hints, helper text |
| **Overline** | 600 (SemiBold) | 11px | 0.6875rem | `text-xs` | 140% | `leading-normal` | 8% (`tracking-widest`) | Categorías, etiquetas superiores |
| **Table Header** | 600 (SemiBold) | 12px | 0.75rem | `text-xs` | 140% | `leading-normal` | 5% (`tracking-wider`) | Headers de tabla en dashboard |
| **KPI Value** | 700 (Bold) | 40–48px | 2.5–3rem | `text-4xl`–`text-5xl` | 100% | `leading-none` | -2% (`tracking-tighter`) | Valores numéricos en KPI cards |

### 3.2 Responsive Adjustments

| Nivel | Mobile (`< 640px`) | Tablet (`640–1024px`) | Desktop (`> 1024px`) |
|-------|-------------------|----------------------|---------------------|
| Display / H1 | `text-4xl` | `text-5xl` | `text-6xl` |
| H2 | `text-3xl` | `text-4xl` | `text-4xl` |
| H3 | `text-xl` | `text-2xl` | `text-3xl` |
| Body | `text-base` | `text-base` | `text-base` (sin cambio) |
| KPI Value | `text-3xl` | `text-4xl` | `text-5xl` |

Implementar con prefijos Tailwind: `text-4xl md:text-5xl lg:text-6xl`.

---

## 4. Implementación en Next.js 16 con `next/font`

### 4.1 Corrección del CSS Original

El CSS provisto originalmente tenía tres errores que se corrigen aquí:

```css
/* ❌ CSS ORIGINAL — INVÁLIDO (no usar) */
@font-face {
  /* ERROR 1: El nombre de familia incluye la query string completa de Google Fonts.
     Los navegadores lo tratan como un identificador literal con caracteres especiales.
     Para referenciarla habría que escribir font-family: 'Inter:wght@300;400;500;600;700'
     en cada propiedad CSS — frágil y no estándar. */
  font-family: 'Inter:wght@300;400;500;600;700';

  /* ERROR 2: La URL apunta a la hoja de estilos de Google Fonts (.css),
     no a un archivo de fuente (.woff2). @font-face requiere la URL
     del binario de la fuente, no de su CSS. */
  src: url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap')

  /* ERROR 3: 'google-fonts' no es un formato reconocido por ningún navegador.
     Los formatos válidos son: woff2, woff, truetype, opentype, embedded-opentype, svg. */
       format('google-fonts');
}

/* ✅ IMPLEMENTACIÓN CORRECTA — vía next/font (ver Sección 4.2) */
```

### 4.2 Configuración Canónica con `next/font`

```typescript
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
```

### 4.3 Aplicación en Root Layout

```typescript
// src/app/[locale]/layout.tsx
// Next.js 16: params es async — await antes de usar (ADR-008)

import type { Metadata } from "next";
import { inter } from "@/app/fonts";
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
      className={inter.variable} // Inyecta --font-sans en el elemento raíz
    >
      <body
        // font-sans como fuente base del documento completo
        // antialiased: mejora el rendering de Inter en macOS/iOS
        className="font-sans antialiased bg-white text-neutral-900"
      >
        {children}
      </body>
    </html>
  );
}
```

### 4.4 Performance

| Métrica | Impacto | Estrategia |
|---------|---------|-----------|
| LCP | Inter en hero → crítica | `preload: true` |
| CLS | Cambio de fallback a Inter | `adjustFontFallback: true` ajusta métricas automáticamente |
| FOIT | Flash of Invisible Text | `display: "swap"` — texto visible con fallback inmediatamente |
| Bundle size | 5 pesos × latin subset | next/font descarga solo los caracteres usados (subsetting automático) |

---

## 5. Tokens de Tailwind CSS — Configuración Canónica

```typescript
// tailwind.config.ts
// INSTRUCCIÓN PARA EL AGENTE: Este bloque reemplaza COMPLETAMENTE el bloque
// fontFamily y fontSize del tailwind.config.ts del SPEC TÉCNICO v2.1.

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
        // Sistema mono-familiar: Inter en todos los contextos
        sans:    ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        // Aliases semánticos — todos apuntan a Inter
        display: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        body:    ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        ui:      ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },

      // ── ESCALA TIPOGRÁFICA SEMÁNTICA ─────────────────────────────
      fontSize: {
        // Display / Hero
        "display-2xl": ["3.75rem", { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "700" }], // 60px
        "display-xl":  ["3rem",    { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "700" }], // 48px
        // Headings
        "heading-xl":  ["2.5rem",  { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }], // 40px
        "heading-lg":  ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }], // 36px
        "heading-md":  ["1.75rem", { lineHeight: "1.25", letterSpacing: "-0.005em",fontWeight: "600" }], // 28px
        "heading-sm":  ["1.5rem",  { lineHeight: "1.25", letterSpacing: "-0.005em",fontWeight: "600" }], // 24px
        "heading-xs":  ["1.25rem", { lineHeight: "1.3",  letterSpacing: "0",       fontWeight: "500" }], // 20px
        // Body
        "body-lg":     ["1.125rem",{ lineHeight: "1.6",  letterSpacing: "0" }],  // 18px
        "body-md":     ["1rem",    { lineHeight: "1.5",  letterSpacing: "0" }],  // 16px
        "body-sm":     ["0.875rem",{ lineHeight: "1.45", letterSpacing: "0" }],  // 14px
        // UI / Funcional
        "ui-lg":       ["1rem",    { lineHeight: "1",    letterSpacing: "0.01em" }], // 16px buttons
        "ui-md":       ["0.9375rem",{lineHeight: "1",    letterSpacing: "0.01em" }], // 15px buttons sm
        "ui-sm":       ["0.875rem",{ lineHeight: "1.3",  letterSpacing: "0.005em"}], // 14px labels
        "ui-xs":       ["0.8125rem",{lineHeight: "1.3",  letterSpacing: "0.005em"}], // 13px labels sm
        // Micro
        "caption":     ["0.75rem", { lineHeight: "1.4",  letterSpacing: "0.01em" }], // 12px
        "overline":    ["0.6875rem",{ lineHeight: "1.4", letterSpacing: "0.08em" }],  // 11px
        // KPI (dashboard)
        "kpi-lg":      ["3rem",    { lineHeight: "1",    letterSpacing: "-0.02em", fontWeight: "700" }], // 48px
        "kpi-md":      ["2.5rem",  { lineHeight: "1",    letterSpacing: "-0.02em", fontWeight: "700" }], // 40px
      },

      // ── COLORES DE MARCA (sin cambios vs spec principal) ─────────
      colors: {
        brand: {
          blue: {
            DEFAULT: "#0c88ee",
            50:  "#f0f7ff",
            100: "#e0effe",
            500: "#0c88ee",
            600: "#006cd1",
            700: "#0056ad",
          },
          green: {
            DEFAULT: "#45b072",
            50:  "#f2fcf5",
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

## 6. CSS Custom Properties (Variables)

```css
/* src/app/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─────────────────────────────────────────────────────────────
   VARIABLES TIPOGRÁFICAS — Hotel Río Yurubí · Identidad EDUSYS
   --font-sans es inyectada por next/font en el <html>.
   Las demás variables son tokens de escala para uso en CSS puro
   cuando Tailwind no alcanza (ej: emails, PDFs, print).
   ───────────────────────────────────────────────────────────── */

:root {
  /* Familia base — sobreescrita por next/font */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Aliases semánticos (todos apuntan a --font-sans) */
  --font-display: var(--font-sans);
  --font-body:    var(--font-sans);
  --font-ui:      var(--font-sans);

  /* Escala de tamaños */
  --text-display-2xl: 3.75rem;  /* 60px */
  --text-display-xl:  3rem;     /* 48px */
  --text-heading-xl:  2.5rem;   /* 40px */
  --text-heading-lg:  2.25rem;  /* 36px */
  --text-heading-md:  1.75rem;  /* 28px */
  --text-heading-sm:  1.5rem;   /* 24px */
  --text-heading-xs:  1.25rem;  /* 20px */
  --text-body-lg:     1.125rem; /* 18px */
  --text-body-md:     1rem;     /* 16px */
  --text-body-sm:     0.875rem; /* 14px */
  --text-ui-lg:       1rem;     /* 16px */
  --text-ui-sm:       0.875rem; /* 14px */
  --text-caption:     0.75rem;  /* 12px */
  --text-overline:    0.6875rem;/* 11px */
  --text-kpi-lg:      3rem;     /* 48px */
  --text-kpi-md:      2.5rem;   /* 40px */

  /* Line heights */
  --leading-display: 1.1;
  --leading-heading: 1.2;
  --leading-body:    1.5;
  --leading-ui:      1.0;
  --leading-caption: 1.4;

  /* Letter spacing */
  --tracking-display: -0.02em;
  --tracking-heading: -0.01em;
  --tracking-body:     0em;
  --tracking-ui:       0.01em;
  --tracking-overline: 0.08em;
}

/* ─────────────────────────────────────────────────────────────
   ESTILOS BASE
   ───────────────────────────────────────────────────────────── */

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-body-md);
  font-weight: 400;
  line-height: var(--leading-body);
  letter-spacing: var(--tracking-body);
  color: theme("colors.neutral.900");
  background-color: theme("colors.white");
}

/* Headings — Inter Bold/SemiBold con tracking negativo */
h1 {
  font-family: var(--font-sans);
  font-weight: 700;
  letter-spacing: var(--tracking-display);
  line-height: var(--leading-display);
}

h2, h3 {
  font-family: var(--font-sans);
  font-weight: 600;
  letter-spacing: var(--tracking-heading);
  line-height: var(--leading-heading);
}

h4, h5, h6 {
  font-family: var(--font-sans);
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.3;
}

/* Elementos UI heredan font-sans (ya es el default, explícito para claridad) */
button, input, select, textarea, label {
  font-family: var(--font-sans);
}
```

---

## 7. Clases Utilitarias de Componentes

```css
/* src/app/globals.css — continuación, @layer components */

@layer components {

  /* ── DISPLAY / HERO ─────────────────────────────────────────── */

  .text-hero {
    @apply font-sans text-display-xl md:text-display-2xl
           font-bold leading-none tracking-tighter text-white;
  }

  .text-hero-subtitle {
    @apply font-sans text-body-lg md:text-heading-xs
           font-light leading-loose tracking-normal text-white/85;
  }
  /* EDUSYS tone: "Optimiza la gestión institucional" — directo, claro */

  /* ── HEADINGS DE SECCIÓN (Landing Page) ─────────────────────── */

  .text-section-title {
    @apply font-sans text-heading-lg md:text-heading-xl
           font-semibold leading-tight tracking-tight text-neutral-900;
  }

  .text-section-subtitle {
    @apply font-sans text-body-lg
           font-normal leading-relaxed tracking-normal text-neutral-500;
  }

  /* ── HEADINGS DE CARDS ──────────────────────────────────────── */

  .text-card-title {
    @apply font-sans text-heading-sm
           font-semibold leading-snug tracking-tight text-neutral-900;
  }

  .text-card-body {
    @apply font-sans text-body-md
           font-normal leading-relaxed tracking-normal text-neutral-600;
  }

  .text-card-price {
    @apply font-sans text-heading-md
           font-bold leading-none tracking-tight text-brand-blue;
  }

  /* ── CUERPO DE TEXTO GENERAL ────────────────────────────────── */

  .text-prose {
    @apply font-sans text-body-md
           font-normal leading-relaxed tracking-normal text-neutral-700;
  }

  .text-prose-lg {
    @apply font-sans text-body-lg
           font-normal leading-loose tracking-normal text-neutral-700;
  }

  /* ── BOTONES Y CTA ───────────────────────────────────────────── */
  /* EDUSYS: "Engaging & Motivational" → SemiBold, tracking positivo */

  .text-cta {
    @apply font-sans text-ui-lg
           font-semibold leading-none tracking-wide;
  }

  .text-cta-sm {
    @apply font-sans text-ui-md
           font-semibold leading-none tracking-wide;
  }

  /* ── FORMULARIOS Y UI FUNCIONAL ─────────────────────────────── */

  .text-label {
    @apply font-sans text-ui-sm
           font-medium leading-snug tracking-wide text-neutral-700;
  }

  .text-input {
    @apply font-sans text-body-md
           font-normal leading-relaxed tracking-normal text-neutral-900;
  }

  .text-placeholder {
    @apply font-sans text-body-md
           font-normal tracking-normal text-neutral-400;
  }

  .text-helper {
    @apply font-sans text-caption
           font-normal leading-normal tracking-wide text-neutral-500;
  }

  .text-error {
    @apply font-sans text-caption
           font-medium leading-normal tracking-wide text-red-600;
  }

  .text-success {
    @apply font-sans text-caption
           font-medium leading-normal tracking-wide text-green-600;
  }

  /* ── DASHBOARD / PANEL INTERNO ──────────────────────────────── */
  /* EDUSYS: "Real-Time Insights" → datos claros, jerarquía fuerte */

  .text-dashboard-title {
    @apply font-sans text-heading-sm md:text-heading-md
           font-semibold leading-snug tracking-tight text-neutral-900;
  }

  .text-kpi-value {
    @apply font-sans text-kpi-md md:text-kpi-lg
           font-bold leading-none tracking-tighter text-neutral-900;
  }

  .text-kpi-label {
    @apply font-sans text-caption
           font-semibold leading-snug tracking-widest text-neutral-500 uppercase;
  }

  .text-table-header {
    @apply font-sans text-caption
           font-semibold leading-normal tracking-wider text-neutral-500 uppercase;
  }

  .text-table-cell {
    @apply font-sans text-body-sm
           font-normal leading-relaxed tracking-normal text-neutral-800;
  }

  .text-badge {
    @apply font-sans text-caption
           font-semibold leading-none tracking-wide uppercase;
  }

  /* ── MICROCOPY Y CAPTIONS ───────────────────────────────────── */

  .text-caption-text {
    @apply font-sans text-caption
           font-normal leading-normal tracking-wide text-neutral-500;
  }

  .text-overline {
    @apply font-sans text-overline
           font-semibold leading-normal tracking-widest text-neutral-400 uppercase;
  }

  /* ── REVIEWS / TESTIMONIOS ───────────────────────────────────── */
  /* Sin italic — Inter en light transmite calidez sin ornamento */

  .text-review-quote {
    @apply font-sans text-body-lg
           font-light leading-loose tracking-normal text-neutral-700;
  }

  .text-review-author {
    @apply font-sans text-ui-sm
           font-semibold leading-snug tracking-wide text-neutral-900;
  }

  /* ── NAVEGACIÓN ──────────────────────────────────────────────── */

  .text-nav-link {
    @apply font-sans text-body-sm
           font-medium leading-none tracking-normal text-neutral-700
           hover:text-brand-blue transition-colors;
  }

  .text-nav-cta {
    @apply font-sans text-body-sm
           font-semibold leading-none tracking-wide;
  }

  /* ── PROMOCIONES / PRECIOS ───────────────────────────────────── */

  .text-promo-title {
    @apply font-sans text-heading-sm md:text-heading-md
           font-semibold leading-tight tracking-tight text-neutral-900;
  }

  .text-price-original {
    @apply font-sans text-body-sm
           font-normal leading-none tracking-normal text-neutral-400 line-through;
  }

  .text-price-discount {
    @apply font-sans text-heading-sm
           font-bold leading-none tracking-tight text-green-600;
  }

  /* ── ESTADOS DE RESERVA (badges específicos del proyecto) ────── */

  .text-status-pending {
    @apply text-badge text-yellow-700;
  }

  .text-status-confirmed {
    @apply text-badge text-green-700;
  }

  .text-status-rejected {
    @apply text-badge text-red-700;
  }

  .text-status-cancelled {
    @apply text-badge text-neutral-500;
  }

  .text-status-completed {
    @apply text-badge text-blue-700;
  }
}
```

---

## 8. Reglas de Uso (ADTs — Architectural Design Tokens)

### ADT-001: Una familia, diferenciación por peso

La diferenciación jerárquica se logra **exclusivamente con `font-weight`**, no con familias distintas.

| Jerarquía | Peso correcto | Peso incorrecto |
|-----------|--------------|----------------|
| H1 / Display / KPI | `font-bold` (700) | `font-semibold` o menos |
| H2 / H3 / Títulos de sección | `font-semibold` (600) | `font-bold` o `font-medium` |
| H4 / Nav / Labels | `font-medium` (500) | `font-semibold` |
| Cuerpo / Párrafos | `font-normal` (400) | Cualquier otro |
| Subtítulos hero / Taglines | `font-light` (300) | `font-normal` o más |

### ADT-002: Tracking negativo en Display, positivo en UI

| Contexto | Tracking | Tailwind |
|----------|---------|---------|
| H1 / Display / KPI | -0.02em | `tracking-tighter` |
| H2 / H3 | -0.01em | `tracking-tight` |
| Body | 0 | `tracking-normal` |
| Labels / CTAs | +0.01em | `tracking-wide` |
| Overlines / Badges | +0.08em | `tracking-widest` |

### ADT-003: Mínimo de tamaño visible — 12px

Ningún texto visible al usuario puede ser menor a `text-xs` (12px / 0.75rem). Textos menores solo en metadatos no visibles o `aria-label`.

### ADT-004: `font-light` (300) — uso restringido

El peso 300 solo se usa en:
- Subtítulos del hero sobre imagen (`text-hero-subtitle`)
- Citas y testimonios (`text-review-quote`)
- Taglines decorativas

No usar `font-light` en cuerpo de texto funcional, formularios, dashboard ni tablas.

### ADT-005: No usar `italic`

Inter tiene variante italic pero **no está cargada en este proyecto** (`style: ["normal"]` en `fonts.ts`). No aplicar `italic` a ningún elemento. Si se necesita énfasis semántico, usar `font-semibold` o color.

### ADT-006: No redefinir tipografía en componentes

Los componentes consumen las clases utilitarias de la Sección 7. No definen sus propias combinaciones.

```tsx
// ✅ CORRECTO
<h1 className="text-hero">Tu refugio en Yaracuy</h1>

// ❌ INCORRECTO
<h1 className="font-sans text-6xl font-bold leading-none tracking-tighter text-white">
  Tu refugio en Yaracuy
</h1>
```

### ADT-007: `adjustFontFallback: true` — no deshabilitar

La opción `adjustFontFallback` en `fonts.ts` ajusta las métricas del fallback (-apple-system, etc.) para que el salto visual al cargar Inter sea imperceptible. No deshabilitar — es la principal defensa contra CLS tipográfico.

### ADT-008: Aliases semánticos son intercambiables

`font-sans`, `font-display`, `font-body` y `font-ui` apuntan todos a Inter. Se pueden usar indistintamente en Tailwind. La preferencia es usar `font-sans` como clase base y los aliases cuando mejoran la legibilidad semántica del JSX.

---

## 9. Aplicación por Componente del Proyecto

### 9.1 Landing Page — Componentes Públicos

| Componente | Elemento | Clase Utilitaria |
|-----------|----------|-----------------|
| `HeroSection` | Título principal | `text-hero` |
| `HeroSection` | Subtítulo | `text-hero-subtitle` |
| `HeroSection` | Botón CTA principal | `text-cta` |
| `RoomTypeGrid` | Título de sección | `text-section-title` |
| `RoomTypeGrid` | Bajada de sección | `text-section-subtitle` |
| `RoomCard` | Nombre de habitación | `text-card-title` |
| `RoomCard` | Descripción | `text-card-body` |
| `RoomCard` | Precio por noche | `text-card-price` |
| `RoomCard` | Botón "Reservar" | `text-cta-sm` |
| `RestaurantSection` | Título | `text-section-title` |
| `RestaurantSection` | Párrafo descriptivo | `text-prose-lg` |
| `PoolSection` | Normas / restricciones | `text-prose` |
| `PoolSection` | Precio | `text-card-price` |
| `MeetingRoomSection` | Título | `text-section-title` |
| `MeetingRoomSection` | Lista equipamiento | `text-prose` |
| `ReviewsCarousel` | Cita del huésped | `text-review-quote` |
| `ReviewsCarousel` | Nombre del autor | `text-review-author` |
| `PromotionBanner` | Título de oferta | `text-promo-title` |
| `PromotionBanner` | Precio original | `text-price-original` |
| `PromotionBanner` | Precio con descuento | `text-price-discount` |
| `ContactSection` | Título | `text-section-title` |
| `ContactSection` | Labels del form | `text-label` |
| `ContactSection` | Inputs | `text-input` |
| `Footer` | Links | `text-nav-link` |
| `Footer` | Copyright | `text-caption-text` |
| `Header` / Nav | Links | `text-nav-link` |
| `Header` / Nav | Botón "Reservar" | `text-nav-cta` |

### 9.2 Wizard de Reserva (`BookingWizard`)

| Elemento | Clase Utilitaria |
|----------|-----------------|
| Título del paso | `text-dashboard-title` |
| Indicador de paso ("Paso 1 de 3") | `text-caption-text` |
| Labels de campos | `text-label` |
| Valores de inputs | `text-input` |
| Error de validación | `text-error` |
| Texto de ayuda | `text-helper` |
| Resumen precio total | `text-card-price` |
| Botones "Siguiente" / "Confirmar" | `text-cta` |
| Instrucciones de pago | `text-prose` |

### 9.3 Dashboard — Panel Interno

| Elemento | Clase Utilitaria |
|----------|-----------------|
| Título de página ("Reservas") | `text-dashboard-title` |
| Valor de KPI card | `text-kpi-value` |
| Label de KPI card | `text-kpi-label` |
| Headers de tabla | `text-table-header` |
| Celdas de tabla | `text-table-cell` |
| Badge PENDING | `text-status-pending` |
| Badge CONFIRMED | `text-status-confirmed` |
| Badge REJECTED | `text-status-rejected` |
| Badge CANCELLED | `text-status-cancelled` |
| Badge COMPLETED | `text-status-completed` |
| Labels de formulario (Settings) | `text-label` |
| Nombre del usuario (Sidebar) | `font-sans text-body-sm font-semibold` |
| Links del Sidebar | `text-nav-link` |
| Descripción en bitácora | `text-table-cell` |

### 9.4 Emails Transaccionales

Inter no está garantizada en clientes de email. Usar fallback stack en inline styles.

```typescript
// src/lib/email/typography.ts
// Tokens tipográficos para React Email — inline styles obligatorios

export const emailTypography = {
  h1: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    fontSize: "28px",
    fontWeight: "700",
    lineHeight: "1.15",
    letterSpacing: "-0.01em",
    color: "#111827",
  },
  h2: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    fontSize: "20px",
    fontWeight: "600",
    lineHeight: "1.25",
    letterSpacing: "-0.005em",
    color: "#111827",
  },
  body: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "1.5",
    letterSpacing: "0",
    color: "#374151",
  },
  label: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    fontSize: "11px",
    fontWeight: "600",
    lineHeight: "1.4",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#6B7280",
  },
  button: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    fontSize: "15px",
    fontWeight: "600",
    lineHeight: "1",
    letterSpacing: "0.01em",
  },
  small: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    fontSize: "13px",
    fontWeight: "400",
    lineHeight: "1.4",
    color: "#9CA3AF",
  },
} as const;
```

---

## 10. Criterios de Aceptación Tipográfica

| ID | Criterio | Verificación |
|----|----------|-------------|
| TYP-01 | Inter está cargada desde next/font, no desde `<link>` externo | No existe `<link href="fonts.googleapis.com">` en el HTML generado |
| TYP-02 | La variable `--font-sans` está presente en `<html>` | `getComputedStyle(document.documentElement).getPropertyValue("--font-sans")` no vacío |
| TYP-03 | El H1 del hero usa Inter 700 | `getComputedStyle(h1).fontFamily` incluye "Inter" · `fontWeight === "700"` |
| TYP-04 | Los párrafos de cuerpo usan Inter 400 | `getComputedStyle(p).fontWeight === "400"` |
| TYP-05 | Los botones CTA usan Inter 600 | `getComputedStyle(button).fontWeight === "600"` |
| TYP-06 | Inter tiene `font-display: swap` | DevTools Network → response font-face incluye `swap` |
| TYP-07 | Los 5 pesos están cargados (300–700) | DevTools Network → 5 requests `.woff2` de Inter |
| TYP-08 | Ningún elemento tiene `font-style: italic` | `document.querySelectorAll("[style*='italic']").length === 0` |
| TYP-09 | Ningún texto visible es menor a 12px | `document.querySelectorAll("*")` → ningún `fontSize < 12px` en elementos visibles |
| TYP-10 | Los KPI values usan Inter 700 | `getComputedStyle(kpiEl).fontWeight === "700"` |
| TYP-11 | Los badges de estado tienen `text-transform: uppercase` | `getComputedStyle(badgeEl).textTransform === "uppercase"` |
| TYP-12 | LCP no regresiona tras carga de Inter | Lighthouse performance ≥ 90 con Inter activa |
| TYP-13 | CLS < 0.1 — el fallback no causa salto visual notable | Lighthouse CLS < 0.1 en campo (ajustado por `adjustFontFallback`) |
| TYP-14 | No existe ningún `@font-face` manual en el proyecto | `grep -r "@font-face" src/` → sin resultados |

---

## 11. Anti-patrones Prohibidos

```tsx
// ❌ PROHIBIDO: Importar Google Fonts vía <link> en layout (next/font lo hace mejor)
// En src/app/[locale]/layout.tsx:
<link href="https://fonts.googleapis.com/css2?family=Inter..." rel="stylesheet" /> // ← PROHIBIDO

// ❌ PROHIBIDO: @font-face manual con URL de Google Fonts stylesheet
@font-face {
  src: url('https://fonts.googleapis.com/css2?family=Inter...') format('google-fonts');
} // ← PROHIBIDO (URL incorrecta + formato inválido)

// ❌ PROHIBIDO: Re-importar Inter en componentes individuales
// En src/components/public/hero/HeroSection.tsx:
import { Inter } from "next/font/google"; // ← PROHIBIDO fuera de fonts.ts

// ❌ PROHIBIDO: font-light (300) en cuerpo funcional o dashboard
<p className="font-light text-base">Descripción de la habitación...</p> // ← en tarjetas o tablas

// ❌ PROHIBIDO: italic (variante no cargada)
<em className="italic">Nota importante</em> // ← italic no está en fonts.ts

// ❌ PROHIBIDO: Mezclar fuentes serif en cualquier elemento
<h1 className="font-['Georgia']">...</h1>
<h2 style={{ fontFamily: "Playfair Display, serif" }}>...</h2> // ← sistema anterior eliminado

// ❌ PROHIBIDO: font-black (900) — peso no cargado
<h1 className="font-black">...</h1> // 900 no está en weights: ["300","400","500","600","700"]

// ❌ PROHIBIDO: Texto visible menor a 12px
<span className="text-[10px]">Términos y condiciones</span>

// ❌ PROHIBIDO: Definir combinaciones tipográficas ad hoc en componentes
<button className="font-sans text-base font-semibold leading-none tracking-wide">
  Reservar
</button>
// Usar en su lugar:
<button className="text-cta">Reservar</button>

// ❌ PROHIBIDO: tracking-normal en Display/H1 (requiere tracking-tighter)
<h1 className="text-display-xl font-bold tracking-normal">...</h1>
```

---

## Apéndice A: Comparativa v1.0 → v2.0

| Aspecto | v1.0 (Playfair + Lora + Nunito) | v2.0 (Inter) |
|---------|--------------------------------|--------------|
| Número de familias | 3 | 1 |
| Identidad visual | Hotelería boutique, serif clásica | SaaS educativo moderno, sans-serif |
| Pesos cargados | 4–5 por familia (12+ variantes) | 5 pesos de Inter |
| Diferenciación jerárquica | Por familia + peso | Solo por peso |
| Italic disponible | Sí (Playfair + Lora) | No (no cargada) |
| Carga de performance | 3 dominios de fuentes | 1 familia, self-hosted via next/font |
| Coherencia con EDUSYS | Baja — serif clásica vs. SaaS moderno | Alta — sans-serif funcional y clara |

## Apéndice B: Fuentes Alternativas Aprobadas

Solo usar si el cliente rechaza Inter explícitamente.

| Inter | Alternativa | Diferencia |
|-------|-------------|-----------|
| Inter | **Plus Jakarta Sans** | Más geométrica, personalidad más distintiva |
| Inter | **DM Sans** | Más redondeada, más cálida |
| Inter | **Outfit** | Más moderna, menos neutral |

Cualquier sustitución requiere actualizar: `fonts.ts` (nombre del import), `tailwind.config.ts` (fallback stack), `globals.css` (variable `--font-sans`), y este documento (Sección 1.1).

---

*Documento generado para consumo directo por agentes de IA de generación de código.*  
*Versión: 2.0 · Reemplaza SPEC_TIPOGRAFIA v1.0 (Playfair + Lora + Nunito)*  
*Sistema tipográfico: Inter 300/400/500/600/700 · Identidad visual EDUSYS*  
*Toda decisión tipográfica del proyecto se deriva de este documento. No existen TODOs ni placeholders sin decisión tomada.*
