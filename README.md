# 🌸 BelleVie — Sistema de Gestión Inteligente

![Estado](https://img.shields.io/badge/Estado-En_Desarrollo-orange)
![Versión Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black)
![Backend](https://img.shields.io/badge/Backend-Xano-blue)
![Pagos](https://img.shields.io/badge/Pagos-Webpay_Plus-red)

**BelleVie** es una plataforma integral web diseñada específicamente para una clínica boutique de kinesiología estética en Santiago de Chile. El sistema centraliza el agendamiento, ventas, control de inventario y comunicación en una sola herramienta, permitiendo al personal clínico enfocarse en la atención a los pacientes en lugar de en la carga administrativa.

---

## ✨ Características Principales

### 👤 Portal del Cliente (Paciente)
- **Catálogo Online:** Visualización interactiva de tratamientos (ej. Laserlipólisis, Cavitación) y productos físicos de skincare.
- **Reserva Inteligente:** Agendamiento de citas con validación de disponibilidad en tiempo real e interfaz adaptativa de calendarios.
- **Carrito Unificado:** Agregación conjunta y pago unificado de productos físicos y el abono obligatorio (50%) para la confirmación de citas de tratamiento.
- **Pagos Seguros:** Integración completa con **Webpay Plus (Transbank)** para transacciones seguras con tarjetas de crédito/débito.

### 🛡️ Panel de Administración (Staff)
- **Gestión de Agenda:** Calendario centralizado para ver, confirmar o cancelar citas.
- **Gestión de Órdenes:** Seguimiento de pedidos de productos y depósitos de tratamientos.
- **Fichas Clínicas:** Búsqueda rápida de pacientes, revisión de su historial de tratamientos, órdenes pasadas, notas clínicas y alergias.
- **Control de Inventario:** Monitoreo y ajuste básico de stock para venta de productos.

*(Próximamente: Chatbots con IA basados en la API de Claude, para atención automatizada de pacientes y como asistente inteligente para la administradora).*

---

## 🛠️ Arquitectura y Tecnologías

El proyecto se divide en dos capas fuertemente desacopladas:

### Frontend (Next.js)
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Seguridad Frontend:** Middleware proxy (`src/proxy.ts`) para protección de rutas según el rol de los usuarios (Admin/Client) y validación de cookies.

### Backend y Base de Datos (Xano)
- **Infraestructura:** [Xano](https://www.xano.com/) (Backend No-Code/Low-Code robusto y escalable montado sobre PostgreSQL).
- **Lógica de Negocios:** API customizada, relaciones y uniones complejas en endpoints para evitar manipulación de datos sensibles del lado del cliente.
- **Sincronización de Código:** Uso de Xano CLI para mantener un espejo local del backend (`xano-backend/`) y tener control de versiones de XanoScript.

### Arquitectura de Pagos Segura
La integración con Transbank Webpay utiliza un patrón de **Secreto Compartido** servidor a servidor (`XANO_INTERNAL_SECRET`). Esto garantiza que los callbacks asíncronos de pago que recibe Next.js se puedan re-enviar al backend Xano con autenticación exclusiva y máxima seguridad sin depender de JWT del cliente; logrando una actualización de base de datos, descuento de stock y confirmación de agendas 100% segura.

---

## 🚀 Configuración Local (Getting Started)

### Requisitos Previos
- Node.js (v18.17 o superior)
- Cuenta configurada en Xano (URLs de endpoints base)
- Credenciales de Integración de Transbank (Entorno de Comercio de Prueba).

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/bellevie.git
cd bellevie
```

### 2. Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto y configura las siguientes variables según el entorno de desarrollo:

```env
# Xano API Config
NEXT_PUBLIC_XANO_BASE_URL=https://tu-instancia-xano.com/api:XXXX
XANO_INTERNAL_SECRET=tu_secreto_super_seguro_para_server_to_server

# Transbank Webpay
# (A continuación las credenciales default de ambiente de integración)
WEBPAY_COMMERCE_CODE=597055555532
WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Instalar Dependencias e Iniciar
```bash
npm install

# Iniciar el servidor de desarrollo local
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación corriendo.

---

## 📂 Estructura Principal del Proyecto

- `/src/app/` — Rutas principales App Router (Rutas de `/admin`, `/cliente`, `/api`, `/auth`).
- `/src/lib/` — Componentes core de lógica de negocio y clientes API (`xano.ts`, `cart.ts`, `webpay.ts`, `auth.ts`).
- `/src/components/` — Componentes React aislados y reusables.
- `/public/` — Archivos estáticos.
- `/xano-backend/` — Espejo local de funciones y lambdas para control de versiones en git de XanoScript.

---

## 📅 Estado Actual y Desarrollo

Actualmente, el proyecto se encuentra en una transición clave de desarrollo:

- **Fase Transaccional Completada (✅):** Autenticación de roles, Catálogo de productos y tratamientos, Sistema unificado de agendas, Panel de administrador y checkout validado con Webpay Plus. Todo testeado e implementado exitosamente (Sprints 0 al 3).
- **Sprints Próximos (⏳):** Ingreso a la fase de automatización impulsada por IA. Desarrollo de *Claude API chatbots* para reservas conversacionales de pacientes y la elaboración del agente asistente para optimizar la gestión de la administración del local.
