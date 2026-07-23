# PLANNING.md — BelleVie: Sistema de Gestión Inteligente para Clínica Estética

## 1. Contexto del proyecto

**BelleVie** es una pyme unipersonal de kinesiología estética en Santiago de Chile. La administradora es a la vez dueña y profesional que entrega los tratamientos. Hoy gestiona todo de forma manual y fragmentada: WhatsApp para agendamiento, Excel para stock, registros bancarios manuales para pagos.

**Objetivo del proyecto:** quitarle carga administrativa a la administradora para que enfoque su tiempo en la atención clínica, centralizando agendamiento, ventas, inventario y comunicación en una sola plataforma con apoyo de IA.

## 2. Actores y funcionalidades

### Cliente (paciente)
- Ver tratamientos y productos
- Agendar citas — **requiere abono del 50% del valor del tratamiento al momento de pagar** (ahora integrado en carrito, no es un flujo separado)
- Comprar productos (carrito + pago online)
- Chatear con un bot de atención

### Administradora
- Gestionar citas (ver, reprogramar, cancelar)
- Ver pedidos de productos
- Controlar inventario
- Buscar clientes y ver sus fichas (clínicas con historial de citas/pedidos)
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
| Frontend | Next.js 16 (App Router) + React + TypeScript + TailwindCSS |
| Backend | Xano (PostgreSQL) — API y lógica de negocio vía XanoScript |
| Base de datos | PostgreSQL (gestionada por Xano) |
| IA | Claude API — chatbot cliente + chatbot asistente admin |
| Pagos | Webpay Plus/Transbank (integración completada en Sprint 3) |
| Metodología | Scrum, con registro de avance por sprint |

**Nota sobre Xano:** al ser low-code, gran parte del backend se construye en XanoScript. Xano CLI (`xano workspace push/pull`) es la forma confiable de sincronizar cambios — los archivos `.xs` bajo `xano-backend/` son el espejo local del estado desplegado, nunca confiar solo en la Meta API.

**Nota sobre Next.js 16:** versión con breaking changes (`middleware.ts` → `src/proxy.ts`, export `middleware` → `proxy`). Siempre revisar `node_modules/next/dist/docs/` antes de asumir comportamiento.

## 5. Modelo de datos (implementado en Xano — Sprints 0-3 completados)

**Convención:** tablas y campos en inglés.

- **user** (Auth Table nativa de Xano) — id, created_at, name, email, password, phone, role: admin/client, password_reset
- **event_log** (default de Xano) — id, created_at, user_id, action, metadata — reservada para auditoría, se activa más adelante
- **treatment** — id, created_at, name, description, base_price, duration_min
- **treatment_option** — id, created_at, treatment_id → treatment, zone_name, price, duration_min — solo usada por Depilación Láser
- **product** — id, created_at, name, description, price, stock, image_url
- **appointment** — id, created_at, client_id → user, treatment_id → treatment, option_id → treatment_option [nullable], date (YYYY-MM-DD), time (enum: 9–17), status (enum: pending/confirmed/cancelled/completed), total_price, deposit_amount, deposit_status (enum: pending/paid)
- **cart** — id, created_at, client_id → user, item_type (enum: product/appointment_deposit), product_id → product [nullable], appointment_id → appointment [nullable], quantity, unit_price
- **order** — id, created_at, client_id → user, type (enum: product/appointment_deposit), items (json array), total, payment_status (enum: pending/paid/failed/refunded)
- **inventory_movement** — id, created_at, product_id → product, type (enum: in/out), quantity, date, reason
- **client_file** — id, created_at, user_id → user, clinical_notes, history, allergies
- **conversation** — id, created_at, user_id → user, bot_role (enum: client/admin), messages (json)

**Decisión de diseño clave — `appointment.time`:** se definió como `enum` con los 9 bloques horarios fijos (`9` a `17`), no como hora exacta con minutos. Todos los tratamientos ocupan un bloque completo de 60 min. Esto simplifica la verificación de disponibilidad a una sola consulta (¿existe ya un `appointment` con ese `date` + `time`?) y da colchón natural entre turnos.

## 6. Metodología Scrum — organización del trabajo

Trabajamos con **Product Backlog por épicas**, cada épica se descompone en historias de usuario, agrupadas en **Sprints**. Se mantiene registro de: qué se implementó, qué quedó pendiente, y decisiones técnicas tomadas (para bitácora/portfolio).

### Épicas del Product Backlog

| Épica | Descripción | Estado |
|---|---|---|
| E1 - Autenticación | Registro/login cliente y admin, roles | ✅ Completada |
| E2 - Catálogo | CRUD tratamientos, opciones (zonas), productos | ✅ Completada |
| E3 - Agendamiento | Disponibilidad, crear/gestionar citas. Depende de E4 | ✅ Completada |
| E4 - Carrito y Pago | Carrito (productos y abonos de citas), checkout, pasarela de pago | ✅ Completada (Sprint 3) |
| E5 - Chatbot Cliente | Atención, consultas, agendar vía chat | ⏳ Pendiente |
| E6 - Panel Admin | Vista de citas, pedidos, gestión general | ✅ Completada (Sprint 2) |
| E7 - Inventario | Control de stock, movimientos | ⏳ Pendiente |
| E8 - Gestión de Clientes | Búsqueda de clientes, fichas clínicas | ✅ Completada (Sprint 2) |
| E9 - Chatbot Admin | Asistente interno para la administradora | ⏳ Pendiente |

## 7. Estado actual — Sprints completados

### Sprint 0 — Fundacional: ✅ CERRADO

**Completado:**
- ✅ Repo Next.js 16 + TypeScript + Tailwind
- ✅ Git Flow (`main`/`develop`) + Conventional Commits
- ✅ Estructura de carpetas: `/admin`, `/cliente` con sub-rutas
- ✅ Librerías base: `lib/xano.ts`, `lib/auth.ts`, `lib/cart.ts`, `lib/appointment.ts`
- ✅ Variables de entorno (`.env.local`) + `.gitignore`
- ✅ Modelo de datos: 10 tablas en Xano con relaciones y seguridad básica
- ✅ Conexión Xano verificada (API Groups `content` y `Authentication`)

---

### Sprint 1 — Autenticación (E1) + Catálogo (E2): ✅ CERRADO

**E1 - Autenticación:**
- ✅ `lib/auth.ts`: signup, login, getMe, logout conectados al API Group `Authentication` de Xano
- ✅ Páginas `/cliente/signup`, `/cliente/login`
- ✅ Token en localStorage + cookie (para `proxy.ts` server-side)
- ✅ `src/proxy.ts`: protege `/admin` y rutas privadas (`/cliente/agenda`, `/cliente/carrito`, `/cliente/chat`)
- ✅ Redirección post-login según role (admin → `/admin`, cliente → `/`)

**E2 - Catálogo:**
- ✅ `/cliente/tratamientos`: lista de 4 tratamientos desde `/treatment`
- ✅ `/cliente/tratamientos/[id]`: detalle; si es "Depilación Láser", expande opciones de zona
- ✅ `/cliente/productos`: lista de 3 productos desde `/product`
- ✅ `/cliente/productos/[id]`: detalle con datos reales (nombre, descripción, precio, stock)

---

### Sprint 2 — Panel Admin + Fichas de Cliente: ✅ CERRADO

**E6 - Panel Admin:**
- ✅ `/admin/citas`: listado de citas con filtros (Todas/Pendientes/Confirmadas/Completadas)
- ✅ `/admin/pedidos`: listado de órdenes de productos y depósitos
- ✅ `/admin/inventario`: control de stock

**E8 - Fichas de Cliente:**
- ✅ `/admin/clientes`: búsqueda de clientes
- ✅ `/admin/clientes/[id]`: ficha con historial de citas/pedidos y notas clínicas

---

### Sprint 3 — Flujo unificado de carrito + agendamiento + pago: ✅ CERRADO

**E4 - Carrito y Pagos (completado completamente):**
- ✅ `lib/cart.ts`: `getCart()`, `addProductToCart()`, `addAppointmentToCart()`, `updateCartItemQuantity()`, `removeFromCart()`, `createOrder()`
- ✅ Seguridad: `client_id` se toma de `$auth.id` en JWT, nunca del body
- ✅ `/cliente/carrito`: listado interactivo de productos y depósitos de citas, cantidad, precio, total
- ✅ GET /cart en Xano: usa `join appointment→treatment` + `eval` para expandir treatment.name (evita addons anidados que se descartan silenciosamente)
- ✅ POST /order en Xano: bifurca por `item_type` (product usa precio DB, appointment_deposit usa deposit_amount DB), calcula total server-side
- ✅ Integración Webpay Plus/Transbank:
  - ✅ `lib/webpay.ts` — cliente Webpay (solo en Route Handlers, nunca en client components)
  - ✅ `lib/buy-order.ts` — encodes payment intent en `{ORD|APPT}-{id}-{nonce}`
  - ✅ `POST /api/webpay/create` — lee recurso con JWT del usuario, calcula amount server-side, inicia transacción
  - ✅ `GET|POST /api/webpay/commit` — callback de Transbank, usa `xanoServerFetch` con `X-Internal-Secret` header, llama `/internal/order/{id}/mark-paid`
  - ✅ `xanoServerFetch` — server-only fetch wrapper que autentica con `XANO_INTERNAL_SECRET` (shared secret)
- ✅ `/internal/order/{id}/mark-paid` en Xano: valida secreto, confirma pago, procesa items por tipo (descuenta stock, confirma cita+marca depósito pagado), vacía carrito

**E3 - Agendamiento (completado integrado con carrito):**
- ✅ `/cliente/agenda`: selecciona tratamiento → fecha/hora → "Agregar al Carrito"
- ✅ AgendaClient.tsx: bloquea horas pasadas, hora en curso, horas ya reservadas (con tooltip al pasar mouse)
- ✅ Fix date off-by-one: cambio de `toISOString()` (UTC) a `getFullYear()/getMonth()/getDate()` (local)
- ✅ Crea `appointment` con status `pending` y `deposit_amount = total_price * 0.5`
- ✅ Añade a carrito como `item_type: "appointment_deposit"`

---

## 8. Arquitectura actual (Next.js 16 + Xano)

### Dos codebases, un repo
- `src/` — Next.js 16 (App Router), frontend desplegado
- `xano-backend/` — espejo local de XanoScript, sincronizado via Xano CLI

### Capas de data fetching
- `lib/xano.ts` (`xanoFetch`) — client-safe, content API, `cache: "no-store"`, usa JWT del usuario
- `lib/xano-server.ts` (`xanoServerFetch`) — server-only, autentica con `XANO_INTERNAL_SECRET` (shared secret, no JWT), usado EXCLUSIVAMENTE en Webpay commit
- `lib/auth.ts` — signup/login/me/logout contra Authentication API group. Token en localStorage + cookie (`bellevie_auth_token`)
- Módulos por feature (`lib/cart.ts`, `lib/appointment.ts`) — wrappean `xanoFetch`/fetches directas, usan `getToken()`

### Auth & authorization
- `src/proxy.ts` — gate `/admin`, `/cliente/agenda`, `/cliente/carrito`, `/cliente/chat` por cookie (existence check)
- Páginas redirigen a `/auth/me` server-side y validan role (proxy es first-pass, no es suficiente)
- Ownership en **Xano**: endpoints WRITE derivan `client_id` de `$auth.id`, **nunca** del body
- Endpoints READ de single-resource chequean `resource.client_id == $auth.id || role == "admin"`

### Booking flow (completamente refactorizado en Sprint 3)
1. Cliente selecciona tratamiento → va a `/cliente/agenda`
2. Selecciona fecha/hora → clic "Agregar al Carrito"
3. Frontend crea `appointment` (status pending, deposit_amount = total * 0.5)
4. Frontend llama `addAppointmentToCart()` → POST /cart con `item_type: "appointment_deposit"`, `appointment_id`, `unit_price: deposit_amount`
5. Cliente continúa comprando productos o procede a checkout
6. Checkout: POST /api/webpay/create con `{kind: "order", id}`
7. Route handler lee order usando JWT del usuario, calcula amount, inicia Transbank
8. Transbank callback a GET|POST /api/webpay/commit (sin JWT)
9. commit route usa xanoServerFetch con XANO_INTERNAL_SECRET
10. Llama /internal/order/{id}/mark-paid; Xano confirma cita + descuenta stock + vacía carrito

### Payments (Webpay Plus / Transbank) — Arquitectura de seguridad

**Patrón de secreto compartido:**
- El **secreto compartido** (XANO_INTERNAL_SECRET) es una credencial servidor-a-servidor entre Next.js y Xano
- Se guarda SOLO en `.env.local` (nunca en git), solo los Route Handlers lo conocen
- Usado EXCLUSIVAMENTE en `GET|POST /api/webpay/commit` (callback de Transbank, sin sesión de usuario)

**Flujo de seguridad:**
1. `POST /api/webpay/create` — Usuario autenticado con JWT
   - Cliente envía solo `{kind, id}` (no monto)
   - Route Handler fetch recurso con JWT del usuario (verifica ownership)
   - Amount se calcula server-side desde el registro
   - Inicia Transbank
   
2. `GET|POST /api/webpay/commit` — Callback de Transbank (sin usuario)
   - Route Handler NO tiene JWT (viene de servidor de Transbank)
   - Usa `xanoServerFetch` con `X-Internal-Secret: ${XANO_INTERNAL_SECRET}`
   - Xano valida secreto antes de ejecutar `/internal/order/{id}/mark-paid`
   - Si falla validación, retorna 403 Forbidden

**¿Por qué es correcto?**
- ✅ Ownership validado en create via JWT (no podés pagar algo ajeno)
- ✅ Monto derivado server-side, nunca confiado del cliente
- ✅ Secret solo entre Next.js y Xano (ambos tu infraestructura)
- ✅ Idempotencia en mark-paid (reintentos de Transbank no duplican pagos)
- ✅ Monto validado en mark-paid contra registro DB

## 9. Notas técnicas importantes

1. **Next.js 16** → `middleware.ts` → `src/proxy.ts`, export `middleware` → `proxy`
2. **Caché en xanoFetch** → `cache: "no-store"` (precios/stock cambian)
3. **Relaciones en Xano** → usar `join` + `eval` (addons anidados se descartan silenciosamente)
4. **Rutas protegidas** → `proxy.ts` es primer-pass; páginas deben re-validar `getMe()` + role
5. **Depilación Láser** → único tratamiento con variantes (`treatment_option`)
6. **Abono del 50%** → siempre server-side: `total_price * 0.5`
7. **Shared secret vs JWT** — JWT para client-user, secreto compartido para server-to-server callbacks
8. **XanoScript validation** — es syntax-only; validar con `xano_validate_xanoscript` antes de push, luego pull o hit live endpoint para confirmar

## 10. Próximos pasos (Sprint 4+)

### Sprint 4 — Chatbot Cliente (E5)
- `/cliente/chat`: interfaz de chat con Claude API
- Tool use: el bot puede agendar, consultar disponibilidad, crear órdenes

### Sprint 5 — Inventario avanzado (E7)
- `/admin/inventario`: control de stock, movimientos detallados
- `/admin/pedidos`: listado filtrable de órdenes

### Sprint 6 — Chatbot Admin (E9)
- Asistente interno para la administradora
- Resúmenes, consultas internas

### Sprint 7 — Integración final, pulido, deploy producción
- Testing, optimización, deploy
