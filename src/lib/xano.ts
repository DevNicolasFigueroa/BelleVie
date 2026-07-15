// Cliente base para consumir la API de Xano.
// Todo fetch a Xano debe pasar por acá — nunca llamar la URL directo desde componentes.

const XANO_BASE_URL = process.env.NEXT_PUBLIC_XANO_BASE_URL as string;

interface XanoRequestOptions {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string; // JWT del usuario autenticado, si aplica
}

export async function xanoFetch<T>(
    endpoint: string,
    options: XanoRequestOptions = {}
): Promise<T> {
    const { method = "GET", body, token } = options;

    const res = await fetch(`${XANO_BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        throw new Error(`Error Xano [${res.status}]: ${await res.text()}`);
    }

    return res.json() as Promise<T>;
}