// src/app/cliente/carrito/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCartItemQuantity, type CartItem } from "@/lib/cart";

export default function CarritoPage() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCart()
            .then(setItems)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    async function handleRemove(id: number) {
        await removeFromCart(id);
        setItems((prev) => prev.filter((i) => i.id !== id));
    }

    async function handleQuantityChange(id: number, quantity: number) {
        if (quantity < 1) return;
        const updated = await updateCartItemQuantity(id, quantity);
        setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    }

    const total = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

    if (loading) return <p>Cargando carrito...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <main style={{ padding: 24 }}>
            <h1>Carrito</h1>
            {items.length === 0 && <p>Tu carrito está vacío</p>}

            {items.map((item) => (
                <div
                    key={item.id}
                    style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "center",
                        borderBottom: "1px solid #333",
                        padding: "12px 0",
                    }}
                >
                    <span style={{ minWidth: 200 }}>
                        {item._product?.name ?? `Producto #${item.product_id}`}
                    </span>

                    <label>
                        Cantidad:{" "}
                        <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                            style={{ width: 50 }}
                        />
                    </label>

                    <span>Precio unitario: ${item.unit_price}</span>
                    <span>Stock disponible: {item._product?.stock}</span>

                    <button onClick={() => handleRemove(item.id)}>Eliminar</button>
                </div>
            ))}

            {items.length > 0 && (
                <>
                    <span style={{ marginTop: 24 }}>Subtotal: ${total}</span>
                    <h2 style={{ marginTop: 24 }}>Total: ${total}</h2>
                    <button>Ir a pagar</button>
                </>
            )}
        </main>
    );
}