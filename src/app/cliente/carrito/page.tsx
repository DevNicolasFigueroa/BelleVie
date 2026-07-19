"use client";

import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCartItemQuantity, type CartItem } from "@/lib/cart";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

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

    const subtotal = items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
    const taxes = 0; // Ajustar si es necesario
    const total = subtotal + taxes;

    const colors = {
        primary: "#775a19",
        surface: "#fcf9f8",
    };

    return (
        <div style={{ backgroundColor: colors.surface, minHeight: "100vh" }} className="text-gray-900 font-sans selection:bg-amber-100">
            <Navbar />
            
            <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
                
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight">Tu Carrito</h1>
                    <p className="text-gray-500 font-light mt-3">
                        Revisa los productos seleccionados antes de proceder al pago seguro.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <span className="material-symbols-outlined animate-spin text-[40px] text-[#c5a059] mb-4">progress_activity</span>
                        <p className="text-gray-500">Cargando tu carrito...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
                        <span className="material-symbols-outlined text-3xl mb-2">error</span>
                        <p>{error}</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border border-[#d1c5b4]/30 shadow-[0_10px_30px_-15px_rgba(197,160,89,0.1)] text-center py-24 flex flex-col items-center">
                        <div className="w-24 h-24 bg-[#fcf9f8] rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-[48px] text-[#d1c5b4]">local_mall</span>
                        </div>
                        <h2 className="text-2xl font-serif text-gray-800 mb-3">Tu carrito está vacío</h2>
                        <p className="text-gray-500 mb-8 max-w-md">Descubre nuestra exclusiva colección de tratamientos y productos de cuidado personal.</p>
                        <div className="flex gap-4">
                            <Link href="/cliente/tratamientos" className="px-6 py-3 rounded-xl border border-[#d1c5b4] text-[#775a19] hover:border-[#775a19] transition-colors font-medium text-sm">
                                Ver Tratamientos
                            </Link>
                            <Link href="/cliente/productos" className="px-6 py-3 rounded-xl bg-[#1a1a1a] text-white hover:opacity-90 transition-opacity font-medium text-sm">
                                Ir a la Tienda
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-10">
                        
                        {/* Lista de Productos (Izquierda) */}
                        <div className="w-full lg:w-2/3 space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 border border-[#d1c5b4]/30 shadow-[0_10px_30px_-15px_rgba(197,160,89,0.05)] transition-all hover:border-[#d1c5b4]/60">
                                    
                                    {/* Imagen Placeholder */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#fcf9f8] rounded-2xl flex-shrink-0 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[40px] text-[#d1c5b4]">
                                            {item._product?.name?.toLowerCase().includes("láser") ? "spa" : "lotion"}
                                        </span>
                                    </div>
                                    
                                    {/* Info del Producto */}
                                    <div className="flex-1 flex flex-col justify-between self-stretch">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-serif text-gray-900 mb-1 leading-snug">
                                                    {item._product?.name ?? `Producto #${item.product_id}`}
                                                </h3>
                                                <p className="text-sm font-semibold tracking-widest uppercase text-[#c5a059] mb-4">
                                                    ${item.unit_price.toLocaleString()}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => handleRemove(item.id)}
                                                className="w-10 h-10 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between mt-auto">
                                            {/* Selector de cantidad elegante */}
                                            <div className="flex items-center bg-[#fcf9f8] rounded-xl border border-[#e5e2dd]">
                                                <button 
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">remove</span>
                                                </button>
                                                <div className="w-10 h-10 flex items-center justify-center font-medium text-gray-800 text-sm">
                                                    {item.quantity}
                                                </div>
                                                <button 
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                                </button>
                                            </div>
                                            
                                            <p className="font-serif text-xl text-gray-900">
                                                ${(item.unit_price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary (Derecha) */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white rounded-3xl p-8 border border-[#d1c5b4]/30 shadow-[0_20px_40px_-15px_rgba(197,160,89,0.1)] sticky top-32">
                                <h3 className="text-2xl font-serif text-gray-900 mb-6">Resumen</h3>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-gray-600">
                                        <p>Subtotal</p>
                                        <p>${subtotal.toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-600">
                                        <p>Envío / Cargos</p>
                                        <p>Calculado al final</p>
                                    </div>
                                    <div className="pt-4 border-t border-[#fcf9f8] flex justify-between items-center">
                                        <p className="font-serif text-xl text-gray-900">Total Estimado</p>
                                        <p className="font-serif text-3xl text-[#775a19]">${total.toLocaleString()}</p>
                                    </div>
                                </div>
                                
                                <button className="w-full py-4 rounded-xl text-white font-semibold tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 bg-[#1a1a1a]">
                                    Ir a Pagar
                                    <span className="material-symbols-outlined text-[18px]">lock</span>
                                </button>
                                
                                <p className="text-xs text-center text-gray-400 mt-6 flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">verified_user</span>
                                    Pago seguro procesado mediante Transbank
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
}