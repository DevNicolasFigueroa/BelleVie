import { AddToCartButton } from "@/components/shared/AddToCartButton";
import { xanoFetch } from "@/lib/xano";
import type { Product } from "@/types";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";

export default async function ProductoDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await xanoFetch<Product>(`/product/${id}`);

    const colors = {
        primary: "#775a19",
        surface: "#fcf9f8",
    };

    return (
        <div style={{ backgroundColor: colors.surface, minHeight: "100vh" }} className="text-gray-900 font-sans selection:bg-amber-100">
            <Navbar />
            
            <main className="max-w-6xl mx-auto px-6 py-12">
                <Link href="/cliente/productos" className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-gray-500 hover:text-[#775a19] transition-colors mb-12">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Volver a Tienda
                </Link>

                <div className="bg-white rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(197,160,89,0.1)] border border-[#d1c5b4]/20 flex flex-col md:flex-row">
                    
                    {/* Sección de Imagen */}
                    <div className="md:w-1/2 bg-[#f6f3f2] relative overflow-hidden min-h-[400px]">
                        <Image 
                            src={(() => {
                                const n = product.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                if (n.includes("crema") || n.includes("noche") || n.includes("antiage")) return "/productos/crema.png";
                                if (n.includes("serum") || n.includes("acido") || n.includes("hialuronico")) return "/productos/serum.png";
                                if (n.includes("protector") || n.includes("solar") || n.includes("spf")) return "/productos/protector.png";
                                return "/productos/serum.png";
                            })()}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute top-6 left-6 z-10">
                            {product.stock > 0 ? (
                                <span className="text-xs font-semibold tracking-widest uppercase text-[#775a19] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#c5a059]/20 shadow-sm">
                                    En Stock ({product.stock})
                                </span>
                            ) : (
                                <span className="text-xs font-semibold tracking-widest uppercase text-red-600 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-100 shadow-sm">
                                    Agotado
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Sección de Información */}
                    <div className="md:w-1/2 p-10 md:p-14 flex flex-col justify-center">
                        <div className="mb-8">
                            <h1 className="text-4xl font-serif text-gray-900 leading-tight mb-4">{product.name}</h1>
                            <p className="text-lg text-gray-500 font-light leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                        
                        <div className="mb-10">
                            <p className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-1">Precio Unitario</p>
                            <p className="text-4xl font-serif text-[#775a19]">${product.price.toLocaleString()}</p>
                        </div>

                        <div className="mt-auto pt-8 border-t border-[#f6f3f2]">
                            <AddToCartButton productId={product.id} price={product.price} disabled={product.stock <= 0} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}