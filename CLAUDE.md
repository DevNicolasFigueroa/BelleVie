# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

BelleVie is a booking/e-commerce app for a solo aesthetics clinic in Santiago, Chile (kinesiología estética). Clients browse treatments/products, book appointments (which require a 50% deposit paid through the same cart/checkout as product purchases), and pay via Webpay Plus (Transbank). Admins manage appointments, orders, inventory, and client files. See [PLANNING.md](PLANNING.md) for the full product spec, data model rationale, and sprint history — it's written in Spanish and is the source of truth for *why* things are modeled the way they are.

## Commands

```bash
npm run dev      # start dev server (Next.js, port 3000)
npm run build    # production build — also the fastest way to typecheck the whole repo
npm run lint     # eslint
npm start        # run a production build
```

There is no test suite configured (no test script, no test framework installed).

### Xano backend (xano-backend/)

The Xano backend (tables, endpoints, functions) is mirrored locally as XanoScript (`.xs`) files under `xano-backend/`, synced via the Xano CLI (`@xano/cli`, installed globally). This is the reliable path for deploying backend changes — the Meta API has silently written empty/incorrect stacks in the past.

```bash
xano workspace push --force -i "api/content/cart_GET.xs"   # push one file
xano workspace pull --directory <dir>                       # pull current deployed state (for diffing/verifying)
```

Always validate before pushing (`xano_validate_xanoscript` MCP tool, or equivalent). **Validation is syntax-only** — it does not catch things Xano's backend silently rejects at deploy time (see the addon caveat below). After pushing anything non-trivial, pull it back or hit the live endpoint to confirm the deployed behavior actually matches the source file.

**Known Xano footgun:** nested `addon` blocks (an `addon` inside another addon's config) validate as syntactically correct but are **silently dropped** by Xano on push — the whole addon entry disappears from the deployed endpoint, not just the invalid part. For multi-hop relations (e.g. cart → appointment → treatment), use `join` + `eval` on `db.query` instead of nesting addons.

## Architecture

### Two codebases, one repo

- `src/` — Next.js 16 (App Router) frontend, deployed as the actual product.
- `xano-backend/` — mirror of the Xano low-code backend (PostgreSQL underneath). Business logic (auth, cart totals, deposit calculation, payment confirmation) lives here, not in Next.js API routes, except where a route must act as a server-side intermediary (see Payments below).

Xano exposes two separate API groups with **different base URLs** (see `.env.local`): `content` (`NEXT_PUBLIC_XANO_BASE_URL`) for all business data, and `Authentication` (`NEXT_PUBLIC_XANO_AUTH_URL`) for signup/login/me.

### Next.js 16 caveat

This repo is on a Next.js version with breaking changes vs. what most training data assumes — notably `middleware.ts` → `src/proxy.ts` (export renamed `middleware` → `proxy`). Check `node_modules/next/dist/docs/` before relying on API shape from memory.

### Data fetching layers

- `lib/xano.ts` (`xanoFetch`) — client-safe fetch wrapper for the `content` API group, always `cache: "no-store"` (prices/stock must never be served stale). Used by client components with a user JWT.
- `lib/xano-server.ts` (`xanoServerFetch`) — server-only, authenticates with `XANO_INTERNAL_SECRET` (a shared secret, not a user token) instead of a JWT. Used exclusively by the Webpay commit route to call `/internal/*` Xano endpoints, because Transbank's callback has no user session to attach a JWT to.
- `lib/auth.ts` — signup/login/me/logout against the `Authentication` group. Token is kept in both `localStorage` (for client fetches) and a cookie (`bellevie_auth_token`, so `proxy.ts` can check it server-side).
- Feature-specific client modules (`lib/cart.ts`, `lib/appointment.ts`) wrap `xanoFetch`/direct fetches for one resource each, pulling the token via `getToken()`.

### Auth & authorization

`src/proxy.ts` gates `/admin`, `/cliente/agenda`, `/cliente/carrito`, `/cliente/chat` by presence of the auth cookie only (existence check, not validity/role). Pages layered under those prefixes — especially `admin/layout.tsx` — re-verify by calling `/auth/me` server-side and checking `role`, because proxy-level checks alone don't cover role or expired tokens. Follow this pattern for new protected pages: don't rely on the proxy alone.

Ownership is enforced **in Xano**, not in the frontend: every write endpoint (`cart`, `order`, `client_file`, `conversation`, appointment creation) derives `client_id`/`user_id` from `$auth.id` (the JWT), never from the request body — otherwise a client could act on another user's data by editing the payload. Read endpoints for single resources (`appointment/{id}`, `order/{id}`) check `resource.client_id == $auth.id || $me.role == "admin"`. When adding new Xano endpoints, follow this pattern.

### Booking flow (the part most likely to be touched)

Booking a treatment does **not** trigger payment directly. Selecting a date/time creates an `appointment` (status `pending`, `deposit_amount` computed server-side in Xano as `total_price * 0.5` — never trust a client-supplied amount), which is then added to `cart` as `item_type: "appointment_deposit"` (`lib/cart.ts` → `addAppointmentToCart`). Products and appointment deposits share the same cart and go through the same Webpay checkout. `appointment.time` is a fixed-hour-block enum (`9`–`17`, clinic hours Mon–Fri), not free-form time, which is what makes slot-availability a single query (does an `appointment` already exist for that `date`+`time`?) instead of interval math.

### Payments (Webpay Plus / Transbank)

- `lib/webpay.ts` builds the `webpayTransaction` client — never imported by client components, only Route Handlers (`WEBPAY_*` env vars have no `NEXT_PUBLIC_` prefix).
- `lib/buy-order.ts` encodes what's being paid for into Transbank's `buyOrder` string as `{ORD|APPT}-{id}-{nonce}` — the id must never be truncated (Webpay's 26-char buyOrder limit is the reason the format is this terse), since `commit` decodes it to know which Xano row to mark paid.
- `POST /api/webpay/create` — reads the resource (order or appointment) from Xano *using the user's own JWT* so Xano's ownership check does double duty as the payment-authorization check, then derives `amount` from that resource server-side. The client only sends `{kind, id}`, never an amount.
- `GET|POST /api/webpay/commit` — Transbank's return URL. Checks transaction status before committing (idempotency, in case the user refreshes the receipt page), then calls the Xano `/internal/{order|appointment}/{id}/mark-paid` endpoint via `xanoServerFetch` (shared-secret auth, since there's no user session on this request). Redirects to `/cliente/pago-confirmado` with a `status` query param (`success` / `rejected` / `cancelled` / `payment_ok_sync_failed` / `error`) rather than rendering directly, so a page refresh doesn't resubmit anything.

### Data model (Xano/PostgreSQL)

Core tables: `user` (role: admin/client), `treatment`, `treatment_option` (zone-based pricing variants — only `Depilación Láser` uses this), `product`, `appointment`, `cart` (`item_type`: product | appointment_deposit), `order`, `inventory_movement`, `client_file`, `conversation`. Full field-level definitions and design rationale are in [PLANNING.md](PLANNING.md) §5.
