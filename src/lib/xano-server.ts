// Cliente de Xano para llamadas server-to-server que el usuario no puede originar
// (confirmación de pago). Se autentica con un secreto compartido en vez del JWT
// del cliente, porque el commit de Webpay llega desde Transbank, sin sesión.
//
// Solo se importa desde Route Handlers — XANO_INTERNAL_SECRET no lleva prefijo
// NEXT_PUBLIC_ y no debe llegar al navegador.
// Para lecturas normales usar xanoFetch de ./xano.

const XANO_BASE_URL = process.env.NEXT_PUBLIC_XANO_BASE_URL as string;
const INTERNAL_SECRET = process.env.XANO_INTERNAL_SECRET as string;

interface XanoServerRequestOptions {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
}

export async function xanoServerFetch<T>(
    endpoint: string,
    options: XanoServerRequestOptions = {}
): Promise<T> {
    if (!INTERNAL_SECRET) {
        throw new Error(
            "XANO_INTERNAL_SECRET no está configurado. Los endpoints internos de " +
            "confirmación de pago no pueden autenticarse."
        );
    }

    const { method = "GET", body } = options;

    const res = await fetch(`${XANO_BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            "X-Internal-Secret": INTERNAL_SECRET,
        },
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Error Xano interno [${res.status}]: ${await res.text()}`);
    }

    return res.json() as Promise<T>;
}
