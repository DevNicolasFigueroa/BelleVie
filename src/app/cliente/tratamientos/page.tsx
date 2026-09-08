import { xanoFetch } from "@/lib/xano";
import type { Treatment } from "@/types";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";

export default async function TratamientosPage() {
    const treatments = await xanoFetch<Treatment[]>("/treatment").catch(() => []);

    const colors = {
        primary: "#775a19",
        surface: "#fcf9f8",
    };

    return (
        <div style={{ backgroundColor: colors.surface, minHeight: "100vh" }} className="text-gray-900 font-sans selection:bg-amber-100">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-6 py-16">
                
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 tracking-tight">Nuestros Tratamientos</h1>
                    <p className="text-gray-500 font-light max-w-2xl text-lg">
                        Descubre procedimientos de vanguardia diseñados para realzar tu belleza natural con resultados excepcionales.
                    </p>
                </div>

                {treatments.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-[#d1c5b4]/30 shadow-sm">
                        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">spa</span>
                        <h2 className="text-xl font-serif text-gray-700">Catálogo vacío</h2>
                        <p className="text-gray-500 mt-2">Pronto añadiremos nuevos tratamientos.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {treatments.map((t) => (
                            <Link href={`/cliente/tratamientos/${t.id}`} key={t.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#d1c5b4]/30 shadow-[0_10px_30px_-15px_rgba(197,160,89,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(197,160,89,0.2)] transition-all duration-500 hover:-translate-y-1">
                                
                                {/* Imagen del tratamiento */}
                                <div className="h-56 relative overflow-hidden bg-[#f6f3f2]">
                                    <Image 
                                        src={(() => {
                                            const n = t.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                            if (n.includes("cavitacion")) return "/tratamientos/cavitacion.jpg";
                                            if (n.includes("laserlipolisis") || n.includes("lipolisis")) return "/tratamientos/laserlipolisis.jpg";
                                            if (n.includes("facial") || n.includes("radiofrecuencia")) return "/tratamientos/facialconradiofrecuencia.jpg";
                                            if (n.includes("laser") || n.includes("depilacion")) return "/tratamientos/depilacionlaser.jpg";
                                            return "/tratamientos/cavitacion.jpg";
                                        })()} 
                                        alt={t.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                                </div>
                                
                                {/* Información del tratamiento */}
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="mb-6 flex-1">
                                        <h2 className="text-2xl font-serif text-gray-900 leading-tight group-hover:text-[#775a19] transition-colors mb-3">
                                            {t.name}
                                        </h2>
                                        <p className="text-gray-500 font-light leading-relaxed line-clamp-3">
                                            {t.description}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-end justify-between mt-auto pt-6 border-t border-[#f6f3f2]">
                                        <div>
                                            <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 mb-1">Precio desde</p>
                                            <p className="text-xl font-serif text-[#775a19]">${t.base_price.toLocaleString()}</p>
                                        </div>
                                        
                                        <div className="text-right flex items-center gap-1 text-gray-500">
                                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                                            <span className="text-sm font-medium">{t.duration_min} min</span>
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