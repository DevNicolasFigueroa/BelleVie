import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { webpayTransaction } from "@/lib/webpay";
import { buildBuyOrder, type PaymentKind } from "@/lib/buy-order";
import type { Appointment, Order } from "@/types";

const XANO_BASE_URL = process.env.NEXT_PUBLIC_XANO_BASE_URL as string;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// El body solo trae qué se está pagando, nunca cuánto: el monto se lee desde
// Xano con el token del usuario. Si el cliente pudiera aportar el monto,
// bastaría un curl con amount:1 para pagar una orden de $200.000.
interface CreateBody {
    kind: PaymentKind;
    id: number;
}

export async function POST(request: Request) {
    try {
        const { kind, id }: CreateBody = await request.json();

        if (kind !== "order" && kind !== "appointment") {
            return NextResponse.json({ ok: false, error: "Tipo de pago inválido" }, { status: 400 });
        }
        if (!Number.isInteger(id) || id <= 0) {
            return NextResponse.json({ ok: false, error: "Identificador inválido" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("bellevie_auth_token")?.value;

        if (!token) {
            return NextResponse.json({ ok: false, error: "Debes iniciar sesión para pagar" }, { status: 401 });
        }

        // Leemos el recurso con el token del usuario: de paso Xano valida que
        // le pertenece, así que nadie puede iniciar el pago de una orden ajena.
        const endpoint = kind === "order" ? `/order/${id}` : `/appointment/${id}`;
        const res = await fetch(`${XANO_BASE_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });

        if (res.status === 401 || res.status === 403) {
            return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 403 });
        }
        if (!res.ok) {
            return NextResponse.json({ ok: false, error: "No se encontró la compra" }, { status: 404 });
        }

        const resource = await res.json();

        // Ya pagado: no volvemos a cobrar.
        const alreadyPaid = kind === "order"
            ? (resource as Order).payment_status === "paid"
            : (resource as Appointment).deposit_status === "paid";

        if (alreadyPaid) {
            return NextResponse.json({ ok: false, error: "Esta compra ya fue pagada" }, { status: 409 });
        }

        // El monto sale del backend, no del navegador.
        const amount = Math.round(
            kind === "order"
                ? (resource as Order).total
                : (resource as Appointment).deposit_amount
        );

        if (!amount || amount <= 0) {
            return NextResponse.json({ ok: false, error: "Monto inválido" }, { status: 400 });
        }

        const buyOrder = buildBuyOrder(kind, id);
        const sessionId = `S-${Date.now()}`;

        // URL de retorno desde config, no desde el header Origin — ese lo
        // controla quien hace la request.
        const returnUrl = `${APP_URL}/api/webpay/commit`;

        const response = await webpayTransaction.create(buyOrder, sessionId, amount, returnUrl);

        return NextResponse.json({
            ok: true,
            token: response.token,
            url: response.url,
            buyOrder,
        });
    } catch (error: any) {
        console.error("Error al iniciar Webpay:", error);
        return NextResponse.json({ ok: false, error: "Error al iniciar el pago" }, { status: 500 });
    }
}
