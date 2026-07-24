// Formato del identificador de compra que viaja a Transbank y vuelve en el commit.
//
// Formato: {ORD|APPT}-{id}-{nonce}
//   - el id va COMPLETO, nunca truncado: el commit lo usa para saber qué fila
//     de Xano marcar como pagada, y truncarlo hace que se confirme la orden o
//     la cita equivocada.
//   - el nonce existe porque Transbank rechaza buy orders repetidos, y un
//     usuario que reintenta tras un rechazo vuelve sobre el mismo recurso.
//
// Webpay limita buyOrder a 26 caracteres: prefijo (4) + id (hasta 10) +
// nonce base36 (6) + separadores (2) = 22 en el peor caso.

export type PaymentKind = "order" | "appointment";

const PREFIX: Record<PaymentKind, string> = {
    order: "ORD",
    appointment: "APPT",
};

export function buildBuyOrder(kind: PaymentKind, id: number): string {
    const nonce = Math.random().toString(36).slice(2, 8);
    return `${PREFIX[kind]}-${id}-${nonce}`;
}

export function parseBuyOrder(buyOrder: string): { kind: PaymentKind; id: number } | null {
    const [prefix, rawId] = buyOrder.split("-");

    const kind = (Object.keys(PREFIX) as PaymentKind[]).find((k) => PREFIX[k] === prefix);
    if (!kind) return null;

    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) return null;

    return { kind, id };
}
