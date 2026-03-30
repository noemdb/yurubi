# 📋 Manual de Usuario — Rol Administrador

## Hotel Río Yurubí · Sistema de Gestión

**Versión:** 1.0  
**Fecha:** 2025  
**Destinatario:** Administrador del sistema — Hotel Río Yurubí  
**Sistema:** Portal web de gestión interna

---

> **Sobre este manual:** Describe todas las funciones disponibles para el rol **Administrador**. Este rol tiene acceso completo al sistema — incluyendo todo lo que puede hacer el Recepcionista y el Dueño, más las funciones exclusivas de administración. Una acción mal ejecutada (desactivar un usuario, eliminar un tipo de habitación, cambiar precios) tiene efecto inmediato en la operación del hotel. Lee cada sección antes de actuar.

---

## Índice

1. [Acceso al sistema](#1-acceso-al-sistema)
2. [Mapa de funciones exclusivas del Administrador](#2-mapa-de-funciones-exclusivas-del-administrador)
3. [CU-01 — Gestionar usuarios del sistema](#cu-01--gestionar-usuarios-del-sistema)
4. [CU-02 — Gestionar tipos de habitación](#cu-02--gestionar-tipos-de-habitación)
5. [CU-03 — Gestionar habitaciones físicas](#cu-03--gestionar-habitaciones-físicas)
6. [CU-04 — Gestionar promociones](#cu-04--gestionar-promociones)
7. [CU-05 — Moderar reseñas de huéspedes](#cu-05--moderar-reseñas-de-huéspedes)
8. [CU-06 — Editar contenido de la página web](#cu-06--editar-contenido-de-la-página-web)
9. [CU-07 — Configurar el sistema](#cu-07--configurar-el-sistema)
10. [CU-08 — Ver reportes y KPIs](#cu-08--ver-reportes-y-kpis)
11. [CU-09 — Ver la bitácora de auditoría](#cu-09--ver-la-bitácora-de-auditoría)
12. [Funciones de reservas heredadas del rol Recepcionista](#12-funciones-de-reservas-heredadas-del-rol-recepcionista)
13. [Errores frecuentes y soluciones](#13-errores-frecuentes-y-soluciones)
14. [Responsabilidades críticas del Administrador](#14-responsabilidades-críticas-del-administrador)

---

## 1. Acceso al sistema

### Cómo iniciar sesión

1. Abre el navegador y ve a la dirección del sistema.
2. Ingresa tu **correo electrónico** y **contraseña** de administrador.
3. Haz clic en **Iniciar sesión**.

### Contraseña de administrador

La contraseña debe cumplir con estos requisitos mínimos:

- Al menos **8 caracteres**
- Al menos **una letra mayúscula**
- Al menos **una letra minúscula**
- Al menos **un número**

Si necesitas cambiar la contraseña de otro usuario, puedes hacerlo desde la gestión de usuarios (CU-01). Si necesitas cambiar la tuya propia, contacta a otro administrador o utiliza la opción de perfil.

### Al entrar

Al iniciar sesión serás dirigido al panel de reservas (`/dashboard/reservas`). Desde el menú lateral tienes acceso a todas las secciones del sistema.

---

## 2. Mapa de funciones exclusivas del Administrador

Las siguientes funciones son **exclusivas de este rol**. Ni el Recepcionista ni el Dueño pueden acceder a ellas.

| Función                                 | Sección en el menú | Ruta del sistema           |
| --------------------------------------- | ------------------ | -------------------------- |
| Crear / editar / desactivar usuarios    | Usuarios           | `/dashboard/usuarios`      |
| Crear / editar tipos de habitación      | Habitaciones       | `/dashboard/habitaciones`  |
| Crear / editar habitaciones físicas     | Habitaciones       | `/dashboard/habitaciones`  |
| Crear / editar / desactivar promociones | Promociones        | `/dashboard/promociones`   |
| Aprobar o rechazar reseñas              | Reseñas            | `/dashboard/resenas`       |
| Editar textos y contenido de la web     | Contenido          | `/dashboard/configuracion` |
| Configurar precios, políticas y pagos   | Configuración      | `/dashboard/configuracion` |

Además, el Administrador puede hacer **todo lo que hace el Recepcionista** (gestión de reservas, huéspedes y servicios) y **todo lo que ve el Dueño** (reportes, KPIs, bitácora).

---

## CU-01 — Gestionar usuarios del sistema

**Objetivo:** Crear, editar, cambiar el rol o desactivar las cuentas del personal que accede al sistema.

**Ruta:** `/dashboard/usuarios`

### Usuarios que puedes gestionar

El sistema tiene tres roles asignables a usuarios internos:

| Rol            | Descripción                                |
| -------------- | ------------------------------------------ |
| `RECEPTIONIST` | Gestiona reservas, huéspedes y servicios   |
| `OWNER`        | Solo lectura: ve reportes, KPIs y bitácora |
| `ADMIN`        | Acceso completo al sistema                 |

> Los huéspedes del hotel **no tienen cuenta** en el sistema. Solo el personal interno tiene acceso al dashboard.

---

### Crear un usuario nuevo

1. Ve a **Usuarios** en el menú lateral.
2. Haz clic en **"Nuevo usuario"**.
3. Completa el formulario:

| Campo              | Descripción                                         | Obligatorio |
| ------------------ | --------------------------------------------------- | :---------: |
| Nombre completo    | Nombre y apellido del colaborador                   |     ✅      |
| Correo electrónico | Será el usuario de acceso al sistema                |     ✅      |
| Contraseña         | Mínimo 8 caracteres, mayúscula + minúscula + número |     ✅      |
| Rol                | RECEPTIONIST / OWNER / ADMIN                        |     ✅      |

4. Haz clic en **"Crear usuario"**.
5. El nuevo usuario ya puede iniciar sesión con las credenciales asignadas.

> **Importante:** La contraseña se guarda encriptada. Ni tú ni nadie puede verla después de creada. Si el usuario la olvida, deberás asignarle una nueva desde la edición.

---

### Editar un usuario

1. En el listado de usuarios, haz clic en el usuario que deseas modificar.
2. Puedes cambiar: nombre, correo electrónico, contraseña y rol.
3. Haz clic en **"Guardar cambios"**.

> Cambiar el correo de un usuario cambia también su credencial de acceso. Notifícale el cambio.

---

### Desactivar un usuario

Cuando un colaborador deja de trabajar en el hotel, **no se elimina** su cuenta — se desactiva. Esto preserva el historial de acciones en la bitácora.

1. En el listado, haz clic en el usuario.
2. Desactiva el interruptor **"Cuenta activa"**.
3. Guarda los cambios.

Un usuario desactivado **no puede iniciar sesión** aunque conozca su contraseña. El sistema lo rechaza automáticamente.

---

### Reactivar un usuario

1. En el listado de usuarios, activa el filtro **"Mostrar inactivos"** si es necesario.
2. Haz clic en el usuario.
3. Activa el interruptor **"Cuenta activa"** y guarda.

---

### Consideraciones importantes

- No puedes eliminar usuarios — solo desactivarlos. Esto es intencional para preservar la integridad de la bitácora.
- Puedes crear múltiples administradores. Se recomienda tener al menos dos por seguridad.
- Todas las acciones sobre usuarios quedan registradas en la bitácora.

---

## CU-02 — Gestionar tipos de habitación

**Objetivo:** Crear, editar o desactivar los tipos de habitación que aparecen en la web y en el sistema de reservas.

**Ruta:** `/dashboard/habitaciones` (pestaña Tipos)

### Tipos de habitación predefinidos en el sistema

Al configurarse inicialmente, el sistema incluye estos tipos:

| Tipo                | Capacidad máxima |
| ------------------- | :--------------: |
| Sencilla            |    1 persona     |
| Doble               |    2 personas    |
| Triple              |    3 personas    |
| Familiar            |   4–6 personas   |
| Matrimonial Pequeña |    2 personas    |
| Matrimonial Grande  |    2 personas    |
| Mini Apartamento    |    4 personas    |

---

### Crear un tipo de habitación

1. Ve a **Habitaciones** → pestaña **Tipos**.
2. Haz clic en **"Nuevo tipo"**.
3. Completa el formulario:

| Campo            | Descripción                                                             | Obligatorio |
| ---------------- | ----------------------------------------------------------------------- | :---------: |
| Nombre           | Ej: "Sencilla", "Suite Presidencial"                                    |     ✅      |
| Slug             | Identificador en URL, sin tildes ni espacios (ej: `suite-presidencial`) |     ✅      |
| Precio base      | Precio por noche en USD                                                 |     ✅      |
| Capacidad máxima | Número máximo de personas permitidas                                    |     ✅      |
| Descripción      | Texto descriptivo que aparece en la web                                 |     ❌      |
| Comodidades      | Lista de amenidades (WiFi, Aire acondicionado, TV, etc.)                |     ❌      |
| Imágenes         | URLs de las fotos del tipo de habitación                                |     ❌      |

4. El campo **"Activo"** viene marcado por defecto — el tipo será visible en la web y disponible para reservas.
5. Haz clic en **"Crear tipo"**.

---

### Editar un tipo de habitación

1. En el listado de tipos, haz clic en el que deseas modificar.
2. Actualiza los campos necesarios.
3. Guarda los cambios.

> Si cambias el **precio base**, el nuevo precio aplica solo a las reservas futuras. Las reservas ya creadas conservan el precio con el que fueron registradas.

---

### Desactivar un tipo de habitación

Un tipo desactivado deja de aparecer en la web y no puede ser seleccionado en nuevas reservas. Las reservas existentes de ese tipo no se ven afectadas.

1. Abre el tipo de habitación.
2. Desactiva el interruptor **"Activo"**.
3. Guarda los cambios.

---

## CU-03 — Gestionar habitaciones físicas

**Objetivo:** Registrar, editar o bloquear las habitaciones físicas del hotel (por número de habitación) asociadas a sus tipos.

**Ruta:** `/dashboard/habitaciones` (pestaña Habitaciones)

> Las habitaciones físicas son los cuartos reales del hotel (101, 102, etc.). Son distintas de los _tipos_ — un tipo puede tener múltiples habitaciones físicas asociadas.

---

### Registrar una habitación física

1. Ve a **Habitaciones** → pestaña **Habitaciones**.
2. Haz clic en **"Nueva habitación"**.
3. Completa el formulario:

| Campo                | Descripción                                                 | Obligatorio |
| -------------------- | ----------------------------------------------------------- | :---------: |
| Número de habitación | Ej: "101", "202" — debe ser único en el hotel               |     ✅      |
| Piso                 | Número de piso (opcional)                                   |     ❌      |
| Tipo de habitación   | Selecciona el tipo al que pertenece esta habitación         |     ✅      |
| Notas internas       | Observaciones de mantenimiento o características especiales |     ❌      |

4. El campo **"Disponible"** viene activado por defecto.

---

### Bloquear una habitación (mantenimiento)

Si una habitación está en mantenimiento o no puede ser asignada temporalmente:

1. Abre la habitación.
2. Desactiva el interruptor **"Disponible"**.
3. Agrega una nota explicativa en el campo de notas.
4. Guarda los cambios.

Una habitación bloqueada no será asignada a nuevas reservas por el sistema. Reactívala cuando esté disponible nuevamente.

---

## CU-04 — Gestionar promociones

**Objetivo:** Crear, editar, activar o desactivar las promociones que aparecen en la sección de promociones de la página web del hotel.

**Ruta:** `/dashboard/promociones`

---

### Crear una promoción

1. Ve a **Promociones** en el menú lateral.
2. Haz clic en **"Nueva promoción"**.
3. Completa el formulario:

**Información general:**

| Campo                 | Descripción                         | Obligatorio |
| --------------------- | ----------------------------------- | :---------: |
| Título (español)      | Nombre visible de la oferta         |     ✅      |
| Título (inglés)       | Versión en inglés del título        |     ❌      |
| Descripción (español) | Detalle de la promoción             |     ✅      |
| Descripción (inglés)  | Versión en inglés de la descripción |     ❌      |
| Imagen                | URL de la imagen de la promoción    |     ❌      |

**Descuento:**

| Campo             | Descripción                                                              | Obligatorio |
| ----------------- | ------------------------------------------------------------------------ | :---------: |
| Tipo de descuento | **Porcentaje** (ej: 15%) o **Monto fijo** (ej: $20 USD)                  |     ✅      |
| Valor             | Número del descuento (si es porcentaje: 0–100; si es fijo: monto en USD) |     ✅      |

**Vigencia:**

| Campo           | Descripción                      | Obligatorio |
| --------------- | -------------------------------- | :---------: |
| Fecha de inicio | Desde cuándo aplica la promoción |     ✅      |
| Fecha de fin    | Hasta cuándo aplica              |     ✅      |

> La fecha de fin debe ser posterior a la fecha de inicio. El sistema no permite lo contrario.

**Aplicabilidad:**

| Campo                          | Descripción                                              |  Obligatorio  |
| ------------------------------ | -------------------------------------------------------- | :-----------: |
| Tipos de habitación aplicables | Selecciona uno o más tipos a los que aplica el descuento | ✅ (mínimo 1) |
| Condiciones (español)          | Texto con restricciones o requisitos de la oferta        |      ❌       |
| Condiciones (inglés)           | Versión en inglés de las condiciones                     |      ❌       |

4. El campo **"Activa"** viene marcado por defecto.
5. Haz clic en **"Crear promoción"**.

---

### Editar una promoción

1. En el listado, haz clic en la promoción que deseas modificar.
2. Actualiza los campos necesarios.
3. Guarda los cambios.

---

### Desactivar o reactivar una promoción

Una promoción desactivada deja de aparecer en la web aunque esté dentro de su rango de fechas.

1. Abre la promoción.
2. Activa o desactiva el interruptor **"Activa"**.
3. Guarda los cambios.

> **Diferencia entre "inactiva" y "vencida":** Una promoción vencida tiene su fecha de fin en el pasado y el sistema la oculta automáticamente. Una promoción inactiva fue desactivada manualmente y no aparece aunque su fecha de vigencia sea futura.

---

## CU-05 — Moderar reseñas de huéspedes

**Objetivo:** Revisar las reseñas enviadas por huéspedes desde la web y decidir si se publican o se rechazan antes de que aparezcan en la sección de opiniones.

**Ruta:** `/dashboard/resenas`

> Toda reseña enviada desde la web llega con estado **PENDING** y no es visible para el público hasta que la apruebes.

---

### Ver reseñas pendientes

1. Ve a **Reseñas** en el menú lateral.
2. El sistema muestra por defecto las reseñas en estado **PENDING**.
3. Puedes filtrar por estado: PENDING, APPROVED, REJECTED.

### Información de cada reseña

| Campo              | Descripción                                        |
| ------------------ | -------------------------------------------------- |
| Nombre del huésped | Nombre con que se identificó al escribir la reseña |
| Correo electrónico | Opcional — puede estar vacío                       |
| Calificación       | Puntuación de 1 a 5 estrellas                      |
| Comentario         | Texto de la opinión                                |
| Idioma             | Español o inglés                                   |
| Fecha              | Cuándo fue enviada                                 |

---

### Aprobar una reseña

1. Haz clic en la reseña que deseas revisar.
2. Lee el contenido completo.
3. Si es apropiada, haz clic en **"Aprobar"**.
4. La reseña pasa a estado **APPROVED** y aparece públicamente en la sección de opiniones del sitio web.

---

### Rechazar una reseña

1. Haz clic en la reseña.
2. Si el contenido es inapropiado, falso, spam o viola las políticas del hotel, haz clic en **"Rechazar"**.
3. La reseña pasa a estado **REJECTED** y no se publica. El huésped no recibe notificación del rechazo.

---

### Criterios sugeridos para moderación

| Aprobar                                  | Rechazar                                      |
| ---------------------------------------- | --------------------------------------------- |
| Opinión genuina sobre la experiencia     | Contenido ofensivo, discriminatorio o abusivo |
| Crítica constructiva aunque negativa     | Spam, publicidad o enlaces externos           |
| Comentario en español o inglés           | Texto sin relación con el hotel               |
| Calificación coherente con el comentario | Reseña falsa o sospechosa                     |

---

### Consideraciones importantes

- Una vez aprobada o rechazada, la reseña no puede volver a estado PENDING.
- No puedes editar el contenido de una reseña — solo aprobarla o rechazarla tal como llegó.
- Todas las acciones de moderación quedan registradas en la bitácora.

---

## CU-06 — Editar contenido de la página web

**Objetivo:** Actualizar los textos, imágenes y contenido de las secciones de la página web del hotel sin necesidad de intervención técnica.

**Ruta:** `/dashboard/configuracion` (pestaña Contenido)

> El sistema tiene un CMS básico que te permite editar el contenido de cada sección de la landing page directamente desde el dashboard. No necesitas acceder al código.

---

### Secciones editables

Cada sección de la web tiene un identificador único (slug). Las secciones disponibles son:

| Sección              | Slug                   | Contenido editable                 |
| -------------------- | ---------------------- | ---------------------------------- |
| Hero (inicio)        | `home-hero`            | Título, subtítulo, imagen de fondo |
| Habitaciones (intro) | `habitaciones-preview` | Título y bajada de la sección      |
| Servicios            | `servicios-overview`   | Título y descripción general       |
| Restaurante          | `restaurante-info`     | Descripción, horarios, imagen      |
| Piscina              | `piscina-info`         | Descripción, normas, imagen        |
| Sala de reuniones    | `sala-reuniones-info`  | Descripción, equipamiento, imagen  |
| Ubicación            | `ubicacion-info`       | Texto de cómo llegar               |

---

### Editar una sección

1. Ve a **Configuración** → pestaña **Contenido**.
2. Haz clic en la sección que deseas editar.
3. Modifica los campos disponibles:

| Campo                | Descripción                                |
| -------------------- | ------------------------------------------ |
| Título (español)     | Encabezado de la sección                   |
| Título (inglés)      | Versión en inglés del encabezado           |
| Cuerpo (español)     | Texto principal de la sección              |
| Cuerpo (inglés)      | Versión en inglés del texto                |
| Imagen principal     | URL de la imagen hero de la sección        |
| Imágenes adicionales | Lista de URLs para galerías                |
| Orden                | Número que determina el orden de aparición |
| Activa               | Si la sección está visible en la web       |

4. Haz clic en **"Guardar"**.
5. Los cambios son visibles en la web de inmediato.

---

### Consideraciones importantes

- Los cambios en el contenido son **inmediatos** — no hay previsualización antes de publicar. Revisa bien el texto antes de guardar.
- El campo **"Activa"** permite ocultar una sección temporalmente sin eliminarla.
- Los textos en inglés son opcionales, pero se recomienda mantenerlos si el hotel recibe huéspedes internacionales.

---

## CU-07 — Configurar el sistema

**Objetivo:** Gestionar los parámetros operativos del hotel que el sistema usa en reservas, precios, políticas y comunicaciones.

**Ruta:** `/dashboard/configuracion` (pestaña Configuración)

---

### Parámetros configurables

El sistema tiene los siguientes parámetros, organizados por categoría:

#### Categoría: General

| Parámetro         | Clave            | Descripción                          | Valor por defecto |
| ----------------- | ---------------- | ------------------------------------ | ----------------- |
| Hora de check-in  | `check_in_time`  | Hora oficial de entrada de huéspedes | `14:30`           |
| Hora de check-out | `check_out_time` | Hora oficial de salida               | `12:00`           |
| Moneda            | `currency`       | Moneda base del sistema              | `USD`             |

#### Categoría: Precios

| Parámetro                | Clave                | Descripción                               | Valor por defecto        |
| ------------------------ | -------------------- | ----------------------------------------- | ------------------------ |
| Precio piscina           | `pool_price`         | Costo de acceso diario a la piscina (USD) | `0` (debes configurarlo) |
| Precio sala de reuniones | `meeting_room_price` | Costo por día de la sala (USD)            | `250`                    |
| Tasa de cambio           | `exchange_rate`      | Tasa VES/USD para mostrar equivalencias   | `{ vesToUsd: 36.5 }`     |

#### Categoría: Política

| Parámetro               | Clave                 | Descripción                                       | Valor por defecto                            |
| ----------------------- | --------------------- | ------------------------------------------------- | -------------------------------------------- |
| Política de cancelación | `cancellation_policy` | Horas de anticipación para reembolso y porcentaje | `{ hoursThreshold: 48, refundPercent: 100 }` |

> **Lectura de la política por defecto:** Si el huésped cancela con más de 48 horas de anticipación al check-in, se le reembolsa el 100% del pago adelantado. Si cancela con menos de 48 horas, no hay reembolso.

#### Categoría: Pago

| Parámetro             | Clave                  | Descripción                                                                                 |
| --------------------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| Instrucciones de pago | `payment_instructions` | Texto con datos bancarios, Zelle, etc. que se envía al huésped tras su solicitud de reserva |

> Las instrucciones de pago aparecen automáticamente en el correo que recibe el huésped cuando hace una solicitud de reserva. Mantenlas actualizadas con los datos vigentes del hotel.

---

### Cómo editar un parámetro

1. Ve a **Configuración** → pestaña **Configuración**.
2. Selecciona la categoría del parámetro que deseas modificar.
3. Edita el valor en el campo correspondiente.
4. Haz clic en **"Guardar"**.
5. El cambio aplica de forma inmediata en el sistema.

---

### Consideraciones importantes

- **Precio de piscina:** El valor inicial es `0`. Si el hotel cobra por el acceso, debes configurarlo antes de que el sistema muestre el precio correcto en la web.
- **Instrucciones de pago:** Si cambian los datos bancarios del hotel, actualiza este campo inmediatamente. Los correos enviados antes del cambio ya tenían los datos anteriores.
- **Tasa de cambio:** No se actualiza automáticamente. Debes ajustarla manualmente cuando sea necesario.
- **Política de cancelación:** Este parámetro es solo referencial para el equipo del hotel. El sistema no aplica reembolsos automáticos — los pagos son siempre offline.
- Todos los cambios en configuración quedan registrados en la bitácora con los valores anteriores y nuevos.

---

## CU-08 — Ver reportes y KPIs

**Objetivo:** Consultar las métricas de ocupación, reservas y cancelaciones del hotel para tomar decisiones operativas.

**Ruta:** `/dashboard/reportes`

> Esta función también está disponible para el Dueño. El Administrador la hereda con acceso completo.

---

### KPIs disponibles

| Métrica             | Descripción                                       | Período             |
| ------------------- | ------------------------------------------------- | ------------------- |
| Reservas activas    | Reservas confirmadas con check-in en fecha futura | Actual              |
| Reservas del mes    | Total de reservas creadas en el mes seleccionado  | Filtrable por mes   |
| Tasa de cancelación | Porcentaje de reservas canceladas sobre el total  | Filtrable por rango |
| Ocupación %         | Porcentaje de habitaciones físicas ocupadas hoy   | Hoy                 |

---

### Gráficos disponibles

- **Gráfico de ocupación:** Línea temporal con el porcentaje de ocupación por día en el rango seleccionado.
- **Gráfico de reservas por mes:** Barras con el volumen de reservas confirmadas agrupadas por mes.

---

### Cómo usar los filtros

1. Selecciona el **rango de fechas** con el selector en la parte superior.
2. Los KPIs y gráficos se actualizan automáticamente.
3. Puedes filtrar adicionalmente por tipo de habitación en algunos gráficos.

---

### Consideraciones importantes

- Los datos son de solo lectura — no puedes modificar nada desde esta sección.
- La exportación de reportes a PDF o Excel **no está disponible en esta versión** del sistema. Está planificada para una versión futura.
- Los datos de ocupación se calculan sobre las habitaciones físicas registradas. Si hay habitaciones sin registrar en el sistema, la ocupación aparecerá más alta de lo real.

---

## CU-09 — Ver la bitácora de auditoría

**Objetivo:** Consultar el registro histórico de todas las acciones realizadas por usuarios del sistema: quién hizo qué, cuándo y con qué valores.

**Ruta:** `/dashboard/bitacora`

> Esta función también está disponible para el Dueño.

---

### Qué registra la bitácora

Toda acción crítica queda registrada automáticamente. Los tipos de acciones registradas son:

| Acción    | Descripción                                             |
| --------- | ------------------------------------------------------- |
| `CREATE`  | Se creó un registro (reserva, usuario, promoción, etc.) |
| `UPDATE`  | Se modificó un registro                                 |
| `DELETE`  | Se eliminó un registro                                  |
| `CONFIRM` | Se confirmó una reserva                                 |
| `REJECT`  | Se rechazó una reserva o reseña                         |
| `CANCEL`  | Se canceló una reserva                                  |
| `APPROVE` | Se aprobó una reseña                                    |
| `LOGIN`   | Un usuario inició sesión                                |
| `LOGOUT`  | Un usuario cerró sesión                                 |

---

### Información disponible en cada entrada

| Campo         | Descripción                                                           |
| ------------- | --------------------------------------------------------------------- |
| Entidad       | Qué tipo de registro fue afectado (Reserva, Usuario, Promoción, etc.) |
| ID de entidad | Identificador del registro afectado                                   |
| Acción        | Tipo de acción realizada                                              |
| Realizado por | Nombre y rol del usuario que ejecutó la acción                        |
| Cambios       | Valores anteriores y nuevos (antes / después)                         |
| Dirección IP  | IP desde donde se realizó la acción                                   |
| Fecha y hora  | Timestamp exacto                                                      |

---

### Cómo usar la bitácora

1. Ve a **Bitácora** en el menú lateral.
2. Usa los filtros disponibles:
   - Por **tipo de entidad** (solo ver acciones sobre reservas, solo sobre usuarios, etc.)
   - Por **tipo de acción** (solo confirmaciones, solo cancelaciones, etc.)
   - Por **usuario** (ver qué hizo un recepcionista específico)
   - Por **rango de fechas**
3. Haz clic en una entrada para ver el detalle completo incluyendo los valores `antes/después`.

---

### Casos de uso frecuentes

- **Auditar las acciones de un recepcionista específico:** filtra por su nombre de usuario.
- **Ver quién canceló una reserva:** abre la reserva desde el listado, en la sección "Historial de acciones" al final del detalle.
- **Verificar un cambio en la configuración:** filtra por entidad `SystemSetting` y acción `UPDATE`.
- **Investigar acceso no autorizado:** filtra por acción `LOGIN` y revisa las IPs.

---

### Consideraciones importantes

- La bitácora es de **solo lectura**. Ningún usuario puede modificarla ni eliminar registros.
- Las acciones realizadas por visitantes desde la web (crear una reserva desde la landing) aparecen con el campo "Realizado por" vacío — es el comportamiento esperado.
- Los registros no tienen fecha de expiración en esta versión. Se acumulan indefinidamente.

---

## 12. Funciones de reservas heredadas del rol Recepcionista

El Administrador tiene acceso completo a todas las funciones del Recepcionista. A continuación un resumen; para el detalle operativo de cada una consulta el **Manual de Usuario — Rol Recepcionista**.

| Función                     | Descripción resumida                                 |
| --------------------------- | ---------------------------------------------------- |
| Ver listado de reservas     | Tabla con filtros de estado y fecha                  |
| Ver detalle de reserva      | Información completa del huésped y la reserva        |
| Confirmar reserva           | PENDING → CONFIRMED + email al huésped               |
| Rechazar reserva            | PENDING → REJECTED + motivo obligatorio              |
| Cancelar reserva            | → CANCELLED + motivo obligatorio                     |
| Crear reserva manual        | Formulario de 3 secciones para reservas por teléfono |
| Editar reserva              | Modificar datos de una reserva existente             |
| Ver calendario              | Vista visual de ocupación por fecha                  |
| Ver huéspedes               | Listado histórico con búsqueda                       |
| Gestionar sala de reuniones | Confirmar, rechazar y cancelar solicitudes           |
| Gestionar restaurante       | Confirmar, rechazar y cancelar reservas de mesa      |

---

## 13. Errores frecuentes y soluciones

| Situación                                                  | Causa probable                                                | Solución                                                                                          |
| ---------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| No puedo desactivar un tipo de habitación                  | Tiene reservas activas (PENDING o CONFIRMED) asociadas        | Resuelve primero las reservas pendientes de ese tipo, luego desactiva                             |
| La promoción no aparece en la web aunque está activa       | La fecha de fin ya pasó, o la fecha de inicio es futura       | Verifica el rango de fechas en el formulario de la promoción                                      |
| El precio de la piscina aparece como $0 en la web          | El parámetro `pool_price` no fue configurado                  | Ve a Configuración → Precios → actualiza `pool_price`                                             |
| Las instrucciones de pago del correo están desactualizadas | El parámetro `payment_instructions` no fue actualizado        | Ve a Configuración → Pago → actualiza el texto                                                    |
| No puedo aprobar/rechazar una reseña ya procesada          | La reseña ya está en estado APPROVED o REJECTED               | Las reseñas procesadas no pueden volver a PENDING. Si fue un error, consulta con soporte técnico. |
| Un usuario no puede iniciar sesión                         | La cuenta está desactivada o las credenciales son incorrectas | Ve a Usuarios → verifica que `isActive` esté activado y resetea la contraseña si es necesario     |
| La tasa de cambio está desactualizada                      | El parámetro `exchange_rate` no se actualiza automáticamente  | Ve a Configuración → Precios → actualiza `exchange_rate.vesToUsd` con el valor vigente            |
| El calendario muestra menos ocupación de la real           | Hay habitaciones físicas sin registrar en el sistema          | Ve a Habitaciones → verifica que todas las habitaciones del hotel estén registradas               |

---

## 14. Responsabilidades críticas del Administrador

El rol de Administrador tiene acceso a acciones irreversibles o de alto impacto en la operación del hotel. Las siguientes son las responsabilidades que requieren especial atención:

### Antes del primer uso del sistema

- [ ] Configurar el **precio de la piscina** (`pool_price`) — el valor inicial es $0.
- [ ] Actualizar las **instrucciones de pago** (`payment_instructions`) con los datos bancarios reales del hotel.
- [ ] Verificar que la **tasa de cambio** (`exchange_rate`) sea la vigente.
- [ ] Confirmar que todos los **tipos de habitación** y sus precios están correctos.
- [ ] Registrar todas las **habitaciones físicas** del hotel con sus números reales.
- [ ] Crear las cuentas de usuario para el personal de recepción.

### En el uso diario

- Revisar las reseñas pendientes en **Reseñas** al menos una vez por día.
- Mantener actualizadas las instrucciones de pago si cambian los datos bancarios.
- Desactivar inmediatamente las cuentas de usuarios que dejen de trabajar en el hotel.

### En el uso periódico

- Actualizar la tasa de cambio VES/USD cuando sea necesario.
- Revisar el contenido de la web si cambian servicios, precios o políticas del hotel.
- Crear y desactivar promociones según la temporada.

---

_Manual de usuario v1.0 — Hotel Río Yurubí_  
_Derivado del SPEC TÉCNICO v2.1 · Rol: ADMIN_  
_Para soporte técnico del sistema, contacta al desarrollador responsable del proyecto._
