"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
export default function Home() {
  const colors = {
    primary: "#775a19",
    primaryContainer: "#c5a059",
    surface: "#fcf9f8",
    surfaceLowest: "#ffffff",
    secondary: "#5f5e5b",
    secondaryContainer: "#e5e2dd",
    outlineVariant: "#d1c5b4",
    onPrimary: "#ffffff"
  };

  return (
    <div style={{ backgroundColor: colors.surface, minHeight: "100vh" }} className="text-gray-900 selection:bg-amber-100 font-sans">
      
      <Navbar />

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#c5a059]/10 text-[#775a19] text-xs font-bold tracking-widest uppercase mb-4 border border-[#c5a059]/20">
              Kinesiología Estética Avanzada
            </div>
            <h1 className="text-5xl md:text-7xl font-serif leading-[1.1] text-gray-900 tracking-tight">
              Revela tu <br />
              <span className="italic text-[#775a19]">mejor versión.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed font-light">
              Descubre tratamientos personalizados y productos de alta gama diseñados para resaltar tu belleza natural en un ambiente de calma y profesionalismo absoluto.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/cliente/agenda"
                className="px-8 py-4 rounded-full text-white font-semibold tracking-wide text-center transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(119,90,25,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(119,90,25,0.5)] hover:-translate-y-0.5"
                style={{ backgroundColor: colors.primary }}
              >
                Agendar Evaluación
              </Link>
              <Link 
                href="/cliente/tratamientos"
                className="px-8 py-4 rounded-full font-semibold tracking-wide text-center transition-all duration-300 border border-[#d1c5b4] hover:border-[#775a19] text-[#775a19] bg-white/50 hover:bg-white"
              >
                Explorar Tratamientos
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#fcf9f8] to-transparent z-10"></div>
            {/* Ambient shadow glow behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#c5a059]/20 blur-[100px] rounded-full z-0"></div>
            
            {/* Image Placeholder representing the clinic/treatment */}
            <div className="relative z-0 rounded-[2rem] overflow-hidden aspect-[4/5] shadow-2xl border border-white/40 bg-[#e5e2dd] flex items-center justify-center">
               {/* As we don't have a real image asset, we use a beautiful subtle gradient/pattern placeholder with an icon */}
               <div className="absolute inset-0 bg-gradient-to-b from-[#e5e2dd] to-[#d1c5b4] opacity-50"></div>
               <span className="material-symbols-outlined text-[120px] text-white/80 font-light relative z-10 drop-shadow-md">
                 spa
               </span>
               <p className="absolute bottom-10 left-0 right-0 text-center text-white/90 font-serif text-2xl tracking-wide italic z-10 drop-shadow-md">
                 Experiencia BelleVie
               </p>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
