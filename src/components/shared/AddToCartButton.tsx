// src/components/shared/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addProductToCart } from "@/lib/cart";

export function AddToCartButton({ productId, price, disabled = false }: { productId: number; price: number; disabled?: boolean }) {
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
            setError(err instanceof Error ? err.message : "Error al agregar al carrito");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full">
            <button 
                onClick={handleClick} 
                disabled={loading || disabled}
                className="w-full py-4 rounded-xl text-white font-semibold tracking-wide transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(119,90,25,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(119,90,25,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none disabled:hover:-translate-y-0 bg-[#775a19]"
            >
                {loading ? (
                    <>
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                        Agregando...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                        {disabled ? "Agotado" : "Agregar al Carrito"}
                    </>
                )}
            </button>
            {error && (
                <p className="mt-3 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-3">
                    {error}
                </p>
            )}
        </div>
    );
}