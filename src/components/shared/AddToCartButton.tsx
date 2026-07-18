// src/components/shared/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProductToCart } from "@/lib/cart";

export function AddToCartButton({ productId, price }: { productId: number; price: number }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleClick() {
        setLoading(true);
        setError(null);
        try {
            await addProductToCart(productId, 1, price);
            router.push("/cliente/carrito");
        } catch (err) {
            // Camino falso: sin sesión u otro error de Xano — se muestra el mensaje sin romper la página
            setError(err instanceof Error ? err.message : "Error al agregar al carrito");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <button onClick={handleClick} disabled={loading}>
                {loading ? "Agregando..." : "Agregar al carrito"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}