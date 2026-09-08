// Cliente del carrito — requiere sesión activa (usa el token de auth.ts).

import { getToken } from "@/lib/auth";
import type { Product } from "@/types";

const XANO_BASE_URL = process.env.NEXT_PUBLIC_XANO_BASE_URL as string;

export interface CartItem {
    id: number;
    item_type: "product" | "appointment_deposit";
    product_id: number | null;
    appointment_id: number | null;
    quantity: number;
    unit_price: number;
    _product?: Product;
    appointment_treatment_name?: string | null;
    appointment_date?: string | null;
    appointment_time?: string | null;
}

async function authFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    if (!token) throw new Error("Debes iniciar sesión para usar el carrito");

    const res = await fetch(`${XANO_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    if (!res.ok) throw new Error(`Error carrito [${res.status}]: ${await res.text()}`);
    return res.json() as Promise<T>;
}

export async function getCart(): Promise<CartItem[]> {
    return authFetch<CartItem[]>("/cart");
}

export async function addProductToCart(productId: number, quantity: number, unitPrice: number): Promise<CartItem> {
    return authFetch<CartItem>("/cart", {
        method: "POST",
        body: JSON.stringify({
            item_type: "product",
            product_id: productId,
            quantity,
            unit_price: unitPrice,
        }),
    });
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartItem> {
    return authFetch<CartItem>(`/cart/${cartItemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
    });
}

export async function removeFromCart(cartItemId: number): Promise<void> {
    await authFetch<void>(`/cart/${cartItemId}`, { method: "DELETE" });
}

export async function addAppointmentToCart(appointmentId: number, depositAmount: number): Promise<CartItem> {
    return authFetch<CartItem>("/cart", {
        method: "POST",
        body: JSON.stringify({
            item_type: "appointment_deposit",
            appointment_id: appointmentId,
            quantity: 1,
            unit_price: depositAmount,
        }),
    });
}

export interface OrderResponse {
    id: number;
    [key: string]: unknown;
}

export async function createOrder(items: CartItem[], total: number): Promise<OrderResponse> {
    return authFetch<OrderResponse>("/order", {
        method: "POST",
        body: JSON.stringify({
            type: "product",
            items,
            total,
            payment_status: "pending"
        })
    });
}