import { NextResponse } from "next/server";
import { webpayTransaction } from "@/lib/webpay";
import { xanoServerFetch } from "@/lib/xano-server";
import { parseBuyOrder, type PaymentKind } from "@/lib/buy-order";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(request: Request) {
    return handleCommit(request);
}

export async function POST(request: Request) {
    return handleCommit(request);
}

// Transbank vuelve por POST (form-urlencoded) o por GET según el caso, así que
// buscamos cada parámetro en ambos lados.
async function readParams(request: Request): Promise<URLSearchParams> {
    const params = new URLSearchParams(new URL(request.url).search);

    if (request.method === "POST") {
        try {
            const formData = await request.formData();
            for (const [key, value] of formData.entries()) {
                if (typeof value === "string" && !params.has(key)) {
                    params.set(key, value);
                }
            }
        } catch {
            // sin form data: nos quedamos con los query params
        }
    }

    return params;
}

// 303 y no el 307 por defecto: 307 preserva el método, así que el navegador
// reintentaría el POST de Transbank contra una página, que responde 405.
function redirectToReceipt(params: Record<string, string>) {
    const query = new URLSearchParams(params).toString();
    return NextResponse.redirect(`${APP_URL}/cliente/pago-confirmado?${query}`, { status: 303 });
}

async function handleCommit(request: Request) {
    const params = await readParams(request);

    const token = params.get("token_ws");
    const tbkToken = params.get("TBK_TOKEN");

    // TBK_TOKEN presente = el usuario anuló el pago en la pantalla de Webpay.
    if (tbkToken || !token) {
        return redirectToReceipt({ status: "cancelled" });
    }

    try {
        // Consultamos el estado antes de confirmar: si el usuario refresca la
        // página de retorno, la transacción ya está autorizada y un segundo
        // commit fallaría.
        let result = await webpayTransaction.status(token);

        if (result.status !== "AUTHORIZED") {
            result = await webpayTransaction.commit(token);
        }

        // response_code 0 = autorizada con éxito
        if (result.response_code !== 0) {
            return redirectToReceipt({ status: "rejected" });
        }

        const buyOrder: string = result.buy_order || "";
        const amount: number = result.amount || 0;
        const authorizationCode: string = result.authorization_code || "";

        const parsed = parseBuyOrder(buyOrder);

        if (!parsed) {
            // Pago cobrado pero no sabemos a qué corresponde: no podemos decirle
            // al usuario que todo salió bien.
            console.error("buyOrder no reconocido tras un pago autorizado:", buyOrder);
            return redirectToReceipt({
                status: "payment_ok_sync_failed",
                buyOrder,
                amount: amount.toString(),
                authorizationCode,
            });
        }

        try {
            await markAsPaid(parsed.kind, parsed.id, { amount, buyOrder, authorizationCode });
        } catch (err) {
            // El cobro se hizo pero Xano no quedó actualizado. Avisamos en vez
            // de mostrar "¡Pago Confirmado!" sobre una reserva que sigue pendiente.
            console.error(`Pago autorizado pero falló la sincronización con Xano (${buyOrder}):`, err);
            return redirectToReceipt({
                status: "payment_ok_sync_failed",
                buyOrder,
                amount: amount.toString(),
                authorizationCode,
            });
        }

        return redirectToReceipt({
            status: "success",
            buyOrder,
            amount: amount.toString(),
            cardLast4: result.card_detail?.card_number || "****",
            authorizationCode,
        });
    } catch (error: any) {
        console.error("Error al confirmar transacción Webpay:", error);
        return redirectToReceipt({ status: "error" });
    }
}

interface PaymentResult {
    amount: number;
    buyOrder: string;
    authorizationCode: string;
}

// Los endpoints internos de Xano validan que el monto coincida con lo esperado
// y son idempotentes, por eso les pasamos el amount que devolvió Transbank.
// Para órdenes de producto, Xano también vacía el carrito, descuenta stock y
// registra el inventory_movement dentro de la misma operación.
async function markAsPaid(kind: PaymentKind, id: number, result: PaymentResult) {
    const endpoint = kind === "order"
        ? `/internal/order/${id}/mark-paid`
        : `/internal/appointment/${id}/mark-paid`;

    await xanoServerFetch(endpoint, {
        method: "POST",
        body: {
            amount: result.amount,
            buy_order: result.buyOrder,
            authorization_code: result.authorizationCode,
        },
    });
}
