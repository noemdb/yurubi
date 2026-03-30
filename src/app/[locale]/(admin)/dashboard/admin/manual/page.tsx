// src/app/[locale]/(admin)/dashboard/admin/manual/page.tsx
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  BookOpen,
  LogIn,
  Users,
  Bed,
  Tags,
  Star,
  Globe,
  Settings,
  BarChart2,
  ScrollText,
  AlertTriangle,
  ShieldCheck,
  ClipboardList,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Manual de Usuario — Administrador | Hotel Río Yurubí",
  description:
    "Manual de usuario completo para el rol Administrador del sistema de gestión del Hotel Río Yurubí.",
};

// ─── TOC ───────────────────────────────────────────────────────────────────────

const toc = [
  { id: "acceso",       label: "1. Acceso al sistema" },
  { id: "mapa",         label: "2. Mapa de funciones exclusivas" },
  { id: "cu01",         label: "CU-01 — Gestionar usuarios" },
  { id: "cu02",         label: "CU-02 — Tipos de habitación" },
  { id: "cu03",         label: "CU-03 — Habitaciones físicas" },
  { id: "cu04",         label: "CU-04 — Gestionar promociones" },
  { id: "cu05",         label: "CU-05 — Moderar reseñas" },
  { id: "cu06",         label: "CU-06 — Contenido de la web" },
  { id: "cu07",         label: "CU-07 — Configurar el sistema" },
  { id: "cu08",         label: "CU-08 — Reportes y KPIs" },
  { id: "cu09",         label: "CU-09 — Bitácora de auditoría" },
  { id: "heredadas",    label: "12. Funciones heredadas" },
  { id: "errores",      label: "13. Errores frecuentes" },
  { id: "responsabilidades", label: "14. Responsabilidades críticas" },
];

// ─── Reusable UI pieces ─────────────────────────────────────────────────────────

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
  type?: "info" | "warning" | "tip" | "caution";
  children: React.ReactNode;
}) {
  const styles = {
    info:    "bg-blue-50   border-blue-300   text-blue-800   dark:bg-blue-950/40   dark:border-blue-700   dark:text-blue-300",
    warning: "bg-amber-50  border-amber-300  text-amber-800  dark:bg-amber-950/40  dark:border-amber-700  dark:text-amber-300",
    tip:     "bg-green-50  border-green-300  text-green-800  dark:bg-green-950/40  dark:border-green-700  dark:text-green-300",
    caution: "bg-red-50    border-red-300    text-red-800    dark:bg-red-950/40    dark:border-red-700    dark:text-red-300",
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

function Code({ children }: { children: string }) {
  return (
    <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-amber-600 dark:text-amber-400 text-xs font-mono">
      {children}
    </code>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 dark:text-gray-300 pl-2 my-2">
      {items.map((item, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </ul>
  );
}

function Divider() {
  return <hr className="my-8 border-gray-200 dark:border-gray-700" />;
}

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
      <span className="w-4 h-4 border-2 border-amber-400 rounded mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default async function ManualAdminPage({
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
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0 mt-1">
          <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
            Manual de Usuario — Administrador
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Hotel Río Yurubí · Sistema de Gestión · v1.0
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Acceso <strong className="font-semibold text-gray-700 dark:text-gray-300">completo</strong> al sistema — incluye funciones de Recepcionista y Dueño más las exclusivas de Admin.
          </p>
        </div>
      </div>

      <InfoBox type="caution">
        <strong>Atención:</strong> Una acción mal ejecutada (desactivar un usuario, cambiar precios, modificar configuración) tiene efecto inmediato en la operación del hotel. Lee cada sección antes de actuar.
      </InfoBox>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start mt-6">

        {/* ── TOC sidebar ──────────────────────────────────────── */}
        <aside className="hidden lg:block sticky top-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Índice
          </p>
          <nav className="space-y-1">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-xs text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg px-2 py-1.5 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* ── Content ──────────────────────────────────────────── */}
        <article className="min-w-0">

          {/* ════════════════════════════════════════════════ */}
          {/* 1. Acceso al sistema                            */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="acceso" icon={<LogIn className="w-5 h-5" />}>
            1. Acceso al sistema
          </SectionHeading>

          <SubHeading>Cómo iniciar sesión</SubHeading>
          <StepList steps={[
            "Abre el navegador y ve a la dirección del sistema (<strong>https://www.hotelrioyurubi.com/login</strong>).",
            "Ingresa tu <strong>correo electrónico</strong> y <strong>contraseña</strong> de administrador.",
            'Haz clic en <strong>Iniciar sesión</strong>.',
          ]} />

          <SubHeading>Requisitos de contraseña</SubHeading>
          <BulletList items={[
            "Al menos <strong>8 caracteres</strong>",
            "Al menos <strong>una letra mayúscula</strong>",
            "Al menos <strong>una letra minúscula</strong>",
            "Al menos <strong>un número</strong>",
          ]} />
          <InfoBox type="info">
            Si necesitas cambiar la contraseña de otro usuario, puedes hacerlo desde la gestión de usuarios (CU-01). Para cambiar la tuya propia, contacta a otro administrador o usa la opción de perfil.
          </InfoBox>

          <SubHeading>Al entrar</SubHeading>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Serás dirigido al panel de reservas (<Code>/dashboard/reservas</Code>). Desde el menú lateral tienes acceso a <strong>todas</strong> las secciones del sistema.
          </p>

          <Divider />

          {/* ════════════════════════════════════════════════ */}
          {/* 2. Mapa de funciones                            */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="mapa" icon={<ShieldCheck className="w-5 h-5" />}>
            2. Mapa de funciones exclusivas del Administrador
          </SectionHeading>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Las siguientes funciones son <strong>exclusivas de este rol</strong>. Ni el Recepcionista ni el Dueño pueden acceder a ellas.
          </p>
          <DataTable
            headers={["Función", "Sección en el menú", "Ruta del sistema"]}
            rows={[
              ["Crear / editar / desactivar usuarios", "Usuarios", <Code key="a">/dashboard/usuarios</Code>],
              ["Crear / editar tipos de habitación", "Habitaciones", <Code key="b">/dashboard/habitaciones</Code>],
              ["Crear / editar habitaciones físicas", "Habitaciones", <Code key="c">/dashboard/habitaciones</Code>],
              ["Crear / editar / desactivar promociones", "Promociones", <Code key="d">/dashboard/promociones</Code>],
              ["Aprobar o rechazar reseñas", "Reseñas", <Code key="e">/dashboard/resenas</Code>],
              ["Editar textos y contenido de la web", "Contenido", <Code key="f">/dashboard/configuracion</Code>],
              ["Configurar precios, políticas y pagos", "Configuración", <Code key="g">/dashboard/configuracion</Code>],
            ]}
          />
          <InfoBox type="tip">
            El Administrador también puede hacer <strong>todo lo que hace el Recepcionista</strong> y <strong>todo lo que ve el Dueño</strong> (reportes, KPIs, bitácora).
          </InfoBox>

          <Divider />

          {/* ════════════════════════════════════════════════ */}
          {/* CU-01 — Usuarios                                */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="cu01" icon={<Users className="w-5 h-5" />}>
            CU-01 — Gestionar usuarios del sistema
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span> <Code>/dashboard/usuarios</Code>
          </p>

          <SubHeading>Roles asignables</SubHeading>
          <DataTable
            headers={["Rol", "Descripción"]}
            rows={[
              [<Code key="r">RECEPTIONIST</Code>, "Gestiona reservas, huéspedes y servicios"],
              [<Code key="o">OWNER</Code>, "Solo lectura: ve reportes, KPIs y bitácora"],
              [<Code key="a">ADMIN</Code>, "Acceso completo al sistema"],
            ]}
          />
          <InfoBox type="info">
            Los huéspedes del hotel <strong>no tienen cuenta</strong> en el sistema. Solo el personal interno tiene acceso al dashboard.
          </InfoBox>

          <SubHeading>Crear un usuario nuevo</SubHeading>
          <StepList steps={[
            'Ve a <strong>Usuarios</strong> en el menú lateral.',
            'Haz clic en <strong>"Nuevo usuario"</strong>.',
            "Completa el formulario con nombre completo, correo electrónico, contraseña y rol.",
            'Haz clic en <strong>"Crear usuario"</strong>.',
            "El nuevo usuario ya puede iniciar sesión inmediatamente.",
          ]} />
          <DataTable
            headers={["Campo", "Descripción", "¿Obligatorio?"]}
            rows={[
              ["Nombre completo", "Nombre y apellido del colaborador", "✅"],
              ["Correo electrónico", "Será el usuario de acceso al sistema", "✅"],
              ["Contraseña", "Mín. 8 caracteres, mayúscula + minúscula + número", "✅"],
              ["Rol", "RECEPTIONIST / OWNER / ADMIN", "✅"],
            ]}
          />
          <InfoBox type="warning">
            La contraseña se guarda <strong>encriptada</strong>. Nadie puede verla después de creada. Si el usuario la olvida, deberás asignarle una nueva desde la edición.
          </InfoBox>

          <SubHeading>Editar un usuario</SubHeading>
          <StepList steps={[
            "En el listado de usuarios, haz clic en el usuario que deseas modificar.",
            "Puedes cambiar: nombre, correo electrónico, contraseña y rol.",
            'Haz clic en <strong>"Guardar cambios"</strong>.',
          ]} />
          <InfoBox type="warning">
            Cambiar el correo de un usuario cambia también su credencial de acceso. <strong>Notifícale el cambio.</strong>
          </InfoBox>

          <SubHeading>Desactivar un usuario</SubHeading>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Cuando un colaborador deja el hotel, <strong>no se elimina</strong> su cuenta — se desactiva. Esto preserva el historial en la bitácora.
          </p>
          <StepList steps={[
            "En el listado, haz clic en el usuario.",
            'Desactiva el interruptor <strong>"Cuenta activa"</strong>.',
            "Guarda los cambios.",
          ]} />
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            Un usuario desactivado <strong>no puede iniciar sesión</strong> aunque conozca su contraseña.
          </p>

          <SubHeading>Reactivar un usuario</SubHeading>
          <StepList steps={[
            'Activa el filtro <strong>"Mostrar inactivos"</strong> si es necesario.',
            "Haz clic en el usuario.",
            'Activa el interruptor <strong>"Cuenta activa"</strong> y guarda.',
          ]} />
          <InfoBox type="tip">
            <strong>Recomendación:</strong> Mantén al menos dos cuentas de Administrador activas por seguridad. Todas las acciones sobre usuarios quedan registradas en la bitácora.
          </InfoBox>

          <Divider />

          {/* ════════════════════════════════════════════════ */}
          {/* CU-02 — Tipos de habitación                     */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="cu02" icon={<Bed className="w-5 h-5" />}>
            CU-02 — Gestionar tipos de habitación
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span> <Code>/dashboard/habitaciones</Code>{" "}(pestaña Tipos)
          </p>

          <SubHeading>Tipos predefinidos en el sistema</SubHeading>
          <DataTable
            headers={["Tipo", "Capacidad máxima"]}
            rows={[
              ["Sencilla", "1 persona"],
              ["Doble", "2 personas"],
              ["Triple", "3 personas"],
              ["Familiar", "4–6 personas"],
              ["Matrimonial Pequeña", "2 personas"],
              ["Matrimonial Grande", "2 personas"],
              ["Mini Apartamento", "4 personas"],
            ]}
          />

          <SubHeading>Crear un tipo de habitación</SubHeading>
          <StepList steps={[
            'Ve a <strong>Habitaciones</strong> → pestaña <strong>Tipos</strong>.',
            'Haz clic en <strong>"Nuevo tipo"</strong>.',
            "Completa el formulario.",
            'El campo <strong>"Activo"</strong> viene marcado por defecto.',
            'Haz clic en <strong>"Crear tipo"</strong>.',
          ]} />
          <DataTable
            headers={["Campo", "Descripción", "¿Obligatorio?"]}
            rows={[
              ["Nombre", 'Ej: "Sencilla", "Suite Presidencial"', "✅"],
              ["Slug", "Identificador en URL, sin tildes ni espacios", "✅"],
              ["Precio base", "Precio por noche en USD", "✅"],
              ["Capacidad máxima", "Número máximo de personas permitidas", "✅"],
              ["Descripción", "Texto descriptivo que aparece en la web", "❌"],
              ["Comodidades", "Lista de amenidades (WiFi, AC, TV, etc.)", "❌"],
              ["Imágenes", "URLs de las fotos del tipo de habitación", "❌"],
            ]}
          />

          <SubHeading>Editar un tipo de habitación</SubHeading>
          <StepList steps={[
            "En el listado de tipos, haz clic en el que deseas modificar.",
            "Actualiza los campos necesarios.",
            "Guarda los cambios.",
          ]} />
          <InfoBox type="warning">
            Si cambias el <strong>precio base</strong>, el nuevo precio aplica solo a las reservas futuras. Las reservas ya creadas conservan el precio original.
          </InfoBox>

          <SubHeading>Desactivar un tipo de habitación</SubHeading>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Un tipo desactivado deja de aparecer en la web y no puede ser seleccionado en nuevas reservas. Las reservas existentes no se ven afectadas.
          </p>
          <StepList steps={[
            "Abre el tipo de habitación.",
            'Desactiva el interruptor <strong>"Activo"</strong>.',
            "Guarda los cambios.",
          ]} />

          <Divider />

          {/* ════════════════════════════════════════════════ */}
          {/* CU-03 — Habitaciones físicas                    */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="cu03" icon={<Bed className="w-5 h-5" />}>
            CU-03 — Gestionar habitaciones físicas
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span> <Code>/dashboard/habitaciones</Code>{" "}(pestaña Habitaciones)
          </p>
          <InfoBox type="info">
            Las habitaciones físicas son los cuartos reales del hotel (101, 102, etc.). Son distintas de los <em>tipos</em> — un tipo puede tener múltiples habitaciones físicas asociadas.
          </InfoBox>

          <SubHeading>Registrar una habitación física</SubHeading>
          <StepList steps={[
            'Ve a <strong>Habitaciones</strong> → pestaña <strong>Habitaciones</strong>.',
            'Haz clic en <strong>"Nueva habitación"</strong>.',
            "Completa el formulario.",
            'El campo <strong>"Disponible"</strong> viene activado por defecto.',
          ]} />
          <DataTable
            headers={["Campo", "Descripción", "¿Obligatorio?"]}
            rows={[
              ["Número de habitación", 'Ej: "101", "202" — debe ser único en el hotel', "✅"],
              ["Piso", "Número de piso", "❌"],
              ["Tipo de habitación", "Selecciona el tipo al que pertenece", "✅"],
              ["Notas internas", "Observaciones de mantenimiento o características especiales", "❌"],
            ]}
          />

          <SubHeading>Bloquear una habitación (mantenimiento)</SubHeading>
          <StepList steps={[
            "Abre la habitación.",
            'Desactiva el interruptor <strong>"Disponible"</strong>.',
            "Agrega una nota explicativa en el campo de notas.",
            "Guarda los cambios.",
          ]} />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Una habitación bloqueada no será asignada a nuevas reservas. Reactívala cuando esté disponible nuevamente.
          </p>

          <Divider />

          {/* ════════════════════════════════════════════════ */}
          {/* CU-04 — Promociones                             */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="cu04" icon={<Tags className="w-5 h-5" />}>
            CU-04 — Gestionar promociones
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span> <Code>/dashboard/promociones</Code>
          </p>

          <SubHeading>Crear una promoción</SubHeading>
          <StepList steps={[
            'Ve a <strong>Promociones</strong> en el menú lateral.',
            'Haz clic en <strong>"Nueva promoción"</strong>.',
            "Completa el formulario en sus secciones.",
            'El campo <strong>"Activa"</strong> viene marcado por defecto.',
            'Haz clic en <strong>"Crear promoción"</strong>.',
          ]} />

          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-1">Información general</p>
          <DataTable
            headers={["Campo", "Descripción", "¿Obligatorio?"]}
            rows={[
              ["Título (español)", "Nombre visible de la oferta", "✅"],
              ["Título (inglés)", "Versión en inglés del título", "❌"],
              ["Descripción (español)", "Detalle de la promoción", "✅"],
              ["Descripción (inglés)", "Versión en inglés de la descripción", "❌"],
              ["Imagen", "URL de la imagen de la promoción", "❌"],
            ]}
          />

          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-1">Descuento</p>
          <DataTable
            headers={["Campo", "Descripción", "¿Obligatorio?"]}
            rows={[
              ["Tipo de descuento", "Porcentaje (ej: 15%) o Monto fijo (ej: $20 USD)", "✅"],
              ["Valor", "Número del descuento (porcentaje: 0–100; fijo: USD)", "✅"],
            ]}
          />

          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-1">Vigencia</p>
          <DataTable
            headers={["Campo", "Descripción", "¿Obligatorio?"]}
            rows={[
              ["Fecha de inicio", "Desde cuándo aplica la promoción", "✅"],
              ["Fecha de fin", "Hasta cuándo aplica (debe ser posterior)", "✅"],
            ]}
          />

          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-1">Aplicabilidad</p>
          <DataTable
            headers={["Campo", "Descripción", "¿Obligatorio?"]}
            rows={[
              ["Tipos de habitación aplicables", "Selecciona uno o más tipos a los que aplica el descuento", "✅ (mínimo 1)"],
              ["Condiciones (español)", "Texto con restricciones o requisitos de la oferta", "❌"],
              ["Condiciones (inglés)", "Versión en inglés de las condiciones", "❌"],
            ]}
          />

          <SubHeading>Desactivar o reactivar una promoción</SubHeading>
          <StepList steps={[
            "Abre la promoción.",
            'Activa o desactiva el interruptor <strong>"Activa"</strong>.',
            "Guarda los cambios.",
          ]} />
          <InfoBox type="info">
            <strong>Diferencia entre &quot;inactiva&quot; y &quot;vencida&quot;:</strong> Una promoción vencida tiene su fecha de fin en el pasado y el sistema la oculta automáticamente. Una promoción inactiva fue desactivada manualmente — no aparece aunque su fecha de vigencia sea futura.
          </InfoBox>

          <Divider />

          {/* ════════════════════════════════════════════════ */}
          {/* CU-05 — Reseñas                                 */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="cu05" icon={<Star className="w-5 h-5" />}>
            CU-05 — Moderar reseñas de huéspedes
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span> <Code>/dashboard/resenas</Code>
          </p>
          <InfoBox type="info">
            Toda reseña enviada desde la web llega con estado <strong>PENDING</strong> y no es visible para el público hasta que la apruebes.
          </InfoBox>

          <SubHeading>Ver reseñas pendientes</SubHeading>
          <StepList steps={[
            'Ve a <strong>Reseñas</strong> en el menú lateral.',
            "El sistema muestra por defecto las reseñas en estado <strong>PENDING</strong>.",
            "Puedes filtrar por estado: PENDING, APPROVED, REJECTED.",
          ]} />

          <DataTable
            headers={["Campo", "Descripción"]}
            rows={[
              ["Nombre del huésped", "Nombre con que se identificó al escribir la reseña"],
              ["Correo electrónico", "Opcional — puede estar vacío"],
              ["Calificación", "Puntuación de 1 a 5 estrellas"],
              ["Comentario", "Texto de la opinión"],
              ["Idioma", "Español o inglés"],
              ["Fecha", "Cuándo fue enviada"],
            ]}
          />

          <div className="grid sm:grid-cols-2 gap-3 my-4">
            <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-xs font-semibold text-green-700 dark:text-green-400">Aprobar cuando…</p>
              </div>
              <ul className="text-xs text-green-800 dark:text-green-300 space-y-1">
                {[
                  "Opinión genuina sobre la experiencia",
                  "Crítica constructiva aunque negativa",
                  "Comentario en español o inglés",
                  "Calificación coherente con el comentario",
                ].map((i) => <li key={i} className="flex gap-1.5"><span>›</span>{i}</li>)}
              </ul>
            </div>
            <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="text-xs font-semibold text-red-700 dark:text-red-400">Rechazar cuando…</p>
              </div>
              <ul className="text-xs text-red-800 dark:text-red-300 space-y-1">
                {[
                  "Contenido ofensivo, discriminatorio o abusivo",
                  "Spam, publicidad o enlaces externos",
                  "Texto sin relación con el hotel",
                  "Reseña falsa o sospechosa",
                ].map((i) => <li key={i} className="flex gap-1.5"><span>›</span>{i}</li>)}
              </ul>
            </div>
          </div>

          <InfoBox type="warning">
            Una vez aprobada o rechazada, la reseña no puede volver a estado PENDING. No puedes editar el contenido — solo aprobarlo o rechazarlo tal como llegó.
          </InfoBox>

          <Divider />

          {/* ════════════════════════════════════════════════ */}
          {/* CU-06 — Contenido                               */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="cu06" icon={<Globe className="w-5 h-5" />}>
            CU-06 — Editar contenido de la página web
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span> <Code>/dashboard/configuracion</Code>{" "}(pestaña Contenido)
          </p>
          <InfoBox type="info">
            El sistema tiene un CMS básico que te permite editar el contenido de cada sección de la landing page. <strong>No necesitas acceder al código.</strong>
          </InfoBox>

          <SubHeading>Secciones editables</SubHeading>
          <DataTable
            headers={["Sección", "Slug", "Contenido editable"]}
            rows={[
              ["Hero (inicio)", <Code key="h">home-hero</Code>, "Título, subtítulo, imagen de fondo"],
              ["Habitaciones (intro)", <Code key="hp">habitaciones-preview</Code>, "Título y bajada de la sección"],
              ["Servicios", <Code key="s">servicios-overview</Code>, "Título y descripción general"],
              ["Restaurante", <Code key="r">restaurante-info</Code>, "Descripción, horarios, imagen"],
              ["Piscina", <Code key="p">piscina-info</Code>, "Descripción, normas, imagen"],
              ["Sala de reuniones", <Code key="sr">sala-reuniones-info</Code>, "Descripción, equipamiento, imagen"],
              ["Ubicación", <Code key="u">ubicacion-info</Code>, "Texto de cómo llegar"],
            ]}
          />

          <SubHeading>Editar una sección</SubHeading>
          <StepList steps={[
            'Ve a <strong>Configuración</strong> → pestaña <strong>Contenido</strong>.',
            "Haz clic en la sección que deseas editar.",
            "Modifica los campos disponibles.",
            'Haz clic en <strong>"Guardar"</strong>.',
            "Los cambios son visibles en la web de inmediato.",
          ]} />
          <DataTable
            headers={["Campo", "Descripción"]}
            rows={[
              ["Título (español)", "Encabezado de la sección"],
              ["Título (inglés)", "Versión en inglés del encabezado"],
              ["Cuerpo (español)", "Texto principal de la sección"],
              ["Cuerpo (inglés)", "Versión en inglés del texto"],
              ["Imagen principal", "URL de la imagen hero de la sección"],
              ["Imágenes adicionales", "Lista de URLs para galerías"],
              ["Orden", "Número que determina el orden de aparición"],
              ["Activa", "Si la sección está visible en la web"],
            ]}
          />
          <InfoBox type="caution">
            Los cambios son <strong>inmediatos</strong> — no hay previsualización antes de publicar. Revisa bien el texto antes de guardar.
          </InfoBox>

          <Divider />

          {/* ════════════════════════════════════════════════ */}
          {/* CU-07 — Configuración                           */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="cu07" icon={<Settings className="w-5 h-5" />}>
            CU-07 — Configurar el sistema
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span> <Code>/dashboard/configuracion</Code>{" "}(pestaña Configuración)
          </p>

          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-1">Categoría: General</p>
          <DataTable
            headers={["Parámetro", "Clave", "Descripción", "Default"]}
            rows={[
              ["Hora de check-in", <Code key="ci">check_in_time</Code>, "Hora oficial de entrada", <Code key="v1">14:30</Code>],
              ["Hora de check-out", <Code key="co">check_out_time</Code>, "Hora oficial de salida", <Code key="v2">12:00</Code>],
              ["Moneda", <Code key="cu">currency</Code>, "Moneda base del sistema", <Code key="v3">USD</Code>],
            ]}
          />

          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-1">Categoría: Precios</p>
          <DataTable
            headers={["Parámetro", "Clave", "Descripción", "Default"]}
            rows={[
              ["Precio piscina", <Code key="pp">pool_price</Code>, "Costo de acceso diario a la piscina (USD)", <Code key="v4">0</Code>],
              ["Precio sala de reuniones", <Code key="mr">meeting_room_price</Code>, "Costo por día de la sala (USD)", <Code key="v5">250</Code>],
              ["Tasa de cambio", <Code key="er">exchange_rate</Code>, "Tasa VES/USD para mostrar equivalencias", <Code key="v6">{"{ vesToUsd: 36.5 }"}</Code>],
            ]}
          />

          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-1">Categoría: Política</p>
          <DataTable
            headers={["Parámetro", "Clave", "Descripción", "Default"]}
            rows={[
              ["Política de cancelación", <Code key="cp">cancellation_policy</Code>, "Horas de anticipación para reembolso y porcentaje", <Code key="v7">{"{ hoursThreshold: 48, refundPercent: 100 }"}</Code>],
            ]}
          />
          <InfoBox type="info">
            <strong>Política por defecto:</strong> Si el huésped cancela con más de 48 h de anticipación al check-in, se le reembolsa el 100 % del pago adelantado. Si cancela con menos de 48 h, no hay reembolso.
          </InfoBox>

          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-4 mb-1">Categoría: Pago</p>
          <DataTable
            headers={["Parámetro", "Clave", "Descripción"]}
            rows={[
              ["Instrucciones de pago", <Code key="pi">payment_instructions</Code>, "Texto con datos bancarios, Zelle, etc. que se envía al huésped tras su solicitud de reserva"],
            ]}
          />
          <InfoBox type="caution">
            Las instrucciones de pago aparecen automáticamente en el correo que recibe el huésped. <strong>Mantenlas siempre actualizadas</strong> con los datos vigentes del hotel. Si cambian los datos bancarios, actualízalas inmediatamente.
          </InfoBox>

          <SubHeading>Cómo editar un parámetro</SubHeading>
          <StepList steps={[
            'Ve a <strong>Configuración</strong> → pestaña <strong>Configuración</strong>.',
            "Selecciona la categoría del parámetro que deseas modificar.",
            "Edita el valor en el campo correspondiente.",
            'Haz clic en <strong>"Guardar"</strong>.',
            "El cambio aplica de forma inmediata en el sistema.",
          ]} />
          <InfoBox type="warning">
            Todos los cambios en configuración quedan registrados en la bitácora con los valores anteriores y nuevos. La <strong>tasa de cambio</strong> no se actualiza automáticamente — ajústala manualmente cuando sea necesario.
          </InfoBox>

          <Divider />

          {/* ════════════════════════════════════════════════ */}
          {/* CU-08 — Reportes                                */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="cu08" icon={<BarChart2 className="w-5 h-5" />}>
            CU-08 — Ver reportes y KPIs
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span> <Code>/dashboard/reportes</Code>
          </p>
          <InfoBox type="info">
            Esta función también está disponible para el Dueño. El Administrador la hereda con acceso completo.
          </InfoBox>

          <DataTable
            headers={["Métrica", "Descripción", "Período"]}
            rows={[
              ["Reservas activas", "Reservas confirmadas con check-in en fecha futura", "Actual"],
              ["Reservas del mes", "Total de reservas creadas en el mes seleccionado", "Filtrable por mes"],
              ["Tasa de cancelación", "Porcentaje de reservas canceladas sobre el total", "Filtrable por rango"],
              ["Ocupación %", "Porcentaje de habitaciones físicas ocupadas hoy", "Hoy"],
            ]}
          />

          <SubHeading>Gráficos disponibles</SubHeading>
          <BulletList items={[
            "<strong>Gráfico de ocupación:</strong> Línea temporal con el porcentaje de ocupación por día en el rango seleccionado.",
            "<strong>Gráfico de reservas por mes:</strong> Barras con el volumen de reservas confirmadas agrupadas por mes.",
          ]} />

          <SubHeading>Cómo usar los filtros</SubHeading>
          <StepList steps={[
            "Selecciona el <strong>rango de fechas</strong> con el selector en la parte superior.",
            "Los KPIs y gráficos se actualizan automáticamente.",
            "Puedes filtrar adicionalmente por tipo de habitación en algunos gráficos.",
          ]} />
          <InfoBox type="warning">
            La exportación de reportes a PDF o Excel <strong>no está disponible en esta versión</strong>. Los datos de ocupación se calculan sobre las habitaciones físicas registradas — si hay habitaciones sin registrar, la ocupación aparecerá más alta de lo real.
          </InfoBox>

          <Divider />

          {/* ════════════════════════════════════════════════ */}
          {/* CU-09 — Bitácora                                */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="cu09" icon={<ScrollText className="w-5 h-5" />}>
            CU-09 — Ver la bitácora de auditoría
          </SectionHeading>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Ruta:</span> <Code>/dashboard/bitacora</Code>
          </p>

          <SubHeading>Tipos de acciones registradas</SubHeading>
          <DataTable
            headers={["Acción", "Descripción"]}
            rows={[
              [<Code key="cr">CREATE</Code>, "Se creó un registro (reserva, usuario, promoción, etc.)"],
              [<Code key="u">UPDATE</Code>, "Se modificó un registro"],
              [<Code key="d">DELETE</Code>, "Se eliminó un registro"],
              [<Code key="co">CONFIRM</Code>, "Se confirmó una reserva"],
              [<Code key="re">REJECT</Code>, "Se rechazó una reserva o reseña"],
              [<Code key="ca">CANCEL</Code>, "Se canceló una reserva"],
              [<Code key="ap">APPROVE</Code>, "Se aprobó una reseña"],
              [<Code key="li">LOGIN</Code>, "Un usuario inició sesión"],
              [<Code key="lo">LOGOUT</Code>, "Un usuario cerró sesión"],
            ]}
          />

          <SubHeading>Información disponible en cada entrada</SubHeading>
          <DataTable
            headers={["Campo", "Descripción"]}
            rows={[
              ["Entidad", "Qué tipo de registro fue afectado (Reserva, Usuario, Promoción, etc.)"],
              ["ID de entidad", "Identificador del registro afectado"],
              ["Acción", "Tipo de acción realizada"],
              ["Realizado por", "Nombre y rol del usuario que ejecutó la acción"],
              ["Cambios", "Valores anteriores y nuevos (antes / después)"],
              ["Dirección IP", "IP desde donde se realizó la acción"],
              ["Fecha y hora", "Timestamp exacto"],
            ]}
          />

          <SubHeading>Casos de uso frecuentes</SubHeading>
          <BulletList items={[
            "<strong>Auditar un recepcionista específico:</strong> filtra por su nombre de usuario.",
            "<strong>Ver quién canceló una reserva:</strong> abre la reserva → sección \"Historial de acciones\".",
            "<strong>Verificar un cambio en la configuración:</strong> filtra por entidad <code class='bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs'>SystemSetting</code> y acción <code class='bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs'>UPDATE</code>.",
            "<strong>Investigar acceso no autorizado:</strong> filtra por acción <code class='bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs'>LOGIN</code> y revisa las IPs.",
          ]} />
          <InfoBox type="info">
            La bitácora es de <strong>solo lectura</strong>. Ningún usuario puede modificarla ni eliminar registros. Los registros no tienen fecha de expiración — se acumulan indefinidamente.
          </InfoBox>

          <Divider />

          {/* ════════════════════════════════════════════════ */}
          {/* 12. Heredadas                                   */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="heredadas" icon={<ClipboardList className="w-5 h-5" />}>
            12. Funciones heredadas del rol Recepcionista
          </SectionHeading>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            El Administrador tiene acceso completo a todas las funciones del Recepcionista. Para el detalle operativo de cada una, consulta el <strong>Manual de Usuario — Rol Recepcionista</strong>.
          </p>
          <DataTable
            headers={["Función", "Descripción resumida"]}
            rows={[
              ["Ver listado de reservas", "Tabla con filtros de estado y fecha"],
              ["Ver detalle de reserva", "Información completa del huésped y la reserva"],
              ["Confirmar reserva", "PENDING → CONFIRMED + email al huésped"],
              ["Rechazar reserva", "PENDING → REJECTED + motivo obligatorio"],
              ["Cancelar reserva", "→ CANCELLED + motivo obligatorio"],
              ["Crear reserva manual", "Formulario de 3 secciones para reservas por teléfono"],
              ["Editar reserva", "Modificar datos de una reserva existente"],
              ["Ver calendario", "Vista visual de ocupación por fecha"],
              ["Ver huéspedes", "Listado histórico con búsqueda"],
              ["Gestionar sala de reuniones", "Confirmar, rechazar y cancelar solicitudes"],
              ["Gestionar restaurante", "Confirmar, rechazar y cancelar reservas de mesa"],
            ]}
          />

          <Divider />

          {/* ════════════════════════════════════════════════ */}
          {/* 13. Errores frecuentes                          */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="errores" icon={<AlertTriangle className="w-5 h-5" />}>
            13. Errores frecuentes y soluciones
          </SectionHeading>
          <DataTable
            headers={["Situación", "Causa probable", "Solución"]}
            rows={[
              ["No puedo desactivar un tipo de habitación", "Tiene reservas activas (PENDING o CONFIRMED) asociadas", "Resuelve primero las reservas pendientes de ese tipo, luego desactiva"],
              ["La promoción no aparece en la web aunque está activa", "La fecha de fin ya pasó, o la fecha de inicio es futura", "Verifica el rango de fechas en el formulario de la promoción"],
              ["El precio de la piscina aparece como $0 en la web", `El parámetro pool_price no fue configurado`, "Ve a Configuración → Precios → actualiza pool_price"],
              ["Las instrucciones de pago del correo están desactualizadas", "El parámetro payment_instructions no fue actualizado", "Ve a Configuración → Pago → actualiza el texto"],
              ["No puedo aprobar/rechazar una reseña ya procesada", "La reseña ya está en estado APPROVED o REJECTED", "Las reseñas procesadas no pueden volver a PENDING. Si fue un error, consulta con soporte técnico."],
              ["Un usuario no puede iniciar sesión", "Cuenta desactivada o credenciales incorrectas", "Ve a Usuarios → verifica que isActive esté activado y resetea la contraseña si es necesario"],
              ["La tasa de cambio está desactualizada", "El parámetro exchange_rate no se actualiza automáticamente", "Ve a Configuración → Precios → actualiza exchange_rate.vesToUsd con el valor vigente"],
              ["El calendario muestra menos ocupación de la real", "Hay habitaciones físicas sin registrar en el sistema", "Ve a Habitaciones → verifica que todas las habitaciones del hotel estén registradas"],
            ]}
          />

          <Divider />

          {/* ════════════════════════════════════════════════ */}
          {/* 14. Responsabilidades                           */}
          {/* ════════════════════════════════════════════════ */}
          <SectionHeading id="responsabilidades" icon={<ShieldCheck className="w-5 h-5" />}>
            14. Responsabilidades críticas del Administrador
          </SectionHeading>
          <InfoBox type="caution">
            Este rol tiene acceso a acciones irreversibles de alto impacto. Revisa esta lista periódicamente.
          </InfoBox>

          <SubHeading>Antes del primer uso del sistema</SubHeading>
          <ul className="space-y-2.5 my-3">
            {[
              <>Configurar el <strong>precio de la piscina</strong> (<Code>pool_price</Code>) — el valor inicial es $0.</>,
              <>Actualizar las <strong>instrucciones de pago</strong> (<Code>payment_instructions</Code>) con los datos bancarios reales del hotel.</>,
              <>Verificar que la <strong>tasa de cambio</strong> (<Code>exchange_rate</Code>) sea la vigente.</>,
              <>Confirmar que todos los <strong>tipos de habitación</strong> y sus precios están correctos.</>,
              <>Registrar todas las <strong>habitaciones físicas</strong> del hotel con sus números reales.</>,
              <>Crear las cuentas de usuario para el <strong>personal de recepción</strong>.</>,
            ].map((item, i) => (
              <ChecklistItem key={i}>{item}</ChecklistItem>
            ))}
          </ul>

          <SubHeading>En el uso diario</SubHeading>
          <BulletList items={[
            "Revisar las reseñas pendientes en <strong>Reseñas</strong> al menos una vez por día.",
            "Mantener actualizadas las instrucciones de pago si cambian los datos bancarios.",
            "Desactivar inmediatamente las cuentas de usuarios que dejen de trabajar en el hotel.",
          ]} />

          <SubHeading>En el uso periódico</SubHeading>
          <BulletList items={[
            "Actualizar la tasa de cambio VES/USD cuando sea necesario.",
            "Revisar el contenido de la web si cambian servicios, precios o políticas del hotel.",
            "Crear y desactivar promociones según la temporada.",
          ]} />

          {/* ── Footer ──────────────────────────────────── */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500 text-center">
            Manual de usuario v1.0 · Hotel Río Yurubí · Rol: ADMIN
            <br />
            Derivado del SPEC TÉCNICO v2.1 · Para soporte técnico del sistema, contacta al desarrollador responsable del proyecto.
          </div>

        </article>
      </div>
    </div>
  );
}
