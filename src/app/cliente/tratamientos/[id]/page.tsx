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
                    <div className="bg-gradient-to-br from-[#fcf9f8] to-[#e5e2dd] p-10 md:p-14 text-center relative overflow-hidden border-b border-[#d1c5b4]/20">
                        <div className="absolute inset-0 bg-[#c5a059]/5 blur-[80px] rounded-full"></div>
                        <span className="material-symbols-outlined text-[80px] text-[#775a19]/10 absolute top-10 left-10 rotate-12">spa</span>
                        <span className="material-symbols-outlined text-[100px] text-[#775a19]/10 absolute -bottom-10 -right-10 -rotate-12">self_improvement</span>
                        
                        <div className="relative z-10">
                            <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/80 text-[#775a19] border border-[#d1c5b4]/40 inline-block mb-4">
                                Tratamiento Especializado
                            </span>
                            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 leading-tight mb-4">{treatment.name}</h1>
                            <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                                {treatment.description}
                            </p>
                        </div>
                    </div>

                    {/* Contenido Detallado */}
                    <div className="p-8 md:p-12 space-y-12">

                        {/* ¿En qué consiste? & Beneficios */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#fcf9f8] p-8 rounded-3xl border border-[#d1c5b4]/30">
                                <div className="w-12 h-12 bg-[#c5a059]/10 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-2xl text-[#775a19]">info</span>
                                </div>
                                <h2 className="text-xl font-serif text-gray-900 mb-3">¿Qué incluye la sesión?</h2>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    En BelleVie cada sesión está diseñada para brindar máxima eficacia y confort. Se realiza una evaluación previa personalizada, preparación de la piel con productos botánicos y la aplicación del tratamiento especializado.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                                        Evaluación estética profesional
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                                        Tecnología de última generación
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                                        Sellado con serum hidratante premium
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-[#fcf9f8] p-8 rounded-3xl border border-[#d1c5b4]/30">
                                <div className="w-12 h-12 bg-[#c5a059]/10 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-2xl text-[#775a19]">verified</span>
                                </div>
                                <h2 className="text-xl font-serif text-gray-900 mb-3">Beneficios Principales</h2>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    Diseñado para otorgar resultados visibles desde las primeras sesiones, priorizando la salud y regeneración natural de la piel.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#775a19] text-[18px]">auto_awesome</span>
                                        Mejora la textura y luminosidad
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#775a19] text-[18px]">auto_awesome</span>
                                        Procedimiento indoloro y no invasivo
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#775a19] text-[18px]">auto_awesome</span>
                                        Reincorporación inmediata a tu rutina
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Bloque de Agendamiento / Precios */}
                        {!isLaserHairRemoval ? (
                            <div className="bg-[#1a1a1a] text-white p-8 md:p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
                                <div>
                                    <p className="text-xs font-semibold tracking-widest uppercase text-[#c5a059] mb-2">Valor del Tratamiento</p>
                                    <div className="flex items-baseline gap-4">
                                        <p className="text-4xl font-serif text-white">${treatment.base_price.toLocaleString()}</p>
                                        <div className="flex items-center gap-1 text-gray-300 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                                            <span className="text-xs font-semibold">{treatment.duration_min} min</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Abona el 50% al agendar y el resto en la clínica.</p>
                                </div>

                                <Link 
                                    href={`/cliente/agenda?treatment_id=${id}`}
                                    className="w-full md:w-auto px-10 py-4 rounded-xl text-[#1a1a1a] bg-[#c5a059] hover:bg-[#d1ab64] font-semibold tracking-wide transition-all duration-300 shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                                    Agendar Cita Ahora
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-white border border-[#d1c5b4]/40 rounded-3xl p-8 shadow-sm">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-serif text-gray-900 mb-2">Selecciona la zona a tratar</h2>
                                    <p className="text-gray-500 font-light text-sm">Los tiempos y valores varían según el área seleccionada.</p>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {options.map((opt) => (
                                        <div key={opt.id} className="group relative flex flex-col justify-between bg-[#fcf9f8] border border-[#d1c5b4]/40 hover:border-[#775a19]/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-md">
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
                                                    className="px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 border border-[#775a19] text-[#775a19] hover:bg-[#775a19] hover:text-white flex items-center gap-1"
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