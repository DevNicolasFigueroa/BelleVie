"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/auth";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signup(name, email, password, phone);
            router.push("/"); // redireccionar al home después de registro exitoso
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al registrarse");
        } finally {
            setLoading(false);
        }
    }

    const colors = {
        primary: "#775a19",
        surface: "#fcf9f8",
        surfaceLowest: "#ffffff",
        outlineVariant: "#d1c5b4",
    };

    return (
        <main style={{ backgroundColor: colors.surface }} className="min-h-screen flex items-center justify-center p-6 selection:bg-amber-100 font-sans">
            
            <div className="absolute top-8 left-8">
                <Link href="/" className="text-2xl font-serif tracking-tight flex items-center gap-2 hover:opacity-70 transition-opacity" style={{ color: colors.primary }}>
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    BelleVie
                </Link>
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl p-10 md:p-12 shadow-[0_20px_40px_-15px_rgba(197,160,89,0.15)] border border-[#d1c5b4]/20 relative overflow-hidden my-12">
                
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c5a059]/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="text-center mb-10 relative z-10">
                    <h1 className="text-3xl font-serif text-gray-900 mb-2 tracking-tight">Crear Cuenta</h1>
                    <p className="text-gray-500 font-light text-sm">Únete a BelleVie y agenda tu primera cita.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-widest uppercase text-gray-500 ml-1">Nombre Completo</label>
                        <input
                            type="text"
                            placeholder="Tu nombre"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-[#f6f3f2] border border-transparent focus:border-[#c5a059] focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-widest uppercase text-gray-500 ml-1">Correo Electrónico</label>
                        <input
                            type="email"
                            placeholder="tu@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[#f6f3f2] border border-transparent focus:border-[#c5a059] focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-widest uppercase text-gray-500 ml-1">Teléfono</label>
                        <input
                            type="tel"
                            placeholder="+56 9 1234 5678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full bg-[#f6f3f2] border border-transparent focus:border-[#c5a059] focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold tracking-widest uppercase text-gray-500 ml-1">Contraseña</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full bg-[#f6f3f2] border border-transparent focus:border-[#c5a059] focus:bg-white px-5 py-3.5 rounded-xl outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 rounded-xl text-white font-semibold tracking-wide transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(119,90,25,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(119,90,25,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                            style={{ backgroundColor: colors.primary }}
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                    Creando cuenta...
                                </>
                            ) : "Registrarme"}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center relative z-10">
                    <p className="text-sm text-gray-500">
                        ¿Ya tienes cuenta?{' '}
                        <Link href="/cliente/login" className="text-[#775a19] font-semibold hover:underline">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}