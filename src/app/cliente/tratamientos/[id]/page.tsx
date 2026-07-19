import { xanoFetch } from "@/lib/xano";
import type { Treatment, TreatmentOption } from "@/types";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default async function TratamientoDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const treatment = await xanoFetch<Treatment>(`/treatment/${id}`);

    const isLaserHairRemoval = treatment.name.toLowerCase().includes("depilación láser");
    const options = isLaserHairRemoval
        ? await xanoFetch<TreatmentOption[]>(`/treatment_option?treatment_id=${id}`).catch(() => [])
        : [];

    const colors = {
        primary: "#775a19",
        surface: "#fcf9f8",
    };

    return (
        <div style={{ backgroundColor: colors.surface, minHeight: "100vh" }} className="text-gray-900 font-sans selection:bg-amber-100">
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-6 py-12">
                <Link href="/cliente/tratamientos" className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-gray-500 hover:text-[#775a19] transition-colors mb-12">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Volver a Tratamientos
                </Link>

                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(197,160,89,0.1)] border border-[#d1c5b4]/20">
                    
                    {/* Header del Tratamiento */}
                    <div className="bg-gradient-to-br from-[#fcf9f8] to-[#e5e2dd] p-12 md:p-16 text-center relative overflow-hidden border-b border-[#d1c5b4]/20">
                        <div className="absolute inset-0 bg-[#c5a059]/5 blur-[80px] rounded-full"></div>
                        <span className="material-symbols-outlined text-[80px] text-[#775a19]/20 absolute top-10 left-10 rotate-12">spa</span>
                        <span className="material-symbols-outlined text-[100px] text-[#775a19]/10 absolute -bottom-10 -right-10 -rotate-12">self_improvement</span>
                        
                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-6">{treatment.name}</h1>
                            <p className="text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                                {treatment.description}
                            </p>
                        </div>
                    </div>

                    {/* Contenido / Opciones */}
                    <div className="p-8 md:p-12">
                        {!isLaserHairRemoval ? (
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-[#fcf9f8] p-8 rounded-3xl border border-[#d1c5b4]/30">
                                <div className="text-center md:text-left">
                                    <p className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-2">Valor de Inversión</p>
                                    <div className="flex items-baseline gap-4 justify-center md:justify-start">
                                        <p className="text-4xl font-serif text-[#775a19]">${treatment.base_price.toLocaleString()}</p>
                                        <div className="flex items-center gap-1 text-gray-500 bg-white px-3 py-1 rounded-full border border-[#d1c5b4]/40 shadow-sm">
                                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                                            <span className="text-xs font-semibold">{treatment.duration_min} min</span>
                                        </div>
                                    </div>
                                </div>

                                <Link 
                                    href={`/cliente/agenda?treatment_id=${id}`}
                                    className="w-full md:w-auto px-10 py-4 rounded-xl text-white font-semibold tracking-wide transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(119,90,25,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(119,90,25,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2 bg-[#775a19]"
                                >
                                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                    Agendar Cita
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <div className="text-center mb-10">
                                    <h2 className="text-2xl font-serif text-gray-900 mb-2">Selecciona la zona a tratar</h2>
                                    <p className="text-gray-500 font-light text-sm">Los tiempos y valores varían según el área seleccionada.</p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {options.map((opt) => (
                                        <div key={opt.id} className="group relative flex flex-col justify-between bg-white border border-[#d1c5b4]/40 hover:border-[#775a19]/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-md">
                                            <div className="mb-6">
                                                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#775a19] transition-colors">{opt.zone_name}</h3>
                                                <div className="flex items-center gap-1 text-gray-500 mt-2">
                                                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                                                    <span className="text-xs font-medium">{opt.duration_min} min</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-end justify-between mt-auto">
                                                <p className="text-2xl font-serif text-[#775a19]">${opt.price.toLocaleString()}</p>
                                                
                                                <Link 
                                                    href={`/cliente/agenda?treatment_id=${id}&option_id=${opt.id}`}
                                                    className="px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 border border-[#d1c5b4] hover:border-[#775a19] text-[#775a19] bg-white/50 hover:bg-[#775a19] hover:text-white flex items-center gap-1"
                                                >
                                                    Agendar
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}