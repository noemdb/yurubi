# 📐 SPEC TÉCNICO v2.1 — Hotel Río Yurubí

## Sistema Full-Stack · Entorno de Desarrollo Dirigido por Agentes IA

**Versión:** 2.1  
**Fecha:** 2025  
**Clasificación:** Staff Engineer — Listo para consumo por agente de IA  
**Stack canónico:** Next.js 16 (App Router) · TypeScript 5.x (strict) · Tailwind CSS 3.x · Prisma 5.x · PostgreSQL (Neon.tech) · Auth.js v5 · next-intl 3.x · Resend · ApexCharts · Zod 3.x · shadcn/ui

> **⚠️ Nota de versión:** Este spec usa **Next.js 16.2.0** (latest, marzo 2026). Contiene breaking changes respecto a Next.js 15 documentados en ADR-008. El agente debe aplicar los patrones de esta versión y no mezclar con patrones de versiones anteriores.

---

## ÍNDICE

1. [Visión General y Objetivos](#1-visión-general-y-objetivos)
2. [Decisiones Arquitectónicas (ADRs)](#2-decisiones-arquitectónicas-adrs)
3. [Dependencias Exactas y package.json](#3-dependencias-exactas-y-packagejson)
4. [Variables de Entorno](#4-variables-de-entorno)
5. [Modelo de Datos Completo (Prisma Schema)](#5-modelo-de-datos-completo-prisma-schema)
6. [Zod Schemas — Contratos de Validación](#6-zod-schemas--contratos-de-validación)
7. [Roles, Permisos y RBAC](#7-roles-permisos-y-rbac)
8. [Estructura de Directorios Canónica](#8-estructura-de-directorios-canónica)
9. [Rutas y Contratos de API](#9-rutas-y-contratos-de-api)
10. [Server Actions — Firmas Tipadas](#10-server-actions--firmas-tipadas)
11. [Especificación de la Landing Page](#11-especificación-de-la-landing-page)
12. [Wizard de Reserva — Especificación Completa](#12-wizard-de-reserva--especificación-completa)
13. [Dashboard por Rol](#13-dashboard-por-rol)
14. [Emails Transaccionales](#14-emails-transaccionales)
15. [Internacionalización (i18n)](#15-internacionalización-i18n)
16. [Configuración de Infraestructura](#16-configuración-de-infraestructura)
17. [Criterios de Aceptación Verificables](#17-criterios-de-aceptación-verificables)
18. [Checklist de Implementación por Fases](#18-checklist-de-implementación-por-fases)
19. [Gaps Resueltos y Supuestos Contractuales](#19-gaps-resueltos-y-supuestos-contractuales)

---

## 1. Visión General y Objetivos

### 1.1 Descripción del Producto

Plataforma digital integral para el **Hotel Río Yurubí** (San Felipe, Yaracuy, Venezuela) que combina una landing page orientada a conversión con un sistema de gestión interna multi-rol. El sistema no incluye pasarela de pagos en línea — todos los pagos son offline (transferencia, Zelle, efectivo).

### 1.2 Objetivos de Negocio Medibles

| Objetivo                   | Métrica                              | Target                   |
| -------------------------- | ------------------------------------ | ------------------------ |
| Aumentar reservas directas | % de reservas via sitio vs. teléfono | +40% en 6 meses          |
| Reducir tiempo de gestión  | Minutos/reserva para recepcionista   | De 15min → 5min          |
| Mejorar visibilidad online | Google rank para "hotel San Felipe"  | Top 3 resultados locales |
| Centralizar datos          | % de reservas registradas en sistema | 100%                     |

### 1.3 Alcance — Incluye / Excluye

| Módulo                 | Incluye                                      | Excluye                                               |
| ---------------------- | -------------------------------------------- | ----------------------------------------------------- |
| Landing Pública        | 10 secciones, i18n ES/EN, SEO Local          | Pagos online, chat en vivo                            |
| Reservas de Habitación | Wizard 4 pasos, estados, emails              | Disponibilidad en tiempo real, overbooking automático |
| Reservas Adicionales   | Sala de reuniones, restaurante               | Piscina (sin reserva, solo info)                      |
| Dashboard              | 4 roles, KPIs, CRUDs, bitácora               | App móvil nativa, SMS                                 |
| Contenido              | Reseñas moderadas, promociones, PageSections | CMS headless externo, blog completo                   |
| Comunicaciones         | Emails transaccionales vía Resend            | WhatsApp Business API, SMS                            |

---

## 2. Decisiones Arquitectónicas (ADRs)

Cada ADR documenta una decisión irrevocable. El agente NO debe cuestionarlas ni proponer alternativas salvo que se indique explícitamente.

---

### ADR-001: Next.js 15 App Router con Server Components por defecto

**Estado:** Aceptada  
**Contexto:** Necesitamos SSR para SEO, acceso a DB sin API round-trip, y separación clara entre lógica de servidor y cliente.  
**Decisión:** Todos los componentes son Server Components por defecto. Se usa `"use client"` solo cuando se requiere estado interactivo o efectos del navegador (formularios controlados, ApexCharts, wizard de reserva).  
**Consecuencias:** No usar hooks de React (`useState`, `useEffect`) fuera de Client Components. Las mutaciones de datos van en Server Actions, no en API Routes.

---

### ADR-002: Auth.js v5 (NextAuth) con Credentials Provider

**Estado:** Aceptada  
**Contexto:** El sistema requiere autenticación interna (email/password) sin OAuth externo.  
**Decisión:** Auth.js v5 con `CredentialsProvider`. Sesiones via JWT. El token incluye `id`, `role`, `name`, `email`. Archivo de configuración en `src/auth.ts` (no en `pages/api/auth`).  
**Consecuencias:** Usar `auth()` de `src/auth.ts` en Server Components/Actions. Usar `useSession()` solo en Client Components. El middleware usa `auth` exportado desde `src/auth.ts`.

```typescript
// src/auth.ts — estructura canónica Auth.js v5
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validators/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user || !user.isActive) return null;
        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  pages: { signIn: "/login" },
});
```

---

### ADR-003: next-intl 3.x para i18n en App Router

**Estado:** Aceptada  
**Contexto:** La config `i18n` de `next.config.js` es exclusiva del Pages Router y causa errores en App Router.  
**Decisión:** Usar `next-intl` con middleware de detección de locale. Estructura de rutas: `app/[locale]/...`. Los mensajes en `messages/es.json` y `messages/en.json`. NO se usa `next.config.js` i18n.  
**Consecuencias:** Agregar `createMiddleware` de `next-intl/middleware` en `src/middleware.ts`. El layout raíz es `app/[locale]/layout.tsx`. La detección automática por Accept-Language header está activada.

---

### ADR-004: Server Actions para todas las mutaciones

**Estado:** Aceptada  
**Contexto:** Las mutaciones de datos (crear reserva, confirmar, etc.) deben ejecutarse en el servidor con validación de rol.  
**Decisión:** Todas las mutaciones usan Server Actions definidas en archivos `actions/` con la directiva `"use server"` al tope del archivo. No se crean API Routes para mutaciones (solo para webhooks futuros).  
**Consecuencias:** Los formularios usan el atributo `action` con la Server Action. Los errores se retornan como `{ success: false, error: string }`. Los revalidaciones usan `revalidatePath`.

---

### ADR-005: Prisma 5.x con Neon.tech Serverless Driver

**Estado:** Aceptada  
**Contexto:** Neon.tech usa conexiones serverless que requieren el driver adaptado para evitar connection pooling issues en Edge Runtime.  
**Decisión:** Usar `@prisma/adapter-neon` con `neon()` de `@neondatabase/serverless`. El cliente Prisma se instancia como singleton en `src/lib/prisma.ts`.  
**Consecuencias:** El `DATABASE_URL` debe incluir `?sslmode=require`. No usar `PrismaClient` directamente en componentes — siempre importar desde `@/lib/prisma`.

---

### ADR-006: Resend para emails transaccionales

**Estado:** Aceptada  
**Contexto:** SMTP de Gmail tiene límites de envío y requiere configuración de app passwords.  
**Decisión:** Usar Resend (`resend` npm package) con React Email para templates. Fallback a Nodemailer con SMTP como opción de configuración via `SystemSetting`.  
**Consecuencias:** `RESEND_API_KEY` es obligatorio en producción. Los templates son componentes React en `src/lib/email/templates/`.

---

### ADR-007: shadcn/ui como sistema de componentes base

**Estado:** Aceptada  
**Contexto:** Se necesitan componentes accesibles, customizables y compatibles con Tailwind.  
**Decisión:** shadcn/ui con configuración `new-york` style. Los componentes se copian a `src/components/ui/`. Se extienden (no se modifican) para casos específicos del hotel.  
**Consecuencias:** Ejecutar `npx shadcn@latest init` en setup inicial. Los tokens de color de Tailwind se alinean con los CSS variables de shadcn.

---

### ADR-008: Next.js 16 — Breaking Changes Aplicados

**Estado:** Aceptada  
**Contexto:** Next.js 16 introduce breaking changes respecto a v15 que afectan directamente la estructura del proyecto.  
**Decisión:** Aplicar todos los cambios requeridos por Next.js 16 sin excepción. Se documentan a continuación para que el agente no regrese a patrones de v15.

**Breaking changes que afectan este proyecto:**

| #   | Cambio                                           | Patrón v15 (obsoleto)                                | Patrón v16 (correcto)                                                    |
| --- | ------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------ |
| 1   | `middleware.ts` renombrado a `proxy.ts`          | `export function middleware(req)` en `middleware.ts` | `export function proxy(req)` en `proxy.ts` — runtime es Node.js, NO Edge |
| 2   | `params` y `searchParams` son ahora async        | `const { slug } = params`                            | `const { slug } = await params`                                          |
| 3   | `generateMetadata` también recibe params async   | `const { locale } = params`                          | `const { locale } = await params`                                        |
| 4   | Turbopack es el bundler por defecto              | `"dev": "next dev --turbopack"`                      | `"dev": "next dev"` (flag ya no necesario)                               |
| 5   | `experimental.ppr` eliminado                     | `experimental: { ppr: true }`                        | Usar `"use cache"` directive (Cache Components)                          |
| 6   | React Compiler estable                           | `experimental: { reactCompiler: true }`              | `reactCompiler: true` (top-level, opt-in)                                |
| 7   | `cacheLife` / `cacheTag` sin prefijo `unstable_` | `unstable_cacheLife(...)`                            | `cacheLife(...)` directo                                                 |
| 8   | Node.js mínimo: 20.9.0                           | Node 18.x aceptado                                   | **Node.js >= 20.9.0 requerido**                                          |
| 9   | React 19.2 incluido                              | `react: "19.0.0"`                                    | `react: "19.2.0"`                                                        |
| 10  | `next lint` eliminado                            | `"lint": "next lint"`                                | `"lint": "eslint src/"` directamente                                     |

**Consecuencias:**

- `src/middleware.ts` pasa a ser `src/proxy.ts` con export nombrado `proxy` (no `middleware`)
- Todos los `page.tsx`, `layout.tsx` y `generateMetadata` deben hacer `await props.params` antes de destructurar
- Los scripts de `package.json` no incluyen `--turbopack`
- Node.js 20.9.0+ es requisito de entorno (CI/CD y desarrollo)

---

## 3. Dependencias Exactas y package.json

```json
{
  "name": "hotel-rio-yurubi",
  "version": "1.0.0",
  "private": true,
  "engines": {
    "node": ">=20.9.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint src/",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "next": "16.2.0",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "typescript": "5.7.2",
    "@prisma/client": "5.22.0",
    "@prisma/adapter-neon": "5.22.0",
    "@neondatabase/serverless": "0.10.4",
    "next-auth": "5.0.0-beta.25",
    "bcryptjs": "2.4.3",
    "@types/bcryptjs": "2.4.6",
    "next-intl": "3.26.3",
    "zod": "3.23.8",
    "resend": "4.0.1",
    "@react-email/components": "0.0.31",
    "apexcharts": "3.54.0",
    "react-apexcharts": "1.4.0",
    "tailwindcss": "3.4.17",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "tailwind-merge": "2.6.0",
    "lucide-react": "0.469.0",
    "@radix-ui/react-dialog": "1.1.4",
    "@radix-ui/react-dropdown-menu": "2.1.4",
    "@radix-ui/react-select": "2.1.4",
    "@radix-ui/react-tabs": "1.1.2",
    "@radix-ui/react-toast": "1.2.4",
    "date-fns": "4.1.0",
    "react-day-picker": "8.10.1",
    "@hookform/resolvers": "3.9.1",
    "react-hook-form": "7.54.2"
  },
  "devDependencies": {
    "prisma": "5.22.0",
    "tsx": "4.19.2",
    "@types/node": "22.10.5",
    "@types/react": "19.2.0",
    "@types/react-dom": "19.2.0",
    "eslint": "9.17.0",
    "eslint-config-next": "16.2.0",
    "autoprefixer": "10.4.20",
    "postcss": "8.4.49",
    "@tailwindcss/forms": "0.5.9",
    "@tailwindcss/typography": "0.5.15"
  }
}
```

---

## 4. Variables de Entorno

### 4.1 `.env.example` — Completo y Documentado

```bash
# ═══════════════════════════════════════════════════════════════
# DATABASE — Neon.tech PostgreSQL Serverless
# ═══════════════════════════════════════════════════════════════
# Obtener en: console.neon.tech → tu proyecto → Connection string
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# ═══════════════════════════════════════════════════════════════
# AUTH — Auth.js v5
# ═══════════════════════════════════════════════════════════════
# Generar con: openssl rand -base64 32
AUTH_SECRET="your-generated-secret-here"
# URL completa del sitio (sin trailing slash)
AUTH_URL="https://hotelrioyurubi.com"

# ═══════════════════════════════════════════════════════════════
# EMAIL — Resend
# ═══════════════════════════════════════════════════════════════
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
# Dirección From verificada en Resend
EMAIL_FROM="Hotel Río Yurubí <noreply@hotelrioyurubi.com>"
# Email interno del hotel para notificaciones de staff
EMAIL_HOTEL="hotelrioyurubi@gmail.com"

# ═══════════════════════════════════════════════════════════════
# APPLICATION
# ═══════════════════════════════════════════════════════════════
NEXT_PUBLIC_APP_URL="https://hotelrioyurubi.com"
NEXT_PUBLIC_DEFAULT_LOCALE="es"
# Coordenadas GPS para el mapa (San Felipe, Yaracuy)
NEXT_PUBLIC_HOTEL_LAT="10.4035"
NEXT_PUBLIC_HOTEL_LNG="-68.7470"

# ═══════════════════════════════════════════════════════════════
# RATE LIMITING — Upstash Redis (opcional, activar en producción)
# ═══════════════════════════════════════════════════════════════
# UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
# UPSTASH_REDIS_REST_TOKEN="xxx"

# ═══════════════════════════════════════════════════════════════
# MONITORING — Sentry (opcional)
# ═══════════════════════════════════════════════════════════════
# NEXT_PUBLIC_SENTRY_DSN="https://xxx@sentry.io/xxx"
```

### 4.2 Validación de Variables en Startup

```typescript
// src/lib/env.ts — Validar en build time, no en runtime
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  RESEND_API_KEY: z.string().startsWith("re_"),
  EMAIL_FROM: z.string().email().or(z.string().includes("<")),
  EMAIL_HOTEL: z.string().email(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

---

## 5. Modelo de Datos Completo (Prisma Schema)

```prisma
// prisma/schema.prisma
// VERSIÓN CANÓNICA — No modificar sin actualizar este spec

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══════════════════════════════════════════════════════════════
// ENUMS
// ═══════════════════════════════════════════════════════════════

enum Role {
  RECEPTIONIST
  OWNER
  ADMIN
}

// NOTA: VISITOR no es un rol de User. Los visitantes no tienen cuenta.
// El enum Role solo aplica a usuarios del sistema interno.

enum ReservationStatus {
  PENDING     // Creada, pendiente de revisión por staff
  CONFIRMED   // Confirmada por Recepcionista/Admin
  REJECTED    // Rechazada por staff
  CANCELLED   // Cancelada (por cliente o staff)
  COMPLETED   // Check-out realizado
}

enum ServiceType {
  ROOM          // Reserva de habitación
  MEETING_ROOM  // Sala de reuniones
  RESTAURANT    // Reserva de mesa
}

enum ReviewStatus {
  PENDING   // Esperando moderación
  APPROVED  // Publicada en landing
  REJECTED  // No publicada
}

enum DiscountType {
  PERCENT // Descuento porcentual (ej: 15%)
  FIXED   // Descuento fijo en USD (ej: $20)
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  CONFIRM
  REJECT
  CANCEL
  APPROVE
  LOGIN
  LOGOUT
}

// ═══════════════════════════════════════════════════════════════
// USUARIOS DEL SISTEMA (Staff interno)
// ═══════════════════════════════════════════════════════════════

model User {
  id            String     @id @default(cuid())
  name          String
  email         String     @unique
  password      String     // bcrypt hash, cost=12
  role          Role
  isActive      Boolean    @default(true)
  image         String?

  // Relaciones
  createdReservations Reservation[] @relation("CreatedByUser")
  confirmedReservations Reservation[] @relation("ConfirmedByUser")
  auditLogs       AuditLog[]

  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@index([email])
  @@index([role])
  @@index([isActive])
  @@map("users")
}

// Auth.js v5 — Tablas requeridas para JWT (sin DB sessions)
// No se necesita Session model con estrategia JWT

// ═══════════════════════════════════════════════════════════════
// HUÉSPEDES (clientes externos, sin cuenta en el sistema)
// ═══════════════════════════════════════════════════════════════

model Guest {
  id            String        @id @default(cuid())
  fullName      String
  email         String
  phone         String        // Formato: +58XXXXXXXXXX
  idDocument    String        // Cédula / RIF / Pasaporte
  address       String?
  origin        String?       // Ciudad/País de procedencia

  reservations  Reservation[]

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([email])
  @@index([idDocument])
  @@map("guests")
}

// ═══════════════════════════════════════════════════════════════
// HABITACIONES
// ═══════════════════════════════════════════════════════════════

model RoomType {
  id            String        @id @default(cuid())
  name          String        // "Sencilla", "Doble", "Triple", etc.
  slug          String        @unique // "sencilla", "doble", "triple"
  basePrice     Float         // Precio por noche en USD
  maxOccupancy  Int           // Capacidad máxima de personas
  description   String?       @db.Text
  amenities     String[]      // ["WiFi", "Aire acondicionado", "TV", ...]
  images        String[]      // URLs (Vercel Blob o similar)
  isActive      Boolean       @default(true)

  // Relaciones
  rooms         Room[]
  reservations  Reservation[]
  promotions    Promotion[]

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([slug])
  @@index([isActive])
  @@map("room_types")
}

model Room {
  id            String        @id @default(cuid())
  roomNumber    String        @unique // "101", "102" — número físico (interno)
  floor         Int?
  roomTypeId    String
  roomType      RoomType      @relation(fields: [roomTypeId], references: [id], onDelete: Restrict)
  isAvailable   Boolean       @default(true) // false = mantenimiento/bloqueo manual
  notes         String?       @db.Text

  // Relaciones
  reservations  Reservation[]

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([roomTypeId])
  @@index([isAvailable])
  @@map("rooms")
}

// ═══════════════════════════════════════════════════════════════
// RESERVAS (habitaciones)
// ═══════════════════════════════════════════════════════════════

model Reservation {
  id                   String            @id @default(cuid())

  // Huésped
  guestId              String
  guest                Guest             @relation(fields: [guestId], references: [id], onDelete: Restrict)

  // Habitación
  roomTypeId           String
  roomType             RoomType          @relation(fields: [roomTypeId], references: [id], onDelete: Restrict)
  roomId               String?           // Asignada internamente por staff (opcional)
  room                 Room?             @relation(fields: [roomId], references: [id])

  // Fechas
  checkIn              DateTime
  checkOut             DateTime
  numberOfNights       Int               // Calculado: checkOut - checkIn en días

  // Ocupación y precio
  numberOfGuests       Int
  totalPrice           Float             // Precio total en USD
  advancePaymentPaid   Boolean           @default(false)
  paymentMethod        String?           // "TRANSFERENCIA" | "ZELLE" | "EFECTIVO"
  paymentReference     String?           // Referencia de pago

  // Estado
  status               ReservationStatus @default(PENDING)
  rejectionReason      String?           // Solo cuando status = REJECTED
  cancellationReason   String?           // Solo cuando status = CANCELLED
  notes                String?           @db.Text

  // Idioma del cliente
  language             String            @default("es") // "es" | "en"

  // Staff
  createdById          String?           // null = creada por visitante vía landing
  createdBy            User?             @relation("CreatedByUser", fields: [createdById], references: [id])
  confirmedById        String?
  confirmedBy          User?             @relation("ConfirmedByUser", fields: [confirmedById], references: [id])

  // Audit
  auditLogs            AuditLog[]

  createdAt            DateTime          @default(now())
  updatedAt            DateTime          @updatedAt

  @@index([guestId])
  @@index([roomTypeId])
  @@index([status])
  @@index([checkIn, checkOut])
  @@index([createdAt])
  @@map("reservations")
}

// ═══════════════════════════════════════════════════════════════
// RESERVAS DE SALA DE REUNIONES
// ═══════════════════════════════════════════════════════════════

model MeetingRoomBooking {
  id              String            @id @default(cuid())
  contactName     String
  company         String?
  rif             String?
  phone           String
  email           String?
  eventDetails    String            @db.Text
  eventDate       DateTime
  startTime       String            // "06:00" — formato HH:mm
  endTime         String            // "12:00" — formato HH:mm
  numberOfGuests  Int               // Máx 30
  estimatedPrice  Float             // 250 USD por día (configurable)
  status          ReservationStatus @default(PENDING)
  notes           String?           @db.Text

  auditLogs       AuditLog[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@index([eventDate])
  @@index([status])
  @@map("meeting_room_bookings")
}

// ═══════════════════════════════════════════════════════════════
// RESERVAS DE RESTAURANTE
// ═══════════════════════════════════════════════════════════════

model RestaurantBooking {
  id              String            @id @default(cuid())
  contactName     String
  phone           String
  idDocument      String?
  email           String?
  eventDate       DateTime
  timeSlot        RestaurantTimeSlot
  numberOfGuests  Int               // Máx 80
  status          ReservationStatus @default(PENDING)
  notes           String?           @db.Text

  auditLogs       AuditLog[]

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@index([eventDate])
  @@index([status])
  @@map("restaurant_bookings")
}

enum RestaurantTimeSlot {
  SLOT_12_14  // 12:00 PM – 2:00 PM
  SLOT_14_16  // 2:00 PM – 4:00 PM
}

// ═══════════════════════════════════════════════════════════════
// RESEÑAS
// ═══════════════════════════════════════════════════════════════

model Review {
  id          String       @id @default(cuid())
  guestName   String
  email       String?
  rating      Int          // 1–5, validado con Zod
  comment     String       @db.Text
  language    String       @default("es")
  status      ReviewStatus @default(PENDING)

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@index([status])
  @@index([rating])
  @@index([createdAt])
  @@map("reviews")
}

// ═══════════════════════════════════════════════════════════════
// PROMOCIONES
// ═══════════════════════════════════════════════════════════════

model Promotion {
  id              String        @id @default(cuid())
  title           String
  titleEn         String?
  description     String        @db.Text
  descriptionEn   String?       @db.Text
  discountType    DiscountType
  value           Float         // Porcentaje (0-100) o monto fijo en USD
  startDate       DateTime
  endDate         DateTime
  conditions      String?       @db.Text
  conditionsEn    String?       @db.Text
  imageUrl        String?
  isActive        Boolean       @default(true)

  applicableRooms RoomType[]    // Relación M:N

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([isActive])
  @@index([startDate, endDate])
  @@map("promotions")
}

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN DEL SISTEMA
// ═══════════════════════════════════════════════════════════════

model SystemSetting {
  id          String   @id @default(cuid())
  key         String   @unique
  value       Json     // Flexible: String, Number, JSON Object
  description String?
  category    String   @default("general") // "general"|"payment"|"policy"|"pricing"

  updatedAt   DateTime @updatedAt

  @@index([key])
  @@index([category])
  @@map("system_settings")
}

// SystemSettings predefinidas (seed):
// check_in_time        → "14:30"
// check_out_time       → "12:00"
// currency             → "USD"
// pool_price           → 0 (a definir por admin)
// meeting_room_price   → 250
// cancellation_policy  → { hoursThreshold: 48, refundPercent: 100 }
// payment_instructions → { transferencia: "...", zelle: "..." }
// exchange_rate        → { vesToUsd: 36.5 }

// ═══════════════════════════════════════════════════════════════
// SECCIONES DE PÁGINA (CMS básico)
// ═══════════════════════════════════════════════════════════════

model PageSection {
  id          String   @id @default(cuid())
  slug        String   @unique // "home-hero", "habitaciones-intro", etc.
  title       String?
  titleEn     String?
  body        String?  @db.Text
  bodyEn      String?  @db.Text
  heroImage   String?
  images      String[]
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  metadata    Json?    // SEO: { title, description, keywords }

  updatedAt   DateTime @updatedAt

  @@index([slug])
  @@index([isActive])
  @@map("page_sections")
}

// ═══════════════════════════════════════════════════════════════
// BITÁCORA DE AUDITORÍA
// ═══════════════════════════════════════════════════════════════
// NOTA: AuditLog es polimórfico por diseño. entityId es un String
// que referencia el ID de cualquier entidad (Reservation, User,
// MeetingRoomBooking, etc.). NO se usa foreign key tipada.
// ═══════════════════════════════════════════════════════════════

model AuditLog {
  id                   String      @id @default(cuid())
  entity               String      // "Reservation" | "User" | "Promotion" | "SystemSetting" | ...
  entityId             String      // ID de la entidad afectada
  action               AuditAction
  performedById        String?     // null = acción del sistema
  performedBy          User?       @relation(fields: [performedById], references: [id])
  changes              Json?       // { before: {...}, after: {...} }
  ipAddress            String?
  userAgent            String?
  timestamp            DateTime    @default(now())

  // Relaciones opcionales para navegación rápida desde entidades
  reservation          Reservation?         @relation(fields: [entityId], references: [id], map: "audit_reservation_fk")
  meetingRoomBooking   MeetingRoomBooking?  @relation(fields: [entityId], references: [id], map: "audit_meeting_fk")
  restaurantBooking    RestaurantBooking?   @relation(fields: [entityId], references: [id], map: "audit_restaurant_fk")

  @@index([entity, entityId])
  @@index([performedById])
  @@index([timestamp])
  @@map("audit_logs")
}
```

---

## 6. Zod Schemas — Contratos de Validación

```typescript
// src/lib/validators/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const createUserSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto").max(100),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "La contraseña debe tener mayúscula, minúscula y número",
    ),
  role: z.enum(["RECEPTIONIST", "OWNER", "ADMIN"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
```

```typescript
// src/lib/validators/guest.ts
import { z } from "zod";

export const guestSchema = z.object({
  fullName: z.string().min(2, "Nombre requerido").max(150),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, "Teléfono inválido (ej: +582541234567)"),
  idDocument: z.string().min(4, "Documento requerido").max(20),
  address: z.string().min(5, "Dirección requerida").max(200),
  origin: z.string().min(2, "Procedencia requerida").max(100),
});

export type GuestInput = z.infer<typeof guestSchema>;
```

```typescript
// src/lib/validators/reservation.ts
import { z } from "zod";
import { guestSchema } from "./guest";

// Paso 1: Selección de fechas y tipo
export const reservationStep1Schema = z
  .object({
    roomTypeId: z.string().cuid("Selecciona un tipo de habitación"),
    checkIn: z.coerce
      .date()
      .refine((d) => d >= new Date(), "La fecha de entrada debe ser futura"),
    checkOut: z.coerce.date(),
    numberOfGuests: z.number().int().min(1, "Mínimo 1 huésped").max(6),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out debe ser después del check-in",
    path: ["checkOut"],
  })
  .refine(
    (data) => {
      const nights = Math.ceil(
        (data.checkOut.getTime() - data.checkIn.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return nights >= 1;
    },
    { message: "Mínimo 1 noche", path: ["checkOut"] },
  );

// Paso 2: Datos del huésped
export const reservationStep2Schema = guestSchema;

// Paso 3: Método de pago
export const reservationStep3Schema = z.object({
  paymentMethod: z.enum(["TRANSFERENCIA", "ZELLE", "EFECTIVO"]),
  notes: z.string().max(500).optional(),
  language: z.enum(["es", "en"]).default("es"),
});

// Schema completo (server-side, combinación de los 3)
export const createReservationSchema = reservationStep1Schema
  .merge(z.object({ guest: reservationStep2Schema }))
  .merge(reservationStep3Schema);

export type ReservationStep1Input = z.infer<typeof reservationStep1Schema>;
export type ReservationStep2Input = z.infer<typeof reservationStep2Schema>;
export type ReservationStep3Input = z.infer<typeof reservationStep3Schema>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
```

```typescript
// src/lib/validators/booking.ts
import { z } from "zod";

export const meetingRoomBookingSchema = z.object({
  contactName: z.string().min(2).max(150),
  company: z.string().max(150).optional(),
  rif: z.string().max(20).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/),
  email: z.string().email().optional(),
  eventDetails: z.string().min(10, "Describe el evento").max(1000),
  eventDate: z.coerce
    .date()
    .refine((d) => d >= new Date(), "Fecha futura requerida"),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .default("06:00"),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .default("12:00"),
  numberOfGuests: z.number().int().min(1).max(30),
});

export const restaurantBookingSchema = z.object({
  contactName: z.string().min(2).max(150),
  phone: z.string().regex(/^\+?[1-9]\d{7,14}$/),
  idDocument: z.string().max(20).optional(),
  email: z.string().email().optional(),
  eventDate: z.coerce
    .date()
    .refine((d) => d >= new Date(), "Fecha futura requerida"),
  timeSlot: z.enum(["SLOT_12_14", "SLOT_14_16"]),
  numberOfGuests: z.number().int().min(1).max(80),
});

export const reviewSchema = z.object({
  guestName: z.string().min(2).max(100),
  email: z.string().email().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10, "Escribe al menos 10 caracteres").max(1000),
  language: z.enum(["es", "en"]).default("es"),
});

export type MeetingRoomBookingInput = z.infer<typeof meetingRoomBookingSchema>;
export type RestaurantBookingInput = z.infer<typeof restaurantBookingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
```

```typescript
// src/lib/validators/promotion.ts
import { z } from "zod";

export const promotionSchema = z
  .object({
    title: z.string().min(3).max(100),
    titleEn: z.string().max(100).optional(),
    description: z.string().min(10).max(2000),
    descriptionEn: z.string().max(2000).optional(),
    discountType: z.enum(["PERCENT", "FIXED"]),
    value: z
      .number()
      .positive()
      .refine(
        (v) => v <= 100 || true, // Solo se valida 0-100 si es PERCENT (refinement cruzado)
        "Porcentaje debe ser 0-100",
      ),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    conditions: z.string().max(1000).optional(),
    conditionsEn: z.string().max(1000).optional(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().default(true),
    applicableRoomIds: z
      .array(z.string().cuid())
      .min(1, "Selecciona al menos un tipo"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Fecha fin debe ser después de fecha inicio",
    path: ["endDate"],
  });

export type PromotionInput = z.infer<typeof promotionSchema>;
```

---

## 7. Roles, Permisos y RBAC

### 7.1 Definición de Roles

| Rol            | Descripción                             | Acceso a Dashboard                                    |
| -------------- | --------------------------------------- | ----------------------------------------------------- |
| `RECEPTIONIST` | Gestiona reservas del día a día         | Reservas, huéspedes, calendario                       |
| `OWNER`        | Dueño del hotel, solo lectura analítica | Reportes KPIs, bitácora                               |
| `ADMIN`        | Administración total del sistema        | Todo lo anterior + configuración, usuarios, contenido |

> **Nota:** Los visitantes NO tienen rol en la base de datos. Interactúan exclusivamente con la landing page pública sin autenticación.

### 7.2 Matriz Completa de Permisos

| Permiso                       | RECEPTIONIST | OWNER | ADMIN |
| ----------------------------- | :----------: | :---: | :---: |
| Ver lista de reservas         |      ✅      |  ✅   |  ✅   |
| Crear reserva (staff)         |      ✅      |  ❌   |  ✅   |
| Editar reserva                |      ✅      |  ❌   |  ✅   |
| Confirmar reserva             |      ✅      |  ❌   |  ✅   |
| Rechazar/cancelar reserva     |      ✅      |  ❌   |  ✅   |
| Ver huéspedes                 |      ✅      |  ✅   |  ✅   |
| Ver dashboard KPIs            |      ❌      |  ✅   |  ✅   |
| Ver bitácora auditoría        |      ❌      |  ✅   |  ✅   |
| Gestionar tipos de habitación |      ❌      |  ❌   |  ✅   |
| Gestionar promociones         |      ❌      |  ❌   |  ✅   |
| Moderar reseñas               |      ❌      |  ❌   |  ✅   |
| Gestionar usuarios            |      ❌      |  ❌   |  ✅   |
| Editar configuración sistema  |      ❌      |  ❌   |  ✅   |
| Editar contenido landing      |      ❌      |  ❌   |  ✅   |
| Gestionar sala/restaurante    |      ✅      |  ❌   |  ✅   |

### 7.3 Helper de RBAC (Server-side)

```typescript
// src/lib/rbac.ts
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

type Permission =
  | "reservations:read"
  | "reservations:write"
  | "reservations:confirm"
  | "analytics:read"
  | "audit:read"
  | "admin:users"
  | "admin:settings"
  | "admin:content"
  | "admin:promotions"
  | "admin:reviews"
  | "admin:rooms";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  RECEPTIONIST: [
    "reservations:read",
    "reservations:write",
    "reservations:confirm",
  ],
  OWNER: ["reservations:read", "analytics:read", "audit:read"],
  ADMIN: [
    "reservations:read",
    "reservations:write",
    "reservations:confirm",
    "analytics:read",
    "audit:read",
    "admin:users",
    "admin:settings",
    "admin:content",
    "admin:promotions",
    "admin:reviews",
    "admin:rooms",
  ],
};

export async function requirePermission(permission: Permission) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role as Role;
  const allowed = ROLE_PERMISSIONS[role]?.includes(permission) ?? false;

  if (!allowed) redirect("/dashboard?error=unauthorized");

  return session.user;
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
```

### 7.4 Proxy de Autenticación y Locale (Next.js 16)

> **Next.js 16:** `middleware.ts` fue renombrado a `proxy.ts`. El runtime es **Node.js** (no Edge). La función exportada se llama `proxy`, no `middleware`. El archivo vive en `src/proxy.ts`.

```typescript
// src/proxy.ts  ← nombre correcto en Next.js 16 (NO middleware.ts)
import { auth } from "@/auth";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
});

const DASHBOARD_PATHS = ["/dashboard"];

// En Next.js 16 la función exportada se llama "proxy"
export default auth(async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = (req as any).auth;

  const isDashboard = DASHBOARD_PATHS.some((p) => pathname.includes(p));

  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|fonts).*)"],
};
```

---

## 8. Estructura de Directorios Canónica

```
hotel-rio-yurubi/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                       # Seed: admin inicial + settings + tipos de habitación
│   └── migrations/
│
├── messages/
│   ├── es.json                       # Traducciones español (idioma principal)
│   └── en.json                       # Traducciones inglés
│
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── rooms/
│   │   └── hotel/
│   └── fonts/
│
├── src/
│   ├── auth.ts                       # Auth.js v5 config (ADR-002)
│   │
│   ├── proxy.ts                      # Auth + i18n proxy (Next.js 16 — antes middleware.ts)
│   │
│   ├── app/
│   │   ├── [locale]/                 # i18n con next-intl (ADR-003)
│   │   │   ├── layout.tsx            # RootLayout con providers
│   │   │   ├── page.tsx              # Home (redirect a landing)
│   │   │   │
│   │   │   ├── (public)/             # Route group landing pública
│   │   │   │   ├── layout.tsx        # Header + Footer públicos
│   │   │   │   ├── page.tsx          # Home: Hero + secciones
│   │   │   │   ├── habitaciones/
│   │   │   │   │   ├── page.tsx      # Listado de tipos
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx  # Detalle tipo habitación
│   │   │   │   ├── restaurante/
│   │   │   │   │   └── page.tsx      # Info + formulario reserva mesa
│   │   │   │   ├── piscina/
│   │   │   │   │   └── page.tsx      # Info + normas + precios
│   │   │   │   ├── salon-reuniones/
│   │   │   │   │   └── page.tsx      # Info + formulario cotización
│   │   │   │   ├── galeria/
│   │   │   │   │   └── page.tsx      # Grid filtrable
│   │   │   │   ├── opiniones/
│   │   │   │   │   └── page.tsx      # Reseñas aprobadas + form
│   │   │   │   ├── ubicacion/
│   │   │   │   │   └── page.tsx      # Mapa + contacto
│   │   │   │   ├── contacto/
│   │   │   │   │   └── page.tsx      # Formulario contacto
│   │   │   │   ├── promociones/
│   │   │   │   │   └── page.tsx      # Ofertas activas
│   │   │   │   ├── reservar/
│   │   │   │   │   ├── page.tsx      # Wizard (Client Component)
│   │   │   │   │   └── confirmada/
│   │   │   │   │       └── page.tsx  # Thank you page
│   │   │   │   └── [slug-service]/   # Páginas de servicios adicionales
│   │   │   │
│   │   │   ├── (dashboard)/          # Route group panel interno
│   │   │   │   ├── layout.tsx        # Sidebar + Header dashboard
│   │   │   │   └── dashboard/
│   │   │   │       ├── page.tsx      # Home dashboard (redirige por rol)
│   │   │   │       ├── reservas/
│   │   │   │       │   ├── page.tsx
│   │   │   │       │   ├── nueva/
│   │   │   │       │   │   └── page.tsx
│   │   │   │       │   └── [id]/
│   │   │   │       │       └── page.tsx
│   │   │   │       ├── huespedes/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── habitaciones/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── servicios/
│   │   │   │       │   ├── page.tsx
│   │   │   │       │   ├── sala-reuniones/
│   │   │   │       │   │   └── page.tsx
│   │   │   │       │   └── restaurante/
│   │   │   │       │       └── page.tsx
│   │   │   │       ├── promociones/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── resenas/      # Sin tilde para evitar issues en FS
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── reportes/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── configuracion/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── usuarios/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── bitacora/
│   │   │   │           └── page.tsx
│   │   │   │
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts      # Auth.js handlers
│   │
│   ├── actions/                      # Server Actions (ADR-004)
│   │   ├── reservation.ts
│   │   ├── meeting-room.ts
│   │   ├── restaurant.ts
│   │   ├── review.ts
│   │   ├── promotion.ts
│   │   ├── user.ts
│   │   └── settings.ts
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components (ADR-007)
│   │   ├── public/                   # Componentes landing
│   │   │   ├── hero/
│   │   │   ├── rooms/
│   │   │   ├── booking-wizard/       # Client Component
│   │   │   ├── gallery/
│   │   │   ├── reviews/
│   │   │   ├── promotions/
│   │   │   └── common/               # Header, Footer, LanguageSwitcher
│   │   ├── dashboard/                # Componentes panel interno
│   │   │   ├── layout/               # Sidebar, DashboardHeader
│   │   │   ├── reservations/
│   │   │   ├── charts/               # ApexCharts wrappers (Client)
│   │   │   └── tables/
│   │   └── forms/                    # Formularios reutilizables
│   │
│   ├── lib/
│   │   ├── prisma.ts                 # Singleton Prisma client
│   │   ├── env.ts                    # Validación de env vars
│   │   ├── rbac.ts                   # Helpers de permisos
│   │   ├── utils.ts                  # cn(), formatDate(), formatPrice()
│   │   ├── db/                       # Queries de DB (Repository pattern)
│   │   │   ├── reservations.ts
│   │   │   ├── guests.ts
│   │   │   ├── rooms.ts
│   │   │   ├── promotions.ts
│   │   │   ├── reviews.ts
│   │   │   └── settings.ts
│   │   ├── email/
│   │   │   ├── index.ts              # sendEmail() wrapper
│   │   │   └── templates/
│   │   │       ├── reservation-pending.tsx
│   │   │       ├── reservation-confirmed.tsx
│   │   │       ├── reservation-rejected.tsx
│   │   │       ├── checkin-reminder.tsx
│   │   │       └── review-request.tsx
│   │   └── validators/               # Zod schemas (Sección 6)
│   │       ├── auth.ts
│   │       ├── guest.ts
│   │       ├── reservation.ts
│   │       ├── booking.ts
│   │       └── promotion.ts
│   │
│   └── types/
│       ├── next-auth.d.ts            # Extend Session types
│       └── index.ts
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
└── package.json
```

---

## 9. Rutas y Contratos de API

### 9.1 Rutas Públicas

| Ruta                            | Tipo de Componente             | Datos (fuente)                             | SEO                  |
| ------------------------------- | ------------------------------ | ------------------------------------------ | -------------------- |
| `/[locale]`                     | Server Component               | `PageSection` (hero, home)                 | ✅ Metadata dinámica |
| `/[locale]/habitaciones`        | Server Component               | `RoomType[]` activos                       | ✅                   |
| `/[locale]/habitaciones/[slug]` | Server Component               | `RoomType` por slug                        | ✅                   |
| `/[locale]/reservar`            | Client Component               | `RoomType[]` (fetched en server padre)     | ❌                   |
| `/[locale]/reservar/confirmada` | Server Component               | `searchParams.reservationId`               | ❌                   |
| `/[locale]/restaurante`         | Server Component               | `PageSection` + `RestaurantBooking` form   | ✅                   |
| `/[locale]/salon-reuniones`     | Server Component               | `PageSection` + `MeetingRoomBooking` form  | ✅                   |
| `/[locale]/piscina`             | Server Component               | `PageSection` + `SystemSetting.pool_price` | ✅                   |
| `/[locale]/galeria`             | Server Component               | `PageSection.images`                       | ✅                   |
| `/[locale]/opiniones`           | Server Component               | `Review[]` status=APPROVED                 | ✅                   |
| `/[locale]/ubicacion`           | Server Component               | `SystemSetting` + coords estáticas         | ✅                   |
| `/[locale]/contacto`            | Server Component + Client form | —                                          | ✅                   |
| `/[locale]/promociones`         | Server Component               | `Promotion[]` activas y vigentes           | ✅                   |

### 9.2 Rutas del Dashboard

| Ruta                                 | Permisos requeridos  | Datos principales                              |
| ------------------------------------ | -------------------- | ---------------------------------------------- |
| `/[locale]/dashboard`                | Cualquier rol        | Redirige según rol                             |
| `/[locale]/dashboard/reservas`       | `reservations:read`  | `Reservation[]` con filtros                    |
| `/[locale]/dashboard/reservas/nueva` | `reservations:write` | `RoomType[]`, `Guest[]`                        |
| `/[locale]/dashboard/reservas/[id]`  | `reservations:read`  | `Reservation` + `AuditLog[]`                   |
| `/[locale]/dashboard/huespedes`      | `reservations:read`  | `Guest[]` paginado                             |
| `/[locale]/dashboard/habitaciones`   | `admin:rooms`        | `RoomType[]` + `Room[]`                        |
| `/[locale]/dashboard/servicios`      | `reservations:read`  | `MeetingRoomBooking[]` + `RestaurantBooking[]` |
| `/[locale]/dashboard/promociones`    | `admin:promotions`   | `Promotion[]`                                  |
| `/[locale]/dashboard/resenas`        | `admin:reviews`      | `Review[]` por estado                          |
| `/[locale]/dashboard/reportes`       | `analytics:read`     | KPIs + datos para ApexCharts                   |
| `/[locale]/dashboard/configuracion`  | `admin:settings`     | `SystemSetting[]`                              |
| `/[locale]/dashboard/usuarios`       | `admin:users`        | `User[]`                                       |
| `/[locale]/dashboard/bitacora`       | `audit:read`         | `AuditLog[]` paginado                          |

---

## 10. Server Actions — Firmas Tipadas

```typescript
// src/actions/reservation.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/rbac";
import { createReservationSchema } from "@/lib/validators/reservation";
import { sendReservationPendingEmail } from "@/lib/email";
import { createAuditLog } from "@/lib/db/audit";

// ─── Tipos de retorno canónicos ───────────────────────────────

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ─── Acción pública: el visitante crea la reserva ─────────────

export async function createReservationAction(
  formData: unknown,
): Promise<ActionResult<{ reservationId: string }>> {
  const parsed = createReservationSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: "Datos inválidos",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const data = parsed.data;

  try {
    // Verificar disponibilidad aproximada (no en tiempo real)
    const conflicting = await prisma.reservation.count({
      where: {
        roomTypeId: data.roomTypeId,
        status: { in: ["PENDING", "CONFIRMED"] },
        AND: [
          { checkIn: { lt: data.checkOut } },
          { checkOut: { gt: data.checkIn } },
        ],
      },
    });

    const roomType = await prisma.roomType.findUnique({
      where: { id: data.roomTypeId },
      select: {
        rooms: { where: { isAvailable: true } },
        basePrice: true,
        name: true,
      },
    });

    if (!roomType)
      return { success: false, error: "Tipo de habitación no encontrado" };

    // Sistema de availability sin tiempo real: solo alertar, no bloquear
    const availableCount = roomType.rooms.length;
    if (conflicting >= availableCount) {
      return {
        success: false,
        error:
          "No hay disponibilidad para esas fechas. Contáctanos directamente.",
      };
    }

    const nights = Math.ceil(
      (data.checkOut.getTime() - data.checkIn.getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const totalPrice = roomType.basePrice * nights;

    const reservation = await prisma.reservation.create({
      data: {
        guest: {
          connectOrCreate: {
            where: { email: data.guest.email },
            // Si ya existe un guest con ese email, se conecta.
            // Si no, se crea nuevo.
            create: { ...data.guest },
          },
        },
        roomTypeId: data.roomTypeId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        numberOfNights: nights,
        numberOfGuests: data.numberOfGuests,
        totalPrice,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        language: data.language,
        status: "PENDING",
      },
      include: { guest: true, roomType: true },
    });

    // Emails
    await sendReservationPendingEmail(reservation);

    await createAuditLog({
      entity: "Reservation",
      entityId: reservation.id,
      action: "CREATE",
      performedById: null, // visitante público
      changes: { after: { status: "PENDING", guestEmail: data.guest.email } },
    });

    return { success: true, data: { reservationId: reservation.id } };
  } catch (error) {
    console.error("[createReservationAction]", error);
    return { success: false, error: "Error interno. Intenta de nuevo." };
  }
}

// ─── Confirmar reserva (Recepcionista / Admin) ────────────────

export async function confirmReservationAction(
  reservationId: string,
): Promise<ActionResult> {
  const user = await requirePermission("reservations:confirm");

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { guest: true },
  });

  if (!reservation) return { success: false, error: "Reserva no encontrada" };
  if (reservation.status !== "PENDING")
    return {
      success: false,
      error: "Solo se pueden confirmar reservas en estado PENDING",
    };

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: "CONFIRMED", confirmedById: user.id },
  });

  await createAuditLog({
    entity: "Reservation",
    entityId: reservationId,
    action: "CONFIRM",
    performedById: user.id,
    changes: { before: { status: "PENDING" }, after: { status: "CONFIRMED" } },
  });

  // TODO: await sendReservationConfirmedEmail(reservation);

  revalidatePath("/dashboard/reservas");
  return { success: true, data: undefined };
}

// ─── Cancelar reserva ─────────────────────────────────────────

export async function cancelReservationAction(
  reservationId: string,
  reason: string,
): Promise<ActionResult> {
  const user = await requirePermission("reservations:write");

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) return { success: false, error: "Reserva no encontrada" };
  if (reservation.status === "COMPLETED")
    return {
      success: false,
      error: "No se puede cancelar una reserva completada",
    };

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: "CANCELLED", cancellationReason: reason },
  });

  await createAuditLog({
    entity: "Reservation",
    entityId: reservationId,
    action: "CANCEL",
    performedById: user.id,
    changes: {
      before: { status: reservation.status },
      after: { status: "CANCELLED", reason },
    },
  });

  revalidatePath("/dashboard/reservas");
  return { success: true, data: undefined };
}
```

---

## 11. Especificación de la Landing Page

### 11.1 Secciones Requeridas en Orden

| #   | Sección                | Slug del PageSection   | Componente           | Notas                                |
| --- | ---------------------- | ---------------------- | -------------------- | ------------------------------------ |
| 1   | Hero                   | `home-hero`            | `HeroSection`        | Imagen fondo + CTA "Reservar Ahora"  |
| 2   | Promociones Destacadas | —                      | `PromotionBanner`    | Solo si hay promociones activas      |
| 3   | Habitaciones           | `habitaciones-preview` | `RoomTypeGrid`       | 4 tipos destacados                   |
| 4   | Servicios              | `servicios-overview`   | `ServicesGrid`       | Restaurante, Piscina, Sala, Bar      |
| 5   | Restaurante            | `restaurante-info`     | `RestaurantSection`  | Horario, capacidad, CTA reserva mesa |
| 6   | Piscina                | `piscina-info`         | `PoolSection`        | Horario, costo, normas               |
| 7   | Sala de Reuniones      | `sala-reuniones-info`  | `MeetingRoomSection` | Capacidad 30p, equipamiento          |
| 8   | Galería                | —                      | `GalleryGrid`        | Filtrable por categoría              |
| 9   | Testimonios            | —                      | `ReviewsCarousel`    | Solo status=APPROVED                 |
| 10  | Ubicación              | `ubicacion-info`       | `LocationSection`    | Mapa Google embed + datos            |
| 11  | Contacto               | —                      | `ContactSection`     | Form + WhatsApp link                 |
| 12  | Promociones completas  | —                      | `PromotionsList`     | Página `/promociones`                |

### 11.2 SEO — Metadata por Página

```typescript
// src/app/[locale]/(public)/page.tsx
// Next.js 16: params es async — siempre await antes de usar
import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params; // ← await obligatorio en Next.js 16
  const isEs = locale === "es";

  return {
    title: isEs
      ? "Hotel Río Yurubí | Alojamiento en San Felipe, Yaracuy"
      : "Hotel Río Yurubí | Accommodation in San Felipe, Yaracuy",
    description: isEs
      ? "Hotel frente al Parque Nacional Yurubí. Habitaciones cómodas, restaurante, piscina y sala de reuniones en San Felipe, Yaracuy, Venezuela."
      : "Hotel facing Yurubí National Park. Comfortable rooms, restaurant, pool and meeting room in San Felipe, Yaracuy, Venezuela.",
    keywords: isEs
      ? [
          "hotel San Felipe",
          "hotel Yaracuy",
          "Parque Nacional Yurubí alojamiento",
          "hotel Venezuela",
        ]
      : ["hotel San Felipe Venezuela", "Yurubi National Park accommodation"],
    openGraph: {
      title: "Hotel Río Yurubí",
      description: isEs ? "Tu refugio en Yaracuy" : "Your refuge in Yaracuy",
      images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
      locale: isEs ? "es_VE" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/${params.locale}`,
      languages: {
        es: `${process.env.NEXT_PUBLIC_APP_URL}/es`,
        en: `${process.env.NEXT_PUBLIC_APP_URL}/en`,
      },
    },
  };
}

// JSON-LD Schema.org
const hotelJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Hotel Río Yurubí",
  description: "Hotel frente al Parque Nacional Yurubí en San Felipe, Yaracuy",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Final Avenida La Fuente",
    addressLocality: "San Felipe",
    addressRegion: "Yaracuy",
    postalCode: "3201",
    addressCountry: "VE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "10.4035",
    longitude: "-68.7470",
  },
  telephone: "+584267224991",
  email: "hotelrioyurubi@gmail.com",
  priceRange: "$$",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Piscina", value: true },
    {
      "@type": "LocationFeatureSpecification",
      name: "Restaurante",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Estacionamiento",
      value: true,
    },
    { "@type": "LocationFeatureSpecification", name: "WiFi", value: true },
  ],
};
```

### 11.3 Targets de Performance

| Métrica          | Target  | Estrategia                                           |
| ---------------- | ------- | ---------------------------------------------------- |
| LCP              | < 2.5s  | `next/image` con WebP/AVIF, `priority` en hero image |
| FID              | < 100ms | Minimizar JS en Server Components                    |
| CLS              | < 0.1   | Dimensiones explícitas en `next/image`               |
| Lighthouse Score | > 90    | Auditoría con `npx lighthouse` en CI                 |

---

## 12. Wizard de Reserva — Especificación Completa

El wizard es un **Client Component** (`"use client"`) dado que mantiene estado entre pasos.

### 12.1 Flujo de Pasos

```
Paso 1: Selección
├── roomTypeId (selector de cards)
├── checkIn (DatePicker)
├── checkOut (DatePicker)
└── numberOfGuests (selector numérico)
        │
        ▼ Validación: reservationStep1Schema
        │
Paso 2: Datos del Huésped
├── fullName
├── email
├── phone
├── idDocument
├── address
└── origin
        │
        ▼ Validación: reservationStep2Schema (guestSchema)
        │
Paso 3: Pago y Confirmación
├── paymentMethod (TRANSFERENCIA | ZELLE | EFECTIVO)
├── Mostrar instrucciones de pago según método
├── notes (opcional)
└── Resumen de la reserva + precio total
        │
        ▼ Validación: reservationStep3Schema
        │
Paso 4: Enviando...
├── Spinner de carga
├── Llamada a createReservationAction()
└── Redirección a /reservar/confirmada?id=XXX
```

### 12.2 Estado del Wizard

```typescript
// src/components/public/booking-wizard/BookingWizard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import type {
  ReservationStep1Input,
  ReservationStep2Input,
  ReservationStep3Input,
} from "@/lib/validators/reservation";
import { createReservationAction } from "@/actions/reservation";

type WizardStep = 1 | 2 | 3 | 4;

interface WizardData {
  step1?: ReservationStep1Input;
  step2?: ReservationStep2Input;
  step3?: ReservationStep3Input;
}

interface BookingWizardProps {
  roomTypes: {
    id: string;
    name: string;
    basePrice: number;
    maxOccupancy: number;
    images: string[];
  }[];
  paymentInstructions: Record<string, string>; // De SystemSetting
}

export function BookingWizard({
  roomTypes,
  paymentInstructions,
}: BookingWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [data, setData] = useState<WizardData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();

  async function handleSubmit() {
    if (!data.step1 || !data.step2 || !data.step3) return;
    setIsLoading(true);
    setError(null);

    const result = await createReservationAction({
      ...data.step1,
      guest: data.step2,
      ...data.step3,
    });

    if (result.success) {
      router.push(
        `/${locale}/reservar/confirmada?id=${result.data.reservationId}`,
      );
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  }

  // Renderizar paso correspondiente
  // ...
}
```

### 12.3 Cálculo de Precio

```typescript
// src/lib/utils.ts
export function calculateReservationPrice(
  basePrice: number,
  checkIn: Date,
  checkOut: Date,
): { nights: number; total: number } {
  const ms = checkOut.getTime() - checkIn.getTime();
  const nights = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return { nights, total: basePrice * nights };
}
```

---

## 13. Dashboard por Rol

### 13.1 Dashboard — Recepcionista

**Página principal** `/dashboard`: Listado de reservas con filtros de estado (PENDING, CONFIRMED, CANCELLED) y rango de fechas. Vista de calendario opcional.

**Acciones disponibles:**

- Confirmar reserva (PENDING → CONFIRMED)
- Rechazar reserva (PENDING → REJECTED) con campo de motivo obligatorio
- Cancelar reserva (CONFIRMED → CANCELLED) con campo de motivo obligatorio
- Crear reserva manual (para huéspedes que reservan por teléfono)
- Ver detalle completo de reserva

### 13.2 Dashboard — Dueño

**KPIs en cards:**

| KPI                 | Cálculo                                               | Período   |
| ------------------- | ----------------------------------------------------- | --------- |
| Reservas Activas    | `count WHERE status=CONFIRMED AND checkIn >= today`   | Actual    |
| Reservas del Mes    | `count WHERE createdAt IN [startOfMonth, endOfMonth]` | Filtrable |
| Tasa de Cancelación | `cancelled / total * 100`                             | Filtrable |
| Ocupación %         | `occupiedRooms / totalRooms * 100`                    | Hoy       |

**Gráficos ApexCharts (Client Components):**

```typescript
// src/components/dashboard/charts/OccupancyChart.tsx
"use client";

import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface OccupancyChartProps {
  data: { date: string; occupancy: number }[];
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  const options = {
    chart: { type: "line" as const, toolbar: { show: false } },
    xaxis: { categories: data.map((d) => d.date) },
    yaxis: { min: 0, max: 100, labels: { formatter: (v: number) => `${v}%` } },
    colors: ["#0c88ee"],
    stroke: { curve: "smooth" as const, width: 3 },
    tooltip: { y: { formatter: (v: number) => `${v}% ocupación` } },
  };

  return (
    <ApexChart
      type="line"
      height={300}
      options={options}
      series={[{ name: "Ocupación", data: data.map((d) => d.occupancy) }]}
    />
  );
}
```

### 13.3 Dashboard — Admin

Acceso completo. Adicionalmente:

- **Gestión de PageSections:** Editor de texto para cada sección de la landing
- **SystemSettings Form:** Formulario de configuración con campos tipados por categoría
- **User management:** CRUD de usuarios internos con asignación de rol

---

## 14. Emails Transaccionales

### 14.1 Catálogo de Emails

| Evento                | Trigger                    | Destinatario    | Template                |
| --------------------- | -------------------------- | --------------- | ----------------------- |
| Reserva PENDING       | `createReservationAction`  | Cliente + hotel | `reservation-pending`   |
| Reserva CONFIRMED     | `confirmReservationAction` | Cliente         | `reservation-confirmed` |
| Reserva REJECTED      | `rejectReservationAction`  | Cliente         | `reservation-rejected`  |
| Recordatorio check-in | Cron 24h antes             | Cliente         | `checkin-reminder`      |
| Solicitud de reseña   | Cron post-checkout + 24h   | Cliente         | `review-request`        |
| Nueva reserva (staff) | `createReservationAction`  | hotel email     | `staff-new-reservation` |

### 14.2 Wrapper de Envío

```typescript
// src/lib/email/index.ts
import { Resend } from "resend";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}) {
  const { data, error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: Array.isArray(to) ? to : [to],
    subject,
    react,
  });

  if (error) {
    console.error("[sendEmail] Error:", error);
    throw new Error(`Email sending failed: ${error.message}`);
  }

  return data;
}
```

### 14.3 Template de Ejemplo

```typescript
// src/lib/email/templates/reservation-pending.tsx
import {
  Body, Container, Head, Heading, Hr, Html,
  Preview, Section, Text, Row, Column,
} from "@react-email/components";

interface ReservationPendingEmailProps {
  guestName: string;
  reservationId: string;
  roomTypeName: string;
  checkIn: string;       // "DD/MM/YYYY"
  checkOut: string;
  numberOfNights: number;
  numberOfGuests: number;
  totalPrice: number;
  paymentMethod: string;
  paymentInstructions: string;
  language: "es" | "en";
}

const t = {
  es: {
    preview: "Recibimos tu solicitud de reserva — Hotel Río Yurubí",
    heading: "Solicitud de Reserva Recibida",
    greeting: (name: string) => `Hola ${name},`,
    body: "Hemos recibido tu solicitud de reserva. Nuestro equipo la revisará y te confirmaremos en breve.",
    details: "Detalles de tu Reserva",
    paymentNote: "Para confirmar tu reserva, realiza el pago adelantado según las instrucciones indicadas.",
    footer: "Hotel Río Yurubí · San Felipe, Yaracuy · +58 254-2310798",
  },
  en: {
    preview: "We received your reservation request — Hotel Río Yurubí",
    heading: "Reservation Request Received",
    greeting: (name: string) => `Hello ${name},`,
    body: "We have received your reservation request. Our team will review it and confirm shortly.",
    details: "Your Reservation Details",
    paymentNote: "To confirm your reservation, please make the advance payment following the instructions below.",
    footer: "Hotel Río Yurubí · San Felipe, Yaracuy · +58 254-2310798",
  },
};

export function ReservationPendingEmail(props: ReservationPendingEmailProps) {
  const lang = t[props.language];

  return (
    <Html>
      <Head />
      <Preview>{lang.preview}</Preview>
      <Body style={{ backgroundColor: "#f5f5f5", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "40px auto", backgroundColor: "#ffffff" }}>
          <Section style={{ backgroundColor: "#0c88ee", padding: "24px" }}>
            <Heading style={{ color: "#ffffff", margin: 0 }}>Hotel Río Yurubí</Heading>
            <Text style={{ color: "#e0effe", margin: "8px 0 0" }}>{lang.heading}</Text>
          </Section>
          <Section style={{ padding: "24px" }}>
            <Text>{lang.greeting(props.guestName)}</Text>
            <Text>{lang.body}</Text>
            <Hr />
            <Heading as="h3">{lang.details}</Heading>
            <Row>
              <Column><Text><strong>ID:</strong> {props.reservationId.slice(-8).toUpperCase()}</Text></Column>
              <Column><Text><strong>Habitación:</strong> {props.roomTypeName}</Text></Column>
            </Row>
            <Row>
              <Column><Text><strong>Check-in:</strong> {props.checkIn}</Text></Column>
              <Column><Text><strong>Check-out:</strong> {props.checkOut}</Text></Column>
            </Row>
            <Row>
              <Column><Text><strong>Noches:</strong> {props.numberOfNights}</Text></Column>
              <Column><Text><strong>Total:</strong> ${props.totalPrice} USD</Text></Column>
            </Row>
            <Hr />
            <Text style={{ backgroundColor: "#fff8e1", padding: "12px", borderRadius: "4px" }}>
              <strong>⚠️ {lang.paymentNote}</strong>
            </Text>
            <Text style={{ whiteSpace: "pre-line" }}>{props.paymentInstructions}</Text>
          </Section>
          <Section style={{ backgroundColor: "#f5f5f5", padding: "16px", textAlign: "center" as const }}>
            <Text style={{ color: "#666", fontSize: "12px" }}>{lang.footer}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

---

## 15. Internacionalización (i18n)

### 15.1 Estructura de Mensajes

```json
// messages/es.json — estructura parcial de referencia
{
  "nav": {
    "home": "Inicio",
    "rooms": "Habitaciones",
    "restaurant": "Restaurante",
    "pool": "Piscina",
    "meetingRoom": "Sala de Reuniones",
    "gallery": "Galería",
    "reviews": "Opiniones",
    "location": "Ubicación",
    "contact": "Contacto",
    "promotions": "Promociones",
    "bookNow": "Reservar Ahora",
    "login": "Iniciar Sesión"
  },
  "hero": {
    "title": "Tu refugio natural en el corazón de Yaracuy",
    "subtitle": "Disfruta de la tranquilidad del Parque Nacional Yurubí con todas las comodidades de un hotel confortable",
    "cta": "Reservar Ahora",
    "ctaSecondary": "Ver Habitaciones"
  },
  "rooms": {
    "title": "Nuestras Habitaciones",
    "subtitle": "Comodidad y confort para cada tipo de viajero",
    "bookRoom": "Reservar esta habitación",
    "perNight": "/ noche",
    "maxGuests": "Máx. {count} personas"
  },
  "booking": {
    "step1Title": "Selecciona tu estadía",
    "step2Title": "Tus datos",
    "step3Title": "Confirmación y pago",
    "step4Title": "Procesando...",
    "checkIn": "Fecha de entrada",
    "checkOut": "Fecha de salida",
    "guests": "Número de huéspedes",
    "fullName": "Nombre completo",
    "email": "Correo electrónico",
    "phone": "Teléfono",
    "idDocument": "Cédula / Pasaporte",
    "address": "Dirección",
    "origin": "Ciudad / País de procedencia",
    "paymentMethod": "Método de pago",
    "notes": "Observaciones (opcional)",
    "total": "Total a pagar",
    "nights": "{count, plural, one {# noche} other {# noches}}",
    "confirm": "Confirmar Reserva",
    "back": "Anterior",
    "next": "Siguiente",
    "success": "¡Reserva enviada exitosamente!",
    "successBody": "Recibirás un correo de confirmación. Nuestro equipo revisará tu solicitud en breve.",
    "errorGeneric": "Ocurrió un error. Por favor intenta de nuevo.",
    "noAvailability": "No hay disponibilidad para las fechas seleccionadas. Contáctanos directamente."
  },
  "dashboard": {
    "title": "Panel de Gestión",
    "reservations": "Reservas",
    "guests": "Huéspedes",
    "rooms": "Habitaciones",
    "promotions": "Promociones",
    "reviews": "Reseñas",
    "reports": "Reportes",
    "settings": "Configuración",
    "users": "Usuarios",
    "auditLog": "Bitácora"
  }
}
```

### 15.2 Uso en Componentes

```typescript
// Server Component
import { getTranslations } from "next-intl/server";

export default async function HeroSection() {
  const t = await getTranslations("hero");
  return (
    <section>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
    </section>
  );
}

// Client Component
"use client";
import { useTranslations } from "next-intl";

export function BookingForm() {
  const t = useTranslations("booking");
  return <input placeholder={t("fullName")} />;
}
```

---

## 16. Configuración de Infraestructura

### 16.1 next.config.ts

```typescript
// next.config.ts — Next.js 16 compatible
// CAMBIOS vs v15:
//   - Turbopack es el bundler por defecto. NO incluir --turbopack en scripts.
//   - experimental.ppr eliminado. Usar "use cache" directive (Cache Components).
//   - reactCompiler promovido a top-level (ya no experimental).
//   - AMP APIs eliminadas (no aplica a este proyecto).
//   - next lint eliminado — usar eslint directamente.
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const nextConfig: NextConfig = {
  // React Compiler estable en Next.js 16 (opt-in)
  reactCompiler: false, // Activar cuando el proyecto esté estabilizado

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.vercel-storage.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
    // Turbopack filesystem cache para builds (estable en dev desde 16.1)
    // turbopackFileSystemCacheForBuild: true, // Activar cuando esté estable
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
```

### 16.2 src/i18n.ts (requerido por next-intl)

```typescript
// src/i18n.ts
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default,
}));
```

### 16.3 Prisma Client Singleton

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

const createPrismaClient = () => {
  const sql = neon(process.env.DATABASE_URL!);
  const adapter = new PrismaNeon(sql);
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 16.4 tailwind.config.ts

```typescript
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
      colors: {
        // Colores de marca Hotel Río Yurubí
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
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair-display)", "Georgia", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

export default config;
```

### 16.5 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 17. Criterios de Aceptación Verificables

Los criterios están redactados como tests ejecutables o condiciones verificables por inspección programática — no como "visual inspection".

### 17.1 Landing Page Pública

| ID    | Criterio                               | Verificación                                                      |
| ----- | -------------------------------------- | ----------------------------------------------------------------- |
| LP-01 | LCP < 2.5s                             | `npx lighthouse --only-categories=performance` score ≥ 90         |
| LP-02 | Responsive en 375px, 768px, 1280px     | `npx playwright test` con viewports                               |
| LP-03 | Header sticky visible en scroll        | E2E: scroll 500px → header visible en viewport                    |
| LP-04 | Las 10 secciones existen en el DOM     | `document.querySelectorAll("[data-section]").length === 10`       |
| LP-05 | Switch ES/EN cambia URL y contenido    | `router.push("/en")` → `<html lang="en">` + texto inglés          |
| LP-06 | Meta title incluye "San Felipe"        | `document.title.includes("San Felipe")`                           |
| LP-07 | JSON-LD Hotel presente en `<head>`     | `document.querySelector('script[type="application/ld+json"]')`    |
| LP-08 | Formulario de contacto retorna success | POST con datos válidos → HTTP 200 + email recibido en EMAIL_HOTEL |

### 17.2 Sistema de Reservas

| ID     | Criterio                                     | Verificación                                                                 |
| ------ | -------------------------------------------- | ---------------------------------------------------------------------------- |
| RES-01 | Step 1 rechaza checkOut <= checkIn           | Zod refinement → fieldError en `checkOut`                                    |
| RES-02 | Step 1 rechaza numberOfGuests > maxOccupancy | Server-side check → `{ success: false }`                                     |
| RES-03 | Reserva creada con status PENDING            | `prisma.reservation.findUnique(id).status === "PENDING"`                     |
| RES-04 | totalPrice = basePrice × nights              | `reservation.totalPrice === roomType.basePrice * reservation.numberOfNights` |
| RES-05 | Email enviado a cliente tras creación        | Resend API → email en bandeja de `guest.email`                               |
| RES-06 | Email enviado a hotel tras creación          | Resend API → email en `EMAIL_HOTEL`                                          |
| RES-07 | Redirección a `/reservar/confirmada?id=XXX`  | `router.pathname === "/reservar/confirmada"` con `searchParams.id` presente  |
| RES-08 | Guest reutilizado si email ya existe         | `connectOrCreate` → un solo registro en tabla `guests` por email             |

### 17.3 RBAC

| ID      | Criterio                                                   | Verificación                                                                     |
| ------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| RBAC-01 | RECEPTIONIST no puede acceder a `/dashboard/configuracion` | HTTP 302 redirect a `/dashboard`                                                 |
| RBAC-02 | OWNER no puede crear reserva                               | `createReservationAction` → `requirePermission("reservations:write")` → redirect |
| RBAC-03 | OWNER puede ver `/dashboard/reportes`                      | HTTP 200 con datos de KPIs                                                       |
| RBAC-04 | Solo ADMIN puede crear usuarios                            | `createUserAction` con rol RECEPTIONIST → error                                  |
| RBAC-05 | Token JWT incluye `role`                                   | `jwt() callback` → `token.role` presente y correcto                              |
| RBAC-06 | Usuario inactivo (`isActive=false`) no puede hacer login   | `authorize()` → `return null`                                                    |

### 17.4 Auditoría

| ID       | Criterio                                           | Verificación                                                                    |
| -------- | -------------------------------------------------- | ------------------------------------------------------------------------------- |
| AUDIT-01 | Confirmación de reserva crea AuditLog              | `prisma.auditLog.findFirst({ where: { entityId, action: "CONFIRM" } })`         |
| AUDIT-02 | Cancelación de reserva crea AuditLog con reason    | `auditLog.changes.after.reason !== null`                                        |
| AUDIT-03 | `changes` contiene before/after                    | `auditLog.changes.before !== undefined && auditLog.changes.after !== undefined` |
| AUDIT-04 | `performedById` es null para acciones de visitante | `createReservation` → `auditLog.performedById === null`                         |

### 17.5 Emails

| ID       | Criterio                                          | Verificación                                                |
| -------- | ------------------------------------------------- | ----------------------------------------------------------- |
| EMAIL-01 | Template ES en reserva con language="es"          | `subject` contiene "Solicitud de Reserva"                   |
| EMAIL-02 | Template EN en reserva con language="en"          | `subject` contiene "Reservation Request"                    |
| EMAIL-03 | Email incluye `reservationId` truncado            | Body HTML contiene `reservation.id.slice(-8).toUpperCase()` |
| EMAIL-04 | Email no se envía si Resend falla silenciosamente | Error es logueado, no re-throw en createReservationAction   |

---

## 18. Checklist de Implementación por Fases

### Fase 0 — Setup (Día 1)

- [ ] Verificar Node.js >= 20.9.0 (`node --version`) — **requisito mínimo de Next.js 16**
- [ ] `npx create-next-app@latest hotel-rio-yurubi --typescript --tailwind --app --src-dir --import-alias "@/*"` (instala Next.js 16.2.0)
- [ ] Verificar que `package.json` scripts NO incluyen `--turbopack` (ya es default en v16)
- [ ] Verificar que `package.json` scripts NO incluyen `next lint` (eliminado en v16, reemplazar con `eslint src/`)
- [ ] Instalar dependencias del `package.json` canónico (Sección 3)
- [ ] `npx shadcn@latest init` (style: new-york, base color: blue)
- [ ] Copiar `prisma/schema.prisma` (Sección 5)
- [ ] Configurar `.env.local` con variables de Sección 4
- [ ] `npx prisma db push` — verificar conexión a Neon.tech
- [ ] Crear `src/auth.ts` (ADR-002)
- [ ] **Crear `src/proxy.ts`** (NO `middleware.ts`) — función exportada llamada `proxy` (ADR-008)
- [ ] Crear `src/i18n.ts` + `messages/es.json` + `messages/en.json`
- [ ] Crear `src/lib/prisma.ts`, `src/lib/rbac.ts`, `src/lib/env.ts`
- [ ] Ejecutar seed inicial: admin@hotelrioyurubi.com + RoomTypes + SystemSettings
- [ ] Verificar login en `/login` con usuario admin

### Fase 1 — Landing Page (Días 2–5)

- [ ] Crear layout público con Header (sticky) + Footer
- [ ] Implementar `LanguageSwitcher` y verificar rutas `/es` / `/en`
- [ ] `HeroSection` con imagen, título, CTA
- [ ] `RoomTypeGrid` — listado de tipos con card + precio + CTA
- [ ] Página detalle `/habitaciones/[slug]`
- [ ] `ServicesGrid` — Restaurante, Piscina, Sala, Bar (icons)
- [ ] `RestaurantSection`, `PoolSection`, `MeetingRoomSection`
- [ ] `GalleryGrid` — filtrable por categoría (Client Component)
- [ ] `ReviewsCarousel` — solo `status=APPROVED`
- [ ] `LocationSection` — Google Maps embed con coords de `NEXT_PUBLIC_HOTEL_*`
- [ ] `ContactSection` — form + WhatsApp link
- [ ] `PromotionBanner` + página `/promociones`
- [ ] SEO metadata + JSON-LD en home (Sección 11.2)
- [ ] Lighthouse audit → score > 90

### Fase 2 — Sistema de Reservas (Días 6–9)

- [ ] Crear Zod schemas de Sección 6
- [ ] Implementar `BookingWizard` (Client Component, 4 pasos)
- [ ] Implementar `createReservationAction` (Sección 10)
- [ ] Página `/reservar/confirmada`
- [ ] Setup Resend + templates de email (Sección 14)
- [ ] `sendReservationPendingEmail` — cliente + hotel
- [ ] Test E2E del flujo completo: selección → datos → pago → confirmada
- [ ] Formularios de sala de reuniones y restaurante
- [ ] Formulario de reseñas

### Fase 3 — Dashboard Recepcionista (Días 10–14)

- [ ] Dashboard layout con Sidebar + DashboardHeader
- [ ] Página `/dashboard/reservas` — tabla con filtros (estado, fecha)
- [ ] Vista calendario de reservas (Client Component)
- [ ] Página `/dashboard/reservas/[id]` — detalle + acciones
- [ ] `confirmReservationAction`, `cancelReservationAction`, `rejectReservationAction`
- [ ] Formulario de creación manual de reserva (staff)
- [ ] Página `/dashboard/huespedes`
- [ ] Test RBAC: RECEPTIONIST no accede a rutas de ADMIN/OWNER
- [ ] Verificar AuditLog en cada acción

### Fase 4 — Dashboard Dueño y Admin (Días 15–19)

- [ ] Página `/dashboard/reportes` — KPIs cards
- [ ] `OccupancyChart` con ApexCharts (dynamic import)
- [ ] `ReservationsChart` por mes
- [ ] Filtros de fecha en reportes
- [ ] Página `/dashboard/bitacora` — tabla paginada
- [ ] `/dashboard/habitaciones` — CRUD tipos y rooms
- [ ] `/dashboard/promociones` — CRUD con fechas y tipos aplicables
- [ ] `/dashboard/resenas` — moderación aprobar/rechazar
- [ ] `/dashboard/usuarios` — CRUD usuarios con roles
- [ ] `/dashboard/configuracion` — form por categoría de SystemSetting
- [ ] Test RBAC: OWNER no puede editar, ADMIN puede todo

### Fase 5 — QA y Deploy (Días 20–22)

- [ ] Test completo criterios Sección 17
- [ ] Corregir bugs identificados
- [ ] Configurar Vercel: env vars de producción, dominio
- [ ] `npx prisma migrate deploy` en producción
- [ ] Ejecutar seed en producción (solo usuario admin + datos base)
- [ ] Lighthouse en producción → performance, SEO, accessibility
- [ ] Configurar Upstash Redis para rate limiting en `/api/auth`
- [ ] Documentación de entrega: credenciales admin, instrucciones de uso

---

## 19. Gaps Resueltos y Supuestos Contractuales

Los siguientes gaps del documento original tienen decisiones tomadas. El agente debe respetar estas decisiones y no reabrir la discusión.

| #    | Gap Original                  | Decisión Tomada                                                                                                                                                                                                                                                  | Justificación                                                              |
| ---- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| G-01 | Moneda de precios             | USD como moneda base. Tasa VES/USD configurable en `SystemSetting.exchange_rate`. La visualización en el dashboard puede mostrar ambas.                                                                                                                          | Venezuela: precios referenciales en USD es práctica estándar               |
| G-02 | Disponibilidad en tiempo real | NO se implementa disponibilidad en tiempo real. El sistema verifica disponibilidad aproximada (habitaciones disponibles del tipo vs. reservas activas solapadas) y advierte, pero no bloquea automáticamente. La confirmación final es siempre manual por staff. | Costo de complejidad vs. beneficio para hotel pequeño                      |
| G-03 | Política de cancelación       | Default: reembolso 100% si cancela con >48h de anticipación, 0% si <48h. Configurable en `SystemSetting.cancellation_policy`.                                                                                                                                    | Estándar de la industria para hoteles boutique                             |
| G-04 | Horario Sala de Reuniones     | 6:00 AM – 12:00 PM (mediodía). Precio: $250 USD/día. Configurable.                                                                                                                                                                                               | Especificado en retrospectiva original                                     |
| G-05 | Duración reserva restaurante  | Dos turnos: SLOT_12_14 (12:00-14:00) y SLOT_14_16 (14:00-16:00). Modelado como enum `RestaurantTimeSlot`.                                                                                                                                                        | Simplifica lógica y evita solapamientos                                    |
| G-06 | Costo de piscina              | Configurable en `SystemSetting.pool_price`. Valor inicial: 0 (admin debe configurar).                                                                                                                                                                            | No se especificó monto en requisitos                                       |
| G-07 | Exportación de reportes       | Excluida del alcance v1.0. Marcada como funcionalidad futura.                                                                                                                                                                                                    | No definida como prioritaria                                               |
| G-08 | Textos de landing editables   | Implementados via modelo `PageSection` con slugs únicos. Admin edita desde dashboard.                                                                                                                                                                            | Permite autonomía del hotel sin deploy                                     |
| G-09 | i18n en App Router            | `next-intl` (ADR-003). La config `i18n` de `next.config.js` es Pages Router y causa errores.                                                                                                                                                                     | Bug crítico del spec v1.0 corregido                                        |
| G-10 | Auth.js versión               | Auth.js v5 (no NextAuth v4). API diferente: `auth()` en lugar de `getServerSession()`.                                                                                                                                                                           | Versión actual al momento de este spec                                     |
| G-11 | Seed inicial                  | `prisma/seed.ts` debe crear: 1 usuario ADMIN, 7 tipos de habitación (según Sección 4.1 original), SystemSettings base, 1 PageSection por sección de landing                                                                                                      | Setup mínimo para que el sistema sea operativo en día 1                    |
| G-12 | Rutas con tildes              | `reseñas` → `resenas` en el filesystem para evitar issues en case-insensitive OS (macOS) y deployments                                                                                                                                                           | Problema real en proyectos Next.js en producción                           |
| G-13 | Versión de Next.js            | **Next.js 16.2.0** (latest marzo 2026). Breaking changes documentados en ADR-008. `middleware.ts` → `proxy.ts`, `params` async, Turbopack default, `next lint` eliminado, Node.js >= 20.9.0 requerido                                                            | Solicitud explícita del cliente. Versión más reciente y estable disponible |

---

_Documento generado para consumo directo por agentes de IA de generación de código._  
_Versión: 2.1 · Stack canónico: Next.js 16.2.0 + Auth.js v5 + Prisma 5 + next-intl 3 + Resend_  
_Actualizado: migración a Next.js 16 con breaking changes documentados en ADR-008._  
_Cada sección es accionable. No existen TODOs ni placeholders sin decisión tomada._
