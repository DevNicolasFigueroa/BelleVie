// Redirección a la pantalla de pago de Webpay.
// Transbank exige que el token viaje por POST, así que armamos un form oculto
// y lo enviamos — no se puede hacer con un simple router.push.

import type { PaymentKind } from "@/lib/buy-order";

interface CreateResponse {
    ok: boolean;
    token?: string;
    url?: string;
    buyOrder?: string;
    error?: string;
}

export function redirectToWebpay(url: string, token: string) {
    const form = document.createElement("form");
    form.action = url;
    form.method = "POST";

    const tokenInput = document.createElement("input");
    tokenInput.type = "hidden";
    tokenInput.name = "token_ws";
    tokenInput.value = token;

    form.appendChild(tokenInput);
    document.body.appendChild(form);
    form.submit();
}

/**
 * Inicia el pago de una orden o del abono de una cita y redirige a Webpay.
 * El monto no se envía: lo determina el servidor leyendo el recurso en Xano.
 * Lanza si la pasarela no pudo iniciarse, para que el caller restaure su UI.
 */
export async function startWebpayPayment(kind: PaymentKind, id: number) {
    const res = await fetch("/api/webpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id }),
    });

    const data: CreateResponse = await res.json();

    if (!data.ok || !data.url || !data.token) {
        throw new Error(data.error || "No se pudo iniciar el pago. Intenta nuevamente.");
    }

    redirectToWebpay(data.url, data.token);
}
