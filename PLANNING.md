# PLANNING.md — BelleVie: Sistema de Gestión Inteligente para Clínica Estética

## 1. Contexto del proyecto

**BelleVie** es una pyme unipersonal de kinesiología estética en Santiago de Chile. La administradora es a la vez dueña y profesional que entrega los tratamientos. Hoy gestiona todo de forma manual y fragmentada: WhatsApp para agendamiento, Excel para stock, registros bancarios manuales para pagos.

**Objetivo del proyecto:** quitarle carga administrativa a la administradora para que enfoque su tiempo en la atención clínica, centralizando agendamiento, ventas, inventario y comunicación en una sola plataforma con apoyo de IA.

## 2. Actores y funcionalidades

### Cliente (paciente)
- Ver tratamientos y productos
- Agendar citas — **requiere abono del 50% del valor del tratamiento al momento de reservar** (la reserva también pasa por carrito/checkout, igual que la compra de productos)
- Comprar productos (carrito + pago online)
- Chatear con un bot de atención

### Administradora
- Gestionar citas (ver, reprogramar, cancelar)
- Ver pedidos de productos
- Controlar inventario
- Buscar clientes y ver sus fichas
- Chatbot que funciona como asistente personal (consultas internas, resúmenes, apoyo en gestión)

## 3. Catálogo inicial

**Tratamientos (4):**
1. Laserlipólisis
2. Cavitación
3. Facial con Radiofrecuencia
4. Depilación Láser — **con opciones de zona del cuerpo** (requiere modelo de datos con variantes/sub-opciones, cada una con su propio precio/duración)

**Productos (3):**
1. Crema Reductora Intensiva
2. Gel Exfoliante Corporal
3. Serum Facial Ácido Hialurónico

**Horario de atención:** Lunes a Viernes, 9:00 - 18:00 hrs (relevante para la lógica de disponibilidad de agenda).

## 4. Stack tecnológico (definido)

| Capa | Tecnología |
|---|---|
| Frontend | Next.js + React + TypeScript + TailwindCSS |
| Backend | Xano (PostgreSQL) — API y lógica de negocio vía Xano Functions/Workflows |
| Base de datos | PostgreSQL (gestionada por Xano) |
| IA | Claude API — chatbot cliente + chatbot asistente admin |
| Pagos | Por definir (Webpay Plus/Transbank es lo estándar en Chile — lo evaluamos cuando lleguemos a esa fase) |
| Metodología | Scrum, con registro de avance por sprint |

**Nota sobre Xano:** al ser low-code, gran parte del backend (endpoints CRUD, autenticación, lógica de negocio simple) se construye visualmente en Xano en vez de escribir Express/Node. Esto cambia el flujo de trabajo: en vez de "programar rutas", vamos a "diseñar tablas + workflows + endpoints" dentro de Xano, y consumir esa API REST desde Next.js. Cuando lleguemos a la integración con Claude, definiremos si el chatbot llama directo a los endpoints de Xano (tool use) o si necesitamos una capa intermedia liviana.

## 5. Modelo de datos (implementado en Xano — Sprint 0 completo)

**Convención:** tablas y campos en inglés.

- **user** (Auth Table nativa de Xano) (id, created_at, name, email, password, phone, role: admin/client, password_reset)
- **event_log** (default de Xano) (id, created_at, user_id, action, metadata) — reservada para auditoría, se activa más adelante
- **treatment** (id, created_at, name, description, base_price, duration_min)
- **treatment_option** (id, created_at, treatment_id → treatment, zone_name, price, duration_min) — solo usada por Depilación Láser
- **product** (id, created_at, name, description, price, stock, image_url)
- **appointment** (id, created_at, client_id → user, treatment_id → treatment, option_id → treatment_option [nullable], date, time [enum: 9-17], status [enum: pending/confirmed/cancelled/completed], total_price, deposit_amount, deposit_status [enum: pending/paid])
- **cart** (id, created_at, client_id → user, item_type [enum: product/appointment_deposit], product_id → product [nullable], appointment_id → appointment [nullable], quantity, unit_price)
- **order** (id, created_at, client_id → user, type [enum: product/appointment_deposit], items [json], total, payment_status [enum: pending/paid/failed/refunded])
- **inventory_movement** (id, created_at, product_id → product, type [enum: in/out], quantity, date, reason)
- **client_file** (id, created_at, user_id → user, clinical_notes, history, allergies)
- **conversation** (id, created_at, user_id → user, bot_role [enum: client/admin], messages [json])

**Decisión de diseño clave — `appointment.time`:** se definió como `enum` con los 9 bloques horarios fijos (`9` a `17`), no como hora exacta con minutos. Todos los tratamientos ocupan un bloque completo de 60 min aunque su duración real sea 45-60 min (`treatment.duration_min` queda como dato informativo). Esto simplifica la verificación de disponibilidad a una sola consulta (¿existe ya un `appointment` con ese `date` + `time`?) y da colchón natural entre turnos.

## 6. Metodología Scrum — organización del trabajo

Trabajaremos con **Product Backlog por épicas**, cada épica se descompone en historias de usuario, y agrupamos historias en **Sprints**. Al cerrar cada sprint dejamos registro de: qué se implementó, qué quedó pendiente, y decisiones técnicas tomadas (esto sirve además como bitácora para tu memoria de proyecto/portfolio).

### Épicas del Product Backlog

| Épica | Descripción |
|---|---|
| E1 - Autenticación | Registro/login cliente y admin, roles |
| E2 - Catálogo | CRUD tratamientos, opciones (zonas), productos |
| E3 - Agendamiento | Disponibilidad, crear/gestionar citas. **Depende de E4**: toda cita creada exige el pago del 50% de abono vía carrito antes de confirmarse |
| E4 - Carrito y Pago | Carrito (productos y abonos de citas), checkout, pasarela de pago |
| E5 - Chatbot Cliente | Atención, consultas, agendar vía chat |
| E6 - Panel Admin | Vista de citas, pedidos, gestión general |
| E7 - Inventario | Control de stock, movimientos |
| E8 - Gestión de Clientes | Búsqueda de clientes, fichas clínicas |
| E9 - Chatbot Admin | Asistente interno para la administradora |

### Propuesta de Sprints (a ajustar juntos)

- **Sprint 0 — Fundacional:** Setup de Xano (tablas, auth), setup Next.js + Tailwind, definición de diseño (UI kit), deploy inicial vacío.
- **Sprint 1:** E1 (auth) + E2 (catálogo, incluyendo variantes de depilación láser).
- **Sprint 2:** E4 (carrito + pago online), incluyendo soporte para ítems tipo "abono de reserva", no solo productos.
- **Sprint 3:** E3 (agendamiento completo, lógica de horario L-V 9-18h, integrado con el checkout del abono del 50% construido en Sprint 2).
- **Sprint 4:** E5 (chatbot cliente conectado a catálogo + agenda vía tool use).
- **Sprint 5:** E6 + E7 (panel admin, pedidos, inventario).
- **Sprint 6:** E8 (fichas de clientes) + E9 (chatbot asistente admin).
- **Sprint 7:** Integración final, pulido, testing, deploy producción.

Cada sprint incluirá su propio registro de Sprint Backlog y Sprint Review dentro del repositorio (por ejemplo en una carpeta `/docs/sprints/`).

## 7. Estado actual — Resumen de sprints completados

### Sprint 0 — Fundacional: CERRADO ✅

**Completado:**
- ✅ Repo Next.js 16 + TypeScript + Tailwind
- ✅ Git Flow (`main`/`develop`) + Conventional Commits
- ✅ Estructura de carpetas sin paréntesis: `/admin`, `/cliente` con sub-rutas (`citas`, `productos`, `agenda`, etc.)
- ✅ Librerías base: `lib/xano.ts`, `lib/claude.ts`, `types/index.ts`
- ✅ Variables de entorno (`.env.local`) + `.gitignore`
- ✅ Modelo de datos: 10 tablas en Xano con relaciones y seguridad básica
- ✅ Conexión Xano verificada (API Group `content` y `Authentication`)
- ✅ PR #1 mergeada

---

### Sprint 1 — Autenticación (E1) + Catálogo (E2): CERRADO ✅

**E1 - Autenticación:**
- `lib/auth.ts`: signup, login, getMe, logout conectados al API Group `Authentication` de Xano
- Páginas `/cliente/signup` y `/cliente/login`
- Token guardado en localStorage + cookie (para que `proxy.ts` pueda validar en servidor)
- `src/proxy.ts` (Next.js 16): protege `/admin` y rutas privadas (`/cliente/agenda`, `/cliente/carrito`, `/cliente/chat`)
- Redirección post-login según `role`: admin → `/admin`, cliente → `/`
- PR #2 mergeada

**E2 - Catálogo de tratamientos y productos:**
- `/cliente/tratamientos`: lista de 4 tratamientos desde `/treatment`
- `/cliente/tratamientos/[id]`: detalle; si es "Depilación Láser", expande opciones de zona desde `/treatment_option`
- `/cliente/productos`: lista de 3 productos desde `/product`
- `/cliente/productos/[id]`: detalle con datos reales (nombre, descripción, precio, stock)
- Manejo de errores básico (`error.tsx`)
- Navegación con `Link` entre listados y detalles
- PR #3 mergeada

---

### Sprint 2 — Carrito de productos (E4): CERRADO ✅

**E4 - Carrito de compras (solo productos, no citas aún):**
- `lib/cart.ts`: cliente autenticado con `getCart()`, `addProductToCart()`, `updateCartItemQuantity()`, `removeFromCart()`
- **Seguridad en Xano:** `client_id` se toma de `auth.id` en el token, nunca del body (previene que un usuario modifique carritos de otros)
- Botón "Agregar al carrito" en `/cliente/productos/[id]` (componente `AddToCartButton.tsx`)
- `/cliente/carrito`: listado interactivo con cantidad, precio unitario, subtotal, botón eliminar, total
- Relación expandida en `GET /cart`: trae `_product.name` para mostrar nombre real en vez de ID
- **Fix importante:** `xanoFetch` ahora usa `cache: "no-store"` para evitar servir precios/stock desactualizados (problema de caché de Next.js)
- **Fix en Xano:** mapeo correcto de campos en `POST /cart` (item_type, product_id, quantity, unit_price)
- Botón "Ir a pagar" existe pero todavía no hace nada (pasarela de pago pendiente)
- PR #4 mergeada

---

## 8. Próximos pasos — Sprint 3 en adelante

### Sprint 3 — Agendamiento (E3)
- Crear tabla `appointment` en Xano (si no está completada)
- Página `/cliente/agenda`: disponibilidad según L-V 9-18h (bloques horarios por `time`)
- Flujo: cliente selecciona tratamiento → selecciona zona (si aplica) → selecciona fecha/hora → aparece en carrito como `appointment_deposit` (50% del precio)
- Página `/admin/citas`: ver citas del día, gestionar (reprogramar, cancelar)

### Sprint 4 — Pasarela de pago
- Integración con Transbank/Webpay Plus (estándar en Chile)
- Endpoint de checkout que llama a la pasarela
- Webhook para confirmar pago exitoso → actualiza `appointment.deposit_status = paid` y `order.payment_status = paid`
- Notificación al usuario post-pago (email/WhatsApp)

### Sprint 5 — Panel admin básico
- `/admin/citas`: vista de citas del día/mes, búsqueda
- `/admin/pedidos`: listado de órdenes de productos y depósitos de citas
- `/admin/inventario`: control de stock, movimientos

### Sprint 6 — Fichas de cliente y chatbot admin
- `/admin/clientes`: búsqueda y ficha de cliente (historial, alergias, notas clínicas)
- Chatbot asistente para admin: resúmenes, consultas internas

### Sprint 7 — Chatbot cliente (E5) + pulido final
- `/cliente/chat`: interfaz de chat con Claude API
- Tool use: el bot puede agendar, consultar disponibilidad, crear órdenes
- Testing, optimización, deploy a producción

---

## 9. Notas técnicas importantes (para futuras referencias)

1. **Next.js 16 → proxy.ts:** renombró `middleware.ts` a `proxy.ts`, cambió export de `middleware` a `proxy`. Runtime Node.js.
2. **Caché de datos en Xano:** `xanoFetch` usa `cache: "no-store"` porque precios/stock pueden cambiar en cualquier momento en la base de datos.
3. **Seguridad en POST/GET:** siempre mapear `client_id` al `auth.id` del token, nunca aceptar del body. Aplica a `/cart`, `/order`, `/conversation`, `/client_file`, etc.
4. **Relaciones en Xano:** usar "Add Related Record" addon en el Output de endpoints para expandir `_producto` / `_tratamiento` en una sola llamada en vez de N fetches desde React.
5. **Rutas protegidas:** `proxy.ts` protege el acceso, pero cada página también debe validar `getMe()` y confirmar el `role` para protegerse de edge cases.
6. **Depilación Láser:** es el único tratamiento con variantes (`treatment_option`). Cuando agendas, pasas `option_id` en lugar de usar `treatment.base_price` directo.
7. **Abono del 50%:** siempre se calcula server-side (en Xano) como `total_price * 0.5` al crear la cita, nunca en el frontend.
