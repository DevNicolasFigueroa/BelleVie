# BelleVie — Sistema de Gestión Inteligente para Clínica Estética

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06b6d4?style=flat-square&logo=tailwindcss)

BelleVie es una plataforma web para gestión integral de una clínica de kinesiología estética en Santiago, Chile. Centraliza agendamiento de citas, venta de productos, gestión de inventario y comunicación en un solo lugar.

## 🎯 Características Principales

### Para Clientes
- ✅ Catálogo de tratamientos (Laserlipólisis, Cavitación, Facial Radiofrecuencia, Depilación Láser)
- ✅ Catálogo de productos premium
- ✅ Agendamiento de citas con disponibilidad en tiempo real
- ✅ Carrito unificado (productos + depósitos de citas)
- ✅ Pago online vía Webpay Plus (Transbank)
- ✅ Perfil personal con historial de citas y compras
- ✅ Página de contacto pública
- ⏳ Chat con bot de atención (próximo sprint)

### Para Administrador
- ✅ Panel de control con citas, pedidos, inventario
- ✅ Gestión de fichas clínicas (historial, alergias, notas médicas)
- ✅ Control de stock y movimientos
- ✅ Búsqueda avanzada de clientes
- ⏳ Asistente bot interno (próximo sprint)

## 🏗️ Arquitectura

### Stack Tecnológico
- **Frontend:** Next.js 16 (App Router), React 18, TypeScript, TailwindCSS
- **Backend:** Xano (PostgreSQL)
- **Pagos:** Webpay Plus / Transbank
- **IA:** Claude API (futuro: chatbots cliente/admin)

### Dos Codebases, Un Repo
```
bellevie/
├── src/              # Next.js 16 frontend
├── xano-backend/     # Espejo local de endpoints Xano
└── PLANNING.md       # Documentación del proyecto
```

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn
- Variables de entorno (.env.local)

### Instalación
```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Variables de Entorno
```env
NEXT_PUBLIC_XANO_BASE_URL=https://your-xano-instance.com/api/rest/v1
NEXT_PUBLIC_XANO_AUTH_URL=https://your-xano-instance.com/api/rest/v1
XANO_INTERNAL_SECRET=your_shared_secret
```

## 📊 Estado del Proyecto

| Épica | Descripción | Estado |
|-------|-------------|--------|
| E1 | Autenticación | ✅ Completada |
| E2 | Catálogo | ✅ Completada |
| E3 | Agendamiento | ✅ Completada |
| E4 | Carrito y Pago | ✅ Completada |
| E5 | Chatbot Cliente | ⏳ Pendiente |
| E6 | Panel Admin | ✅ Completada |
| E7 | Inventario | ⏳ Pendiente |
| E8 | Gestión Clientes | ✅ Completada |
| E9 | Chatbot Admin | ⏳ Pendiente |

**Progreso:** 6 de 9 épicas (67%)

## 💡 Características Técnicas Destacadas

### Autenticación
- JWT en localStorage + cookie (para validación server-side)
- Roles: cliente / admin
- Protección de rutas vía `proxy.ts` + validación en páginas

### Carrito Unificado
- Soporta productos y depósitos de citas en el mismo carrito
- Expansión de datos con join+eval en Xano (patrón de seguridad)
- Total calculado server-side (previene fraude)

### Pagos Seguros
- Integración Webpay Plus con validación de monto server-side
- Autenticación servidor-a-servidor vía secreto compartido (XANO_INTERNAL_SECRET)
- Idempotencia en confirmación de pago (reintentos seguros)

### Agendamiento
- Bloques horarios fijos (9-17 hrs, L-V)
- Bloqueo automático de horas pasadas/actuales
- Disponibilidad en tiempo real
- Depósito del 50% integrado en checkout

## 📁 Estructura de Carpetas

```
src/
├── app/
│   ├── admin/              # Panel administrador
│   ├── cliente/            # Páginas cliente
│   │   ├── perfil/         # Perfil con historial
│   │   ├── tratamientos/   # Catálogo tratamientos
│   │   ├── productos/      # Catálogo productos
│   │   ├── carrito/        # Carrito de compras
│   │   └── agenda/         # Agendamiento
│   ├── contacto/           # Página pública de contacto
│   ├── api/                # Route handlers
│   └── page.tsx            # Home
├── lib/
│   ├── xano.ts             # Cliente Xano (JWT)
│   ├── xano-server.ts      # Cliente Xano (secreto compartido)
│   ├── auth.ts             # Autenticación
│   ├── cart.ts             # Lógica de carrito
│   ├── webpay.ts           # Cliente Webpay
│   └── buy-order.ts        # Encoding de órdenes
├── components/             # Componentes reutilizables
└── types/                  # TypeScript types
```

## 🔒 Seguridad

### Validación de Propiedad
- Todas las operaciones de escritura mapean `client_id` a `$auth.id` (JWT) en Xano
- Lectura de recursos validados en Xano: `resource.client_id == $auth.id || role == "admin"`

### Validación de Monto
- POST /webpay/create: fetch del recurso con JWT, monto derivado server-side
- POST /webpay/commit: validación de monto contra registro en Xano

### Secreto Compartido
- XANO_INTERNAL_SECRET solo en .env (nunca versionado)
- Usado exclusivamente para callbacks de Transbank (server-to-server)

## 📚 Documentación

- **CLAUDE.md** — Guía técnica para Claude Code (arquitectura, comandos, patrones)
- **PLANNING.md** — Especificación del proyecto, modelo de datos, historia de sprints

## 🛠️ Comandos Disponibles

```bash
npm run dev       # Iniciar servidor desarrollo (puerto 3000)
npm run build     # Build producción + typecheck
npm run lint      # Ejecutar ESLint
npm start         # Ejecutar build producción
```

## 🔄 Sincronización Xano

Los archivos `.xs` en `xano-backend/` son espejos locales de los endpoints Xano. Para sincronizar:

```bash
# Push un archivo
xano workspace push --force -i "api/content/cart_GET.xs"

# Pull estado actual
xano workspace pull --directory xano-backend/
```

**Importante:** Siempre validar antes de push con `xano_validate_xanoscript`.

## 📞 Contacto

Para consultas sobre desarrollo o mejoras, ver página `/contacto` en la aplicación.

## 📄 Licencia

Privado — Proyecto interno para BelleVie.

---

**Última actualización:** Julio 2026  
**Estado:** En desarrollo activo — Sprint 3 completado, Sprint 4+ en backlog
