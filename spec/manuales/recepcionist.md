# 📋 Manual de Usuario — Rol Recepcionista
## Hotel Río Yurubí · Sistema de Gestión

**Versión:** 1.0  
**Fecha:** 2025  
**Destinatario:** Personal de recepción del Hotel Río Yurubí  
**Sistema:** Portal web de gestión interna

---

> **Sobre este manual:** Describe todas las funciones disponibles para el rol **Recepcionista** en el sistema. Las funciones de otros roles (Dueño, Administrador) no están cubiertas aquí porque el sistema no te dará acceso a ellas.

---

## Índice

1. [Acceso al sistema](#1-acceso-al-sistema)
2. [Pantalla principal — Panel de reservas](#2-pantalla-principal--panel-de-reservas)
3. [CU-01 — Ver listado de reservas](#cu-01--ver-listado-de-reservas)
4. [CU-02 — Ver detalle de una reserva](#cu-02--ver-detalle-de-una-reserva)
5. [CU-03 — Confirmar una reserva](#cu-03--confirmar-una-reserva)
6. [CU-04 — Rechazar una reserva](#cu-04--rechazar-una-reserva)
7. [CU-05 — Cancelar una reserva](#cu-05--cancelar-una-reserva)
8. [CU-06 — Crear una reserva manualmente](#cu-06--crear-una-reserva-manualmente)
9. [CU-07 — Editar una reserva existente](#cu-07--editar-una-reserva-existente)
10. [CU-08 — Ver el calendario de reservas](#cu-08--ver-el-calendario-de-reservas)
11. [CU-09 — Ver el listado de huéspedes](#cu-09--ver-el-listado-de-huéspedes)
12. [CU-10 — Gestionar reservas de sala de reuniones](#cu-10--gestionar-reservas-de-sala-de-reuniones)
13. [CU-11 — Gestionar reservas de restaurante](#cu-11--gestionar-reservas-de-restaurante)
14. [Estados de reserva — Referencia rápida](#14-estados-de-reserva--referencia-rápida)
15. [Errores frecuentes y soluciones](#15-errores-frecuentes-y-soluciones)
16. [Lo que NO puedes hacer con este rol](#16-lo-que-no-puedes-hacer-con-este-rol)

---

## 1. Acceso al sistema

### Cómo iniciar sesión

1. Abre el navegador y ve a la dirección del sistema proporcionada por el administrador.
2. Ingresa tu **correo electrónico** y **contraseña**.
3. Haz clic en **Iniciar sesión**.

> Si tu cuenta fue desactivada o no recuerdas la contraseña, contacta al administrador del sistema. No puedes recuperar la contraseña por cuenta propia.

### Cómo cerrar sesión

Haz clic en tu nombre en la esquina superior del panel y selecciona **Cerrar sesión**. Siempre cierra sesión al terminar tu turno, especialmente en computadoras compartidas.

### Qué ves al entrar

Al iniciar sesión serás dirigido automáticamente a **`/dashboard/reservas`** — el listado de reservas. Es tu pantalla de trabajo principal.

---

## 2. Pantalla principal — Panel de reservas

La pantalla principal muestra:

- **Tabla de reservas** con columnas: ID, Huésped, Tipo de habitación, Check-in, Check-out, Huéspedes, Estado, Fecha de creación.
- **Filtros** en la parte superior: por estado y por rango de fechas.
- **Botón "Nueva reserva"** para crear una reserva manualmente.
- **Enlace al calendario** para ver las reservas en formato visual por fecha.

Las reservas más recientes aparecen primero por defecto.

---

## CU-01 — Ver listado de reservas

**Objetivo:** Consultar y filtrar todas las reservas registradas en el sistema.

**Ruta:** `/dashboard/reservas`

### Pasos

1. Al entrar al dashboard, ya estás en el listado de reservas.
2. Usa los **filtros de estado** para ver solo las reservas que necesitas:
   - **PENDING** — solicitudes nuevas que necesitan revisión.
   - **CONFIRMED** — reservas confirmadas.
   - **REJECTED** — solicitudes rechazadas.
   - **CANCELLED** — reservas canceladas.
   - **COMPLETED** — huéspedes que ya hicieron check-out.
3. Usa el **filtro de fechas** para acotar por rango de check-in o fecha de creación.
4. Haz clic en cualquier fila para ver el detalle completo de esa reserva.

### Información disponible en cada fila

| Columna | Descripción |
|---------|-------------|
| ID | Código único de la reserva (últimos 8 caracteres) |
| Huésped | Nombre completo del huésped |
| Habitación | Tipo de habitación solicitado |
| Check-in | Fecha de entrada |
| Check-out | Fecha de salida |
| Noches | Número de noches calculado automáticamente |
| Personas | Cantidad de huéspedes |
| Estado | Estado actual de la reserva |
| Creada | Fecha en que se registró la solicitud |

> **Tip:** Filtra por **PENDING** al inicio de cada turno para identificar las reservas que requieren tu atención inmediata.

---

## CU-02 — Ver detalle de una reserva

**Objetivo:** Consultar toda la información de una reserva específica antes de tomar una acción.

**Ruta:** `/dashboard/reservas/[id]`

### Pasos

1. En el listado, haz clic sobre la fila de la reserva que deseas revisar.
2. Se abre la página de detalle con toda la información organizada en secciones.

### Información disponible en el detalle

**Datos de la reserva:**
- Tipo de habitación y número de habitación asignada (si aplica)
- Fechas de check-in y check-out
- Número de noches y número de huéspedes
- Precio total en USD
- Método de pago indicado por el huésped (Transferencia / Zelle / Efectivo)
- Referencia de pago (si fue registrada)
- Observaciones del huésped
- Idioma de la reserva (español o inglés)
- Estado actual

**Datos del huésped:**
- Nombre completo
- Cédula / RIF / Pasaporte
- Correo electrónico
- Teléfono
- Dirección
- Procedencia (ciudad / país)

**Historial de acciones (bitácora):**
- Cada cambio de estado registrado, quién lo hizo y cuándo.

### Acciones disponibles desde el detalle

Dependiendo del estado actual de la reserva, verás botones para **Confirmar**, **Rechazar** o **Cancelar**. Estas acciones se describen en los casos de uso siguientes.

---

## CU-03 — Confirmar una reserva

**Objetivo:** Aprobar una solicitud de reserva recibida en estado PENDING, comprometiendo disponibilidad para esas fechas.

**Disponible cuando:** La reserva está en estado **PENDING**.

**Resultado:** La reserva pasa a estado **CONFIRMED** y se envía automáticamente un correo de confirmación al huésped.

### Pasos

1. Abre la reserva desde el listado (ve a CU-02).
2. Verifica que la información es correcta: fechas, tipo de habitación, número de personas, método de pago.
3. Confirma externamente que el huésped realizó o acordó el pago adelantado.
4. Haz clic en el botón **"Confirmar reserva"**.
5. El sistema actualiza el estado a **CONFIRMED** de forma inmediata.
6. El huésped recibe un correo automático con los detalles de su reserva confirmada.

### Lo que ocurre en el sistema

- Estado cambia: `PENDING → CONFIRMED`
- Se registra en la bitácora: acción `CONFIRM`, tu usuario, fecha y hora exacta.
- Se envía email de confirmación al correo del huésped.

### Consideraciones importantes

- Solo puedes confirmar reservas en estado **PENDING**. Si una reserva ya está **CONFIRMED**, **REJECTED** o **CANCELLED**, el botón de confirmación no aparecerá.
- La confirmación es una acción que queda registrada permanentemente con tu nombre de usuario.
- Si confirmas una reserva por error, deberás cancelarla (CU-05) y notificar al administrador.

---

## CU-04 — Rechazar una reserva

**Objetivo:** Denegar una solicitud de reserva cuando no puede ser atendida (sin disponibilidad, datos incorrectos, incumplimiento de políticas, etc.).

**Disponible cuando:** La reserva está en estado **PENDING**.

**Resultado:** La reserva pasa a estado **REJECTED** y se envía un correo de notificación al huésped.

### Pasos

1. Abre la reserva desde el listado (ve a CU-02).
2. Haz clic en el botón **"Rechazar reserva"**.
3. Se abrirá un campo de texto. **Escribe el motivo del rechazo** — este campo es obligatorio.
   - Ejemplo: *"No disponemos de habitaciones del tipo solicitado para esas fechas."*
   - Ejemplo: *"Los datos de contacto proporcionados son incompletos."*
4. Haz clic en **"Confirmar rechazo"**.
5. El sistema actualiza el estado a **REJECTED** de forma inmediata.
6. El huésped recibe un correo de notificación con la información del rechazo.

### Lo que ocurre en el sistema

- Estado cambia: `PENDING → REJECTED`
- El motivo queda guardado en el campo `rejectionReason` de la reserva.
- Se registra en la bitácora: acción `REJECT`, tu usuario, fecha y hora.
- Se envía email de notificación al huésped.

### Consideraciones importantes

- El motivo de rechazo es **obligatorio**. No puedes rechazar sin escribir una razón.
- El motivo es visible en el detalle de la reserva para cualquier usuario del sistema.
- Una reserva rechazada **no puede ser reactivada**. Si fue un error, comunícalo al administrador para que cree una nueva reserva manualmente.

---

## CU-05 — Cancelar una reserva

**Objetivo:** Cancelar una reserva que ya fue confirmada, ya sea a solicitud del huésped o por decisión operativa del hotel.

**Disponible cuando:** La reserva está en estado **PENDING** o **CONFIRMED**. No se puede cancelar una reserva en estado **COMPLETED**.

**Resultado:** La reserva pasa a estado **CANCELLED**.

### Pasos

1. Abre la reserva desde el listado (ve a CU-02).
2. Haz clic en el botón **"Cancelar reserva"**.
3. Se abrirá un campo de texto. **Escribe el motivo de la cancelación** — este campo es obligatorio.
   - Ejemplo: *"Cancelación solicitada por el huésped vía teléfono."*
   - Ejemplo: *"El huésped no realizó el pago adelantado en el plazo acordado."*
4. Haz clic en **"Confirmar cancelación"**.
5. El estado cambia a **CANCELLED** de forma inmediata.

### Lo que ocurre en el sistema

- Estado cambia a: `CANCELLED`
- El motivo queda guardado en el campo `cancellationReason`.
- Se registra en la bitácora: acción `CANCEL`, tu usuario, fecha, hora y motivo.

### Política de reembolso (referencia)

El sistema no procesa reembolsos automáticamente — todos los pagos son offline. La política vigente, configurable por el administrador, es:

- Cancelación con **más de 48 horas** de anticipación al check-in: reembolso del 100%.
- Cancelación con **menos de 48 horas**: sin reembolso.

Consulta con el administrador si tienes dudas sobre un caso específico.

### Consideraciones importantes

- El motivo de cancelación es **obligatorio**.
- Una vez cancelada, la reserva **no puede reactivarse** desde tu rol. Deberás crear una nueva reserva si el huésped desea volver a reservar.
- No puedes cancelar una reserva en estado **COMPLETED**.

---

## CU-06 — Crear una reserva manualmente

**Objetivo:** Registrar en el sistema una reserva realizada por un huésped que contactó al hotel por teléfono, en persona o por cualquier canal distinto al formulario web.

**Ruta:** `/dashboard/reservas/nueva`

### Pasos

1. En el listado de reservas, haz clic en el botón **"Nueva reserva"**.
2. Completa el formulario en tres secciones:

---

**Sección 1 — Datos de la reserva**

| Campo | Descripción | Obligatorio |
|-------|-------------|:-----------:|
| Tipo de habitación | Selecciona entre los tipos disponibles (Sencilla, Doble, Triple, Familiar, etc.) | ✅ |
| Fecha de check-in | Fecha de entrada del huésped | ✅ |
| Fecha de check-out | Fecha de salida (debe ser posterior al check-in) | ✅ |
| Número de personas | Cantidad de huéspedes (no puede exceder la capacidad del tipo seleccionado) | ✅ |

El sistema calcula automáticamente el **número de noches** y el **precio total** al ingresar las fechas y el tipo de habitación.

---

**Sección 2 — Datos del huésped**

| Campo | Descripción | Obligatorio |
|-------|-------------|:-----------:|
| Nombre completo | Nombre y apellido del huésped | ✅ |
| Correo electrónico | Para envío de notificaciones | ✅ |
| Teléfono | Formato internacional (+58XXXXXXXXXX) | ✅ |
| Cédula / RIF / Pasaporte | Documento de identidad | ✅ |
| Dirección | Dirección del huésped | ✅ |
| Procedencia | Ciudad y país de origen | ✅ |

> Si el huésped ya tiene una reserva anterior en el sistema, sus datos se recuperarán automáticamente al ingresar el correo electrónico.

---

**Sección 3 — Pago y observaciones**

| Campo | Descripción | Obligatorio |
|-------|-------------|:-----------:|
| Método de pago | Transferencia / Zelle / Efectivo | ✅ |
| Referencia de pago | Número de referencia si ya pagó | ❌ |
| Observaciones | Notas internas sobre la reserva | ❌ |
| Idioma | Español o Inglés (para el email al huésped) | ✅ |

---

3. Revisa el **resumen de la reserva** que aparece antes de confirmar.
4. Haz clic en **"Crear reserva"**.

### Lo que ocurre en el sistema

- Se crea la reserva con estado **PENDING** por defecto.
- El sistema registra que la reserva fue creada por tu usuario (campo `createdBy`).
- Se envía automáticamente un correo al huésped con los detalles de la solicitud y las instrucciones de pago.
- Se envía notificación interna al hotel.
- Si verificaste el pago en el momento, puedes ir inmediatamente a confirmarla (CU-03).

### Validaciones automáticas del sistema

- El check-out debe ser posterior al check-in.
- El número de personas no puede exceder la capacidad máxima del tipo de habitación elegido.
- Todos los campos marcados como obligatorios deben estar completos.
- Si no hay habitaciones disponibles del tipo seleccionado para esas fechas, el sistema te mostrará una advertencia — pero la decisión final es tuya (el sistema no bloquea automáticamente).

---

## CU-07 — Editar una reserva existente

**Objetivo:** Corregir o actualizar los datos de una reserva ya registrada (por ejemplo, ajustar fechas, corregir datos del huésped, cambiar método de pago).

**Disponible cuando:** La reserva está en estado **PENDING** o **CONFIRMED**. No se pueden editar reservas **COMPLETED**, **REJECTED** o **CANCELLED**.

### Pasos

1. Abre la reserva que deseas editar desde el listado (ve a CU-02).
2. Haz clic en el botón **"Editar reserva"**.
3. Modifica los campos necesarios. Los campos disponibles son los mismos que en la creación (CU-06).
4. Haz clic en **"Guardar cambios"**.
5. El sistema actualiza la reserva y registra el cambio en la bitácora.

### Lo que ocurre en el sistema

- Los datos de la reserva se actualizan.
- Se registra en la bitácora: acción `UPDATE`, tu usuario, fecha, hora y los valores anteriores vs. nuevos (`before/after`).
- El estado de la reserva no cambia por una edición — si necesitas cambiar el estado, usa Confirmar, Rechazar o Cancelar.

### Consideraciones importantes

- Si cambias las fechas de una reserva **CONFIRMED**, verifica manualmente la disponibilidad — el sistema no lo hace en tiempo real.
- Cambiar el correo del huésped no reenvía los correos anteriores.

---

## CU-08 — Ver el calendario de reservas

**Objetivo:** Visualizar las reservas en formato de calendario mensual para identificar ocupación, solapamientos y disponibilidad de forma gráfica.

**Ruta:** `/dashboard/reservas` (pestaña o botón "Vista calendario")

### Pasos

1. En la página de reservas, haz clic en **"Vista calendario"** (o la pestaña correspondiente).
2. Navega entre meses con las flechas de navegación.
3. Cada reserva confirmada aparece como un bloque en las fechas de check-in a check-out.
4. Haz clic sobre un bloque para ir al detalle de esa reserva.

### Información visible en el calendario

- Nombre del huésped.
- Tipo de habitación.
- Duración de la estancia (bloque desde check-in hasta check-out).
- Color por estado: verde = CONFIRMED, amarillo = PENDING.

> El calendario es una **vista de consulta**. No puedes crear ni modificar reservas directamente desde el calendario — solo visualizarlas.

---

## CU-09 — Ver el listado de huéspedes

**Objetivo:** Consultar el registro histórico de todos los huéspedes que han hecho reservas en el hotel.

**Ruta:** `/dashboard/huespedes`

### Pasos

1. En el menú lateral, haz clic en **"Huéspedes"**.
2. Se muestra una tabla paginada con todos los huéspedes registrados.
3. Puedes buscar por nombre, correo electrónico o número de documento.
4. Haz clic en un huésped para ver sus datos completos y el historial de sus reservas.

### Información disponible por huésped

| Dato | Descripción |
|------|-------------|
| Nombre completo | — |
| Correo electrónico | — |
| Teléfono | — |
| Documento de identidad | Cédula / RIF / Pasaporte |
| Dirección | — |
| Procedencia | Ciudad / País |
| Reservas | Historial de reservas asociadas a ese huésped |

### Consideraciones importantes

- Esta sección es de **solo lectura** desde el listado de huéspedes. No puedes crear ni eliminar huéspedes directamente aquí.
- Los datos del huésped se crean automáticamente cuando se registra una nueva reserva (vía web o manual). Si el correo ya existe, se reutiliza el mismo perfil de huésped.

---

## CU-10 — Gestionar reservas de sala de reuniones

**Objetivo:** Revisar, confirmar, rechazar o cancelar las solicitudes de reserva de la sala de reuniones del hotel.

**Ruta:** `/dashboard/servicios/sala-reuniones`

### Características de la sala (referencia)

| Parámetro | Valor |
|-----------|-------|
| Capacidad máxima | 30 personas |
| Horario disponible | 6:00 AM – 12:00 PM |
| Precio | $250 USD / día (configurable por el administrador) |
| Equipamiento incluido | Aire acondicionado, mesas, sillas, video beam, pantalla de proyección, WiFi, estación de café |

### Datos que contiene cada solicitud

| Campo | Descripción |
|-------|-------------|
| Nombre de contacto | Persona responsable del evento |
| Empresa | Nombre de la empresa (opcional) |
| RIF | Registro fiscal (opcional) |
| Teléfono | — |
| Correo electrónico | — |
| Descripción del evento | Detalle del tipo de reunión o evento |
| Fecha del evento | — |
| Hora de inicio / fin | Dentro del rango 06:00–12:00 |
| Número de asistentes | Máximo 30 |
| Precio estimado | Calculado automáticamente |

### Pasos para gestionar una solicitud

1. Ve a **Servicios → Sala de reuniones** en el menú lateral.
2. Verás el listado de solicitudes filtrable por estado (PENDING, CONFIRMED, CANCELLED).
3. Haz clic en una solicitud para ver el detalle.
4. Desde el detalle, puedes:
   - **Confirmar** — aprueba la reserva. El estado cambia a CONFIRMED.
   - **Rechazar** — deniega la solicitud. Motivo obligatorio.
   - **Cancelar** — cancela una reserva ya confirmada. Motivo obligatorio.
5. Cada acción queda registrada en la bitácora del sistema.

---

## CU-11 — Gestionar reservas de restaurante

**Objetivo:** Revisar, confirmar, rechazar o cancelar las solicitudes de reserva de mesa en el restaurante del hotel.

**Ruta:** `/dashboard/servicios/restaurante`

### Características del restaurante (referencia)

| Parámetro | Valor |
|-----------|-------|
| Capacidad máxima | 80 personas |
| Horario de atención | 12:00 PM – 4:00 PM |
| Turnos disponibles | Turno 1: 12:00 PM – 2:00 PM · Turno 2: 2:00 PM – 4:00 PM |

### Datos que contiene cada solicitud

| Campo | Descripción |
|-------|-------------|
| Nombre de contacto | — |
| Cédula | Documento de identidad (opcional) |
| Teléfono | — |
| Correo electrónico | (opcional) |
| Fecha del evento | — |
| Turno | Turno 1 (12:00–14:00) o Turno 2 (14:00–16:00) |
| Número de comensales | Máximo 80 |

### Pasos para gestionar una solicitud

1. Ve a **Servicios → Restaurante** en el menú lateral.
2. Verás el listado de solicitudes filtrable por estado y fecha.
3. Haz clic en una solicitud para ver el detalle.
4. Desde el detalle, puedes:
   - **Confirmar** — aprueba la reserva de mesa. Estado cambia a CONFIRMED.
   - **Rechazar** — deniega la solicitud. Motivo obligatorio.
   - **Cancelar** — cancela una ya confirmada. Motivo obligatorio.
5. Cada acción queda registrada en la bitácora del sistema.

> **Nota sobre la piscina:** Las visitas a la piscina **no requieren reserva**. El precio de acceso está publicado en la web del hotel. No hay gestión de piscina en el sistema.

---

## 14. Estados de reserva — Referencia rápida

Esta tabla resume todos los estados posibles y las transiciones permitidas desde el rol Recepcionista.

| Estado | Significado | Puede confirmarse | Puede rechazarse | Puede cancelarse | Puede editarse |
|--------|-------------|:-----------------:|:----------------:|:----------------:|:--------------:|
| **PENDING** | Solicitud recibida, pendiente de revisión | ✅ | ✅ | ✅ | ✅ |
| **CONFIRMED** | Aprobada por staff | — | — | ✅ | ✅ |
| **REJECTED** | Denegada por staff | — | — | — | — |
| **CANCELLED** | Cancelada | — | — | — | — |
| **COMPLETED** | Check-out realizado | — | — | — | — |

### Diagrama de flujo de estados

```
PENDING ──→ CONFIRMED ──→ COMPLETED
   │              │
   └──→ REJECTED  └──→ CANCELLED
   │
   └──→ CANCELLED
```

---

## 15. Errores frecuentes y soluciones

| Situación | Causa probable | Solución |
|-----------|---------------|---------|
| El botón "Confirmar" no aparece | La reserva no está en estado PENDING | Verifica el estado actual en el detalle |
| No puedo cancelar la reserva | La reserva está en estado COMPLETED | Las reservas completadas no se pueden cancelar. Consulta al administrador. |
| El campo de motivo está vacío y no deja guardar | Es un campo obligatorio para Rechazar y Cancelar | Escribe una razón antes de confirmar la acción |
| El sistema muestra advertencia de disponibilidad al crear | Puede haber reservas activas solapadas para ese tipo de habitación | Verifica en el calendario y decide con criterio. El sistema no bloquea automáticamente. |
| No aparece el número de noches calculado | Las fechas no están completas o check-out es anterior a check-in | Revisa que ambas fechas estén ingresadas correctamente |
| No puedo acceder a Configuración o Reportes | No tienes permiso — esas secciones son de Admin/Dueño | Es el comportamiento esperado. Contacta al administrador si necesitas información de esas secciones. |
| El sistema me redirige al inicio al intentar entrar a una sección | Sesión expirada | Inicia sesión nuevamente |

---

## 16. Lo que NO puedes hacer con este rol

El sistema te bloqueará automáticamente si intentas acceder a las siguientes funciones. Están reservadas para el Administrador o el Dueño:

| Función | Rol requerido |
|---------|--------------|
| Ver reportes y KPIs de ocupación | Dueño / Admin |
| Ver bitácora de auditoría completa | Dueño / Admin |
| Gestionar tipos de habitación (crear, editar, desactivar) | Admin |
| Gestionar promociones | Admin |
| Moderar reseñas de huéspedes | Admin |
| Crear, editar o desactivar usuarios del sistema | Admin |
| Editar configuración del sistema (precios, políticas, datos de pago) | Admin |
| Editar contenido de la página web del hotel | Admin |

Si necesitas que alguna de estas acciones se realice, comunícate con el administrador del sistema.

---

*Manual de usuario v1.0 — Hotel Río Yurubí*  
*Derivado del SPEC TÉCNICO v2.1 · Rol: RECEPTIONIST*  
*Para soporte técnico, contacta al administrador del sistema.*