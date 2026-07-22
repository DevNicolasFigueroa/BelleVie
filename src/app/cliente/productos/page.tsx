import { xanoFetch } from "@/lib/xano";
import type { Product } from "@/types";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default async function ProductosPage() {
    const products = await xanoFetch<Product[]>("/product").catch(() => []);

    const colors = {
        primary: "#775a19",
        surface: "#fcf9f8",
    };

    return (
        <div style={{ backgroundColor: colors.surface, minHeight: "100vh" }} className="text-gray-900 font-sans selection:bg-amber-100">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-6 py-16">
                
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">Tienda Exclusiva</h1>
                    <p className="text-gray-500 font-light max-w-2xl text-lg">
                        Cuida tu piel con los productos profesionales que utilizamos en clínica. Fórmulas avanzadas para resultados visibles.
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-[#d1c5b4]/30 shadow-sm">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">inventory_2</span>
                        <h2 className="text-xl font-serif text-gray-700">Catálogo vacío</h2>
                        <p className="text-gray-500 mt-2">Pronto añadiremos nuevos productos a nuestra tienda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((p) => (
                            <Link href={`/cliente/productos/${p.id}`} key={p.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#d1c5b4]/30 shadow-[0_10px_30px_-15px_rgba(197,160,89,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(197,160,89,0.2)] transition-all duration-500 hover:-translate-y-1">
                                
                                {/* Imagen del producto */}
                                <div className="aspect-square bg-[#f6f3f2] relative overflow-hidden">
                                    <img 
                                        src={(() => {
                                            const n = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                            if (n.includes("crema") || n.includes("noche") || n.includes("antiage")) return "/productos/crema.png";
                                            if (n.includes("serum") || n.includes("acido") || n.includes("hialuronico")) return "/productos/serum.png";
                                            if (n.includes("protector") || n.includes("solar") || n.includes("spf")) return "/productos/protector.png";
                                            return "/productos/serum.png";
                                        })()}
                                        alt={p.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                
                                {/* Información del producto */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="mb-4 flex-1">
                                        <h2 className="text-lg font-serif text-gray-900 leading-snug group-hover:text-[#775a19] transition-colors line-clamp-2">
                                            {p.name}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-2 line-clamp-2 font-light">
                                            {p.description}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-[#f6f3f2]">
                                        <div>
                                            <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-1">Precio</p>
                                            <p className="text-xl font-serif text-[#775a19]">${p.price.toLocaleString()}</p>
                                        </div>
                                        
                                        <div className="text-right">
                                            {p.stock > 0 ? (
                                                <span className="text-[11px] font-semibold tracking-widest uppercase text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                                    Stock: {p.stock}
                                                </span>
                                            ) : (
                                                <span className="text-[11px] font-semibold tracking-widest uppercase text-red-500 bg-red-50 px-2 py-1 rounded-md">
                                                    Agotado
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}