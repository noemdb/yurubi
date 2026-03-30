// src/app/[locale]/(admin)/dashboard/recepcionista/manual/page.tsx
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  BookOpen,
  LogIn,
  LogOut,
  CheckCircle,
  XCircle,
  Ban,
  PlusCircle,
  Pencil,
  Calendar,
  Users,
  Building2,
  AlertTriangle,
  ShieldOff,
  ClipboardList,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Manual de Usuario — Recepcionista | Hotel Río Yurubí",
  description:
    "Manual de usuario completo para el rol Recepcionista del sistema de gestión del Hotel Río Yurubí.",
};

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SectionEntry {
  id: string;
  label: string;
}

// ─── TOC Definition ─────────────────────────────────────────────────────────────

const toc: SectionEntry[] = [
  { id: "acceso", label: "1. Acceso al sistema" },
  { id: "pantalla-principal", label: "2. Pantalla principal" },
  { id: "cu01", label: "CU-01 — Ver listado de reservas" },
  { id: "cu02", label: "CU-02 — Ver detalle de una reserva" },
  { id: "cu03", label: "CU-03 — Confirmar una reserva" },
  { id: "cu04", label: "CU-04 — Rechazar una reserva" },
  { id: "cu05", label: "CU-05 — Cancelar una reserva" },
  { id: "cu06", label: "CU-06 — Crear reserva manualmente" },
  { id: "cu07", label: "CU-07 — Editar una reserva" },
  { id: "cu08", label: "CU-08 — Calendario de reservas" },
  { id: "cu09", label: "CU-09 — Listado de huéspedes" },
  // { id: "cu10", label: "CU-10 — Sala de reuniones" },
  // { id: "cu11", label: "CU-11 — Restaurante" },
  { id: "estados", label: "14. Estados de reserva" },
  { id: "errores", label: "15. Errores frecuentes" },
  { id: "restricciones", label: "16. Lo que NO puedes hacer" },
];

// ─── Small reusable UI pieces ───────────────────────────────────────────────────

function SectionHeading({
  id,
  icon,
  children,
}: {
  id: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100 mt-10 mb-4 scroll-mt-8"
    >
      {icon && (
        <span className="text-amber-600 dark:text-amber-400">{icon}</span>
      )}
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mt-5 mb-2">
      {children}
    </h3>
  );
}

function InfoBox({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "tip";
  children: React.ReactNode;
}) {
  const styles = {
    info: "bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-950/40 dark:border-blue-700 dark:text-blue-300",
    warning:
      "bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-300",
    tip: "bg-green-50 border-green-300 text-green-800 dark:bg-green-950/40 dark:border-green-700 dark:text-green-300",
  };
  return (
    <div className={`border-l-4 rounded-r-lg px-4 py-3 my-3 text-sm leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  );
}

function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="list-none space-y-2 my-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 items-start text-sm text-gray-700 dark:text-gray-300">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span dangerouslySetInnerHTML={{ __html: step }} />
        </li>
      ))}
    </ol>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto my-4 rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b last:border-0 border-gray-100 dark:border-gray-800 odd:bg-white even:bg-gray-50/50 dark:odd:bg-transparent dark:even:bg-gray-800/30"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 align-top"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}
    >
      {label}
    </span>
  );
}

function SystemEffect({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300 my-2 pl-2">
      {items.map((item, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </ul>
  );
}

function Divider() {
  return <hr className="my-8 border-gray-200 dark:border-gray-700" />;
}

// ─── Page Component ─────────────────────────────────────────────────────────────

export default async function ManualRecepcionistaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect(`/${locale}/login`);

  return (
    <div className="max-w-full mx-auto pb-20 space-y-0">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0 mt-1">
          <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
            Manual de Usuario — Recepcionista
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Hotel Río Yurubí · Sistema de Gestión · v1.0
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Describe todas las funciones disponibles para el rol <strong className="font-semibold text-gray-700 dark:text-gray-300">Recepcionista</strong>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">

        {/* ── TOC (sticky sidebar) ──────────────────────────────── */}
        <aside className="hidden lg:block sticky top-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Índice
          </p>
          <nav className="space-y-1">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-xs text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg px-2 py-1.5 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* ── Content ──────────────────────────────────────────── */}
        <article className="min-w-0">

          {/* ═══════════════════════════════════════════════ */}
          {/* 1. Acceso al sistema                           */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="acceso" icon={<LogIn className="w-5 h-5" />}>
            1. Acceso al sistema
          </SectionHeading>

          <SubHeading>Cómo iniciar sesión</SubHeading>
          <StepList
            steps={[
              "Abre el navegador y ve a la dirección del sistema proporcionada por el administrador (https://www.hotelrioyurubi.com/login).",
              "Ingresa tu <strong>correo electrónico</strong> y <strong>contraseña</strong>.",
              'Haz clic en <strong>Iniciar sesión</strong>.',
            ]}
          />
          <InfoBox type="warning">
            Si tu cuenta fue desactivada o no recuerdas la contraseña, contacta al administrador del sistema. No puedes recuperar la contraseña por cuenta propia.
          </InfoBox>

          <SubHeading>Cómo cerrar sesión</SubHeading>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Haz clic en tu nombre en la esquina superior del panel y selecciona <strong>Cerrar sesión</strong>. Siempre cierra sesión al terminar tu turno, especialmente en computadoras compartidas.
          </p>

          <SubHeading>Qué ves al entrar</SubHeading>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Al iniciar sesión serás dirigido automáticamente a{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 text-xs font-mono">/dashboard/recepcionista</code>{" "}
            — tu pantalla de trabajo principal.
          </p>

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* 2. Pantalla principal                          */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="pantalla-principal" icon={<ClipboardList className="w-5 h-5" />}>
            2. Pantalla principal — Panel de reservas
          </SectionHeading>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">La pantalla principal muestra:</p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 dark:text-gray-300 pl-2">
            <li><strong>Tabla de reservas</strong> con columnas: ID, Huésped, Tipo de habitación, Check-in, Check-out, Huéspedes, Estado, Fecha de creación.</li>
            <li><strong>Filtros</strong> en la parte superior: por estado y por rango de fechas.</li>
            <li>Botón <strong>&quot;Nueva reserva&quot;</strong> para crear una reserva manualmente.</li>
            <li><strong>Enlace al calendario</strong> para ver las reservas en formato visual por fecha.</li>
          </ul>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Las reservas más recientes aparecen primero por defecto.</p>

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* CU-01                                          */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="cu01" icon={<ClipboardList className="w-5 h-5" />}>
            CU-01 — Ver listado de reservas
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Objetivo:</span> Consultar y filtrar todas las reservas registradas en el sistema.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span>{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 text-xs font-mono">/dashboard/recepcionista/reservas</code>
          </p>
          <StepList
            steps={[
              "Al entrar al dashboard, ya estás en el listado de reservas.",
              "Usa los filtros de estado para ver solo las reservas que necesitas: <strong>PENDING</strong> (nuevas), <strong>CONFIRMED</strong>, <strong>REJECTED</strong>, <strong>CANCELLED</strong>, <strong>COMPLETED</strong>.",
              "Usa el filtro de fechas para acotar por rango de check-in o fecha de creación.",
              "Haz clic en cualquier fila para ver el detalle completo de esa reserva.",
            ]}
          />
          <DataTable
            headers={["Columna", "Descripción"]}
            rows={[
              ["ID", "Código único de la reserva (últimos 8 caracteres)"],
              ["Huésped", "Nombre completo del huésped"],
              ["Habitación", "Tipo de habitación solicitado"],
              ["Check-in", "Fecha de entrada"],
              ["Check-out", "Fecha de salida"],
              ["Noches", "Número de noches calculado automáticamente"],
              ["Personas", "Cantidad de huéspedes"],
              ["Estado", "Estado actual de la reserva"],
              ["Creada", "Fecha en que se registró la solicitud"],
            ]}
          />
          <InfoBox type="tip">
            Filtra por <strong>PENDING</strong> al inicio de cada turno para identificar las reservas que requieren tu atención inmediata.
          </InfoBox>

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* CU-02                                          */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="cu02" icon={<ClipboardList className="w-5 h-5" />}>
            CU-02 — Ver detalle de una reserva
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span>{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 text-xs font-mono">/dashboard/reservas/[id]</code>
          </p>
          <StepList
            steps={[
              "En el listado, haz clic sobre la fila de la reserva que deseas revisar.",
              "Se abre la página de detalle con toda la información organizada en secciones.",
            ]}
          />
          <SubHeading>Información disponible en el detalle</SubHeading>
          <div className="grid sm:grid-cols-2 gap-3 my-3">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Datos de la reserva</p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {["Tipo y número de habitación", "Fechas de check-in / check-out", "N.º de noches y huéspedes", "Precio total (USD)", "Método de pago", "Referencia de pago", "Observaciones del huésped", "Idioma (ES / EN)", "Estado actual"].map((i) => (
                  <li key={i} className="flex gap-1.5"><span className="text-amber-500 mt-0.5">›</span>{i}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Datos del huésped</p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {["Nombre completo", "Cédula / RIF / Pasaporte", "Correo electrónico", "Teléfono", "Dirección", "Procedencia"].map((i) => (
                  <li key={i} className="flex gap-1.5"><span className="text-amber-500 mt-0.5">›</span>{i}</li>
                ))}
              </ul>
            </div>
          </div>
          <InfoBox type="info">
            <strong>Historial de acciones (bitácora):</strong> Cada cambio de estado registrado, quién lo hizo y cuándo.
          </InfoBox>

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* CU-03                                          */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="cu03" icon={<CheckCircle className="w-5 h-5" />}>
            CU-03 — Confirmar una reserva
          </SectionHeading>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full font-medium">Disponible cuando: PENDING</span>
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-medium">Resultado: CONFIRMED + email al huésped</span>
          </div>
          <StepList
            steps={[
              "Abre la reserva desde el listado (CU-02).",
              "Verifica que la información es correcta: fechas, tipo de habitación, número de personas, método de pago.",
              "Confirma externamente que el huésped realizó o acordó el pago adelantado.",
              'Haz clic en <strong>"Confirmar reserva"</strong>.',
              "El sistema actualiza el estado a <strong>CONFIRMED</strong> de forma inmediata.",
              "El huésped recibe un correo automático con los detalles de su reserva confirmada.",
            ]}
          />
          <SubHeading>Lo que ocurre en el sistema</SubHeading>
          <SystemEffect
            items={[
              "Estado cambia: <code class='text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded'>PENDING → CONFIRMED</code>",
              "Se registra en la bitácora: acción <strong>CONFIRM</strong>, tu usuario, fecha y hora exacta.",
              "Se envía email de confirmación al correo del huésped.",
            ]}
          />
          <InfoBox type="warning">
            Solo puedes confirmar reservas en estado <strong>PENDING</strong>. Si confirmas una reserva por error, deberás cancelarla (CU-05) y notificar al administrador.
          </InfoBox>

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* CU-04                                          */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="cu04" icon={<XCircle className="w-5 h-5" />}>
            CU-04 — Rechazar una reserva
          </SectionHeading>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full font-medium">Disponible cuando: PENDING</span>
            <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full font-medium">Resultado: REJECTED + email al huésped</span>
          </div>
          <StepList
            steps={[
              "Abre la reserva desde el listado (CU-02).",
              'Haz clic en <strong>"Rechazar reserva"</strong>.',
              'Se abrirá un campo de texto. <strong>Escribe el motivo del rechazo</strong> — obligatorio.<br/><em class="text-gray-500 dark:text-gray-400 text-xs">Ej: "No disponemos de habitaciones del tipo solicitado para esas fechas."</em>',
              'Haz clic en <strong>"Confirmar rechazo"</strong>.',
              "El sistema actualiza el estado a <strong>REJECTED</strong> de forma inmediata.",
              "El huésped recibe un correo de notificación.",
            ]}
          />
          <InfoBox type="warning">
            El motivo de rechazo es <strong>obligatorio</strong>. Una reserva rechazada <strong>no puede ser reactivada</strong>. Si fue un error, comunícalo al administrador.
          </InfoBox>

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* CU-05                                          */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="cu05" icon={<Ban className="w-5 h-5" />}>
            CU-05 — Cancelar una reserva
          </SectionHeading>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full font-medium">Disponible cuando: PENDING o CONFIRMED</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full font-medium">No disponible: COMPLETED</span>
          </div>
          <StepList
            steps={[
              "Abre la reserva desde el listado (CU-02).",
              'Haz clic en <strong>"Cancelar reserva"</strong>.',
              'Escribe el motivo de la cancelación — obligatorio.<br/><em class="text-gray-500 dark:text-gray-400 text-xs">Ej: "Cancelación solicitada por el huésped vía teléfono."</em>',
              'Haz clic en <strong>"Confirmar cancelación"</strong>.',
              "El estado cambia a <strong>CANCELLED</strong> de forma inmediata.",
            ]}
          />
          <SubHeading>Política de reembolso (referencia)</SubHeading>
          <DataTable
            headers={["Condición", "Resultado"]}
            rows={[
              ["Cancelación con +48 horas de anticipación al check-in", "Reembolso del 100 %"],
              ["Cancelación con menos de 48 horas", "Sin reembolso"],
            ]}
          />
          <InfoBox type="info">
            El sistema no procesa reembolsos automáticamente — todos los pagos son offline. Consulta con el administrador ante casos especiales.
          </InfoBox>

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* CU-06                                          */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="cu06" icon={<PlusCircle className="w-5 h-5" />}>
            CU-06 — Crear una reserva manualmente
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Objetivo:</span> Registrar una reserva realizada por teléfono, en persona o por cualquier canal distinto al formulario web.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span>{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 text-xs font-mono">/dashboard/recepcionista/nueva-reserva</code>
          </p>

          <SubHeading>Sección 1 — Datos de la reserva</SubHeading>
          <DataTable
            headers={["Campo", "Descripción", "¿Obligatorio?"]}
            rows={[
              ["Tipo de habitación", "Sencilla, Doble, Triple, Familiar, etc.", "✅"],
              ["Fecha de check-in", "Fecha de entrada del huésped", "✅"],
              ["Fecha de check-out", "Debe ser posterior al check-in", "✅"],
              ["Número de personas", "No puede exceder la capacidad del tipo", "✅"],
            ]}
          />

          <SubHeading>Sección 2 — Datos del huésped</SubHeading>
          <DataTable
            headers={["Campo", "Descripción", "¿Obligatorio?"]}
            rows={[
              ["Nombre completo", "Nombre y apellido", "✅"],
              ["Correo electrónico", "Para envío de notificaciones", "✅"],
              ["Teléfono", "Formato internacional (+58XXXXXXXXXX)", "✅"],
              ["Cédula / RIF / Pasaporte", "Documento de identidad", "✅"],
              ["Dirección", "Dirección del huésped", "✅"],
              ["Procedencia", "Ciudad y país de origen", "✅"],
            ]}
          />
          <InfoBox type="tip">
            Si el huésped ya tiene una reserva anterior, sus datos se recuperarán automáticamente al ingresar el correo electrónico.
          </InfoBox>

          <SubHeading>Sección 3 — Pago y observaciones</SubHeading>
          <DataTable
            headers={["Campo", "Descripción", "¿Obligatorio?"]}
            rows={[
              ["Método de pago", "Transferencia / Zelle / Efectivo", "✅"],
              ["Referencia de pago", "Número de referencia si ya pagó", "❌"],
              ["Observaciones", "Notas internas sobre la reserva", "❌"],
              ["Idioma", "Español o Inglés (para el email al huésped)", "✅"],
            ]}
          />

          <SubHeading>Validaciones automáticas</SubHeading>
          <SystemEffect
            items={[
              "El check-out debe ser posterior al check-in.",
              "El número de personas no puede exceder la capacidad máxima del tipo de habitación elegido.",
              "Todos los campos obligatorios deben estar completos.",
              "Si no hay habitaciones disponibles, el sistema muestra una advertencia — pero la decisión final es tuya.",
            ]}
          />

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* CU-07                                          */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="cu07" icon={<Pencil className="w-5 h-5" />}>
            CU-07 — Editar una reserva existente
          </SectionHeading>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full font-medium">Disponible cuando: PENDING o CONFIRMED</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full font-medium">No disponible: COMPLETED · REJECTED · CANCELLED</span>
          </div>
          <StepList
            steps={[
              "Abre la reserva desde el listado (CU-02).",
              'Haz clic en <strong>"Editar reserva"</strong>.',
              "Modifica los campos necesarios. Los campos disponibles son los mismos que en la creación (CU-06).",
              'Haz clic en <strong>"Guardar cambios"</strong>.',
              "El sistema actualiza la reserva y registra el cambio en la bitácora.",
            ]}
          />
          <InfoBox type="warning">
            Si cambias las fechas de una reserva <strong>CONFIRMED</strong>, verifica manualmente la disponibilidad — el sistema no lo hace en tiempo real. Cambiar el correo del huésped no reenvía los correos anteriores.
          </InfoBox>

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* CU-08                                          */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="cu08" icon={<Calendar className="w-5 h-5" />}>
            CU-08 — Ver el calendario de reservas
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span>{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 text-xs font-mono">/dashboard/calendario</code>
          </p>
          <StepList
            steps={[
              'En la página de reservas, haz clic en <strong>"Vista calendario"</strong>.',
              "Navega entre meses con las flechas de navegación.",
              "Cada reserva confirmada aparece como un bloque en las fechas de check-in a check-out.",
              "Haz clic sobre un bloque para ir al detalle de esa reserva.",
            ]}
          />
          <div className="flex flex-wrap gap-3 my-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> CONFIRMED
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> PENDING
            </span>
          </div>
          <InfoBox type="info">
            El calendario es una <strong>vista de consulta</strong>. No puedes crear ni modificar reservas directamente desde el calendario.
          </InfoBox>

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* CU-09                                          */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="cu09" icon={<Users className="w-5 h-5" />}>
            CU-09 — Ver el listado de huéspedes
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span>{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 text-xs font-mono">/dashboard/huespedes</code>
          </p>
          <StepList
            steps={[
              'En el menú lateral, haz clic en <strong>"Huéspedes"</strong>.',
              "Se muestra una tabla paginada con todos los huéspedes registrados.",
              "Puedes buscar por nombre, correo electrónico o número de documento.",
              "Haz clic en un huésped para ver sus datos completos y el historial de sus reservas.",
            ]}
          />
          <DataTable
            headers={["Dato", "Descripción"]}
            rows={[
              ["Nombre completo", "—"],
              ["Correo electrónico", "—"],
              ["Teléfono", "—"],
              ["Documento de identidad", "Cédula / RIF / Pasaporte"],
              ["Dirección", "—"],
              ["Procedencia", "Ciudad / País"],
              ["Reservas", "Historial de reservas asociadas"],
            ]}
          />
          <InfoBox type="info">
            Esta sección es de <strong>solo lectura</strong> desde el listado. Los datos del huésped se crean automáticamente al registrar una nueva reserva.
          </InfoBox>

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* CU-10                                          */}
          {/* ═══════════════════════════════════════════════ */}
          {/* <SectionHeading id="cu10" icon={<Building2 className="w-5 h-5" />}>
            CU-10 — Gestionar reservas de sala de reuniones
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span>{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 text-xs font-mono">/dashboard/servicios/sala-reuniones</code>
          </p>
          <SubHeading>Características de la sala</SubHeading>
          <DataTable
            headers={["Parámetro", "Valor"]}
            rows={[
              ["Capacidad máxima", "30 personas"],
              ["Horario disponible", "6:00 AM – 12:00 PM"],
              ["Precio", "$250 USD / día (configurable por el administrador)"],
              ["Equipamiento", "Aire acondicionado, mesas, sillas, video beam, pantalla, WiFi, café"],
            ]}
          />
          <StepList
            steps={[
              'Ve a <strong>Servicios → Sala de reuniones</strong> en el menú lateral.',
              "Verás el listado de solicitudes filtrable por estado (PENDING, CONFIRMED, CANCELLED).",
              "Haz clic en una solicitud para ver el detalle.",
              "Desde el detalle: <strong>Confirmar</strong>, <strong>Rechazar</strong> (motivo obligatorio) o <strong>Cancelar</strong> (motivo obligatorio).",
              "Cada acción queda registrada en la bitácora del sistema.",
            ]}
          /> */}

          {/* <Divider /> */}

          {/* ═══════════════════════════════════════════════ */}
          {/* CU-11                                          */}
          {/* ═══════════════════════════════════════════════ */}
          {/* <SectionHeading id="cu11" icon={<Building2 className="w-5 h-5" />}>
            CU-11 — Gestionar reservas de restaurante
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span>{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 text-xs font-mono">/dashboard/servicios/restaurante</code>
          </p>
          <DataTable
            headers={["Parámetro", "Valor"]}
            rows={[
              ["Capacidad máxima", "80 personas"],
              ["Horario de atención", "12:00 PM – 4:00 PM"],
              ["Turno 1", "12:00 PM – 2:00 PM"],
              ["Turno 2", "2:00 PM – 4:00 PM"],
            ]}
          />
          <StepList
            steps={[
              'Ve a <strong>Servicios → Restaurante</strong> en el menú lateral.',
              "Verás el listado de solicitudes filtrable por estado y fecha.",
              "Haz clic en una solicitud para ver el detalle.",
              "Desde el detalle: <strong>Confirmar</strong>, <strong>Rechazar</strong> o <strong>Cancelar</strong> (motivo obligatorio en rechazo/cancelación).",
              "Cada acción queda registrada en la bitácora del sistema.",
            ]}
          />
          <InfoBox type="info">
            <strong>Nota sobre la piscina:</strong> Las visitas a la piscina <strong>no requieren reserva</strong>. El precio de acceso está publicado en la web del hotel. No hay gestión de piscina en el sistema.
          </InfoBox> */}

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* 14. Estados                                     */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="estados" icon={<ClipboardList className="w-5 h-5" />}>
            14. Estados de reserva — Referencia rápida
          </SectionHeading>
          <DataTable
            headers={["Estado", "Significado", "Confirmar", "Rechazar", "Cancelar", "Editar"]}
            rows={[
              [<Badge key="p" label="PENDING" color="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" />, "Solicitud pendiente de revisión", "✅", "✅", "✅", "✅"],
              [<Badge key="c" label="CONFIRMED" color="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" />, "Aprobada por staff", "—", "—", "✅", "✅"],
              [<Badge key="r" label="REJECTED" color="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" />, "Denegada por staff", "—", "—", "—", "—"],
              [<Badge key="ca" label="CANCELLED" color="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400" />, "Cancelada", "—", "—", "—", "—"],
              [<Badge key="co" label="COMPLETED" color="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" />, "Check-out realizado", "—", "—", "—", "—"],
            ]}
          />
          <SubHeading>Diagrama de flujo de estados</SubHeading>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 my-3 font-mono text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
            <pre>{`PENDING ──→ CONFIRMED ──→ COMPLETED
   │              │
   └──→ REJECTED  └──→ CANCELLED
   │
   └──→ CANCELLED`}</pre>
          </div>

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* 15. Errores frecuentes                          */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="errores" icon={<AlertTriangle className="w-5 h-5" />}>
            15. Errores frecuentes y soluciones
          </SectionHeading>
          <DataTable
            headers={["Situación", "Causa probable", "Solución"]}
            rows={[
              ["El botón \"Confirmar\" no aparece", "La reserva no está en estado PENDING", "Verifica el estado actual en el detalle"],
              ["No puedo cancelar la reserva", "La reserva está en estado COMPLETED", "Las reservas completadas no se pueden cancelar. Consulta al administrador."],
              ["El campo de motivo no deja guardar", "Es un campo obligatorio para Rechazar y Cancelar", "Escribe una razón antes de confirmar la acción"],
              ["Advertencia de disponibilidad al crear", "Puede haber reservas solapadas para ese tipo de habitación", "Verifica en el calendario y decide con criterio. El sistema no bloquea automáticamente."],
              ["No aparece el número de noches", "Las fechas no están completas o check-out < check-in", "Revisa que ambas fechas estén ingresadas correctamente"],
              ["No puedo acceder a Configuración o Reportes", "No tienes permiso — secciones de Admin/Dueño", "Es el comportamiento esperado. Contacta al administrador."],
              ["El sistema me redirige al inicio", "Sesión expirada", "Inicia sesión nuevamente"],
            ]}
          />

          <Divider />

          {/* ═══════════════════════════════════════════════ */}
          {/* 16. Restricciones                               */}
          {/* ═══════════════════════════════════════════════ */}
          <SectionHeading id="restricciones" icon={<ShieldOff className="w-5 h-5" />}>
            16. Lo que NO puedes hacer con este rol
          </SectionHeading>
          <InfoBox type="warning">
            El sistema te bloqueará automáticamente si intentas acceder a las siguientes funciones. Están reservadas para el Administrador o el Dueño.
          </InfoBox>
          <DataTable
            headers={["Función bloqueada", "Rol requerido"]}
            rows={[
              ["Ver reportes y KPIs de ocupación", "Dueño / Admin"],
              ["Ver bitácora de auditoría completa", "Dueño / Admin"],
              ["Gestionar tipos de habitación (crear, editar, desactivar)", "Admin"],
              ["Gestionar promociones", "Admin"],
              ["Moderar reseñas de huéspedes", "Admin"],
              ["Crear, editar o desactivar usuarios del sistema", "Admin"],
              ["Editar configuración del sistema (precios, políticas, datos de pago)", "Admin"],
              ["Editar contenido de la página web del hotel", "Admin"],
            ]}
          />

          {/* ── Footer note ─────────────────────────────── */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500 text-center">
            Manual de usuario v1.0 · Hotel Río Yurubí · Rol: RECEPTIONIST
            <br />
            Derivado del SPEC TÉCNICO v2.1 · Para soporte técnico, contacta al administrador del sistema.
          </div>

        </article>
      </div>
    </div>
  );
}
