"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

const treatmentsCarousel = [
  {
    id: 1,
    title: "Laserlipólisis",
    subtitle: "Remodelación corporal avanzada no invasiva",
    description: "Técnica de vanguardia para reducir medidas y definir el contorno corporal mediante luz láser.",
    image: "/tratamientos/laserlipolisis.jpg",
    link: "/cliente/tratamientos/1",
  },
  {
    id: 2,
    title: "Cavitación",
    subtitle: "Ultrasonido de baja frecuencia",
    description: "Destruye depósitos de grasa localizada convirtiéndola en líquido para su eliminación natural.",
    image: "/tratamientos/cavitacion.jpg",
    link: "/cliente/tratamientos/2",
  },
  {
    id: 3,
    title: "Facial con Radiofrecuencia",
    subtitle: "Efecto lifting y regeneración celular",
    description: "Estimula la producción de colágeno y elastina devolviendo firmeza y juventud al rostro.",
    image: "/tratamientos/facialconradiofrecuencia.jpg",
    link: "/cliente/tratamientos/3",
  },
  {
    id: 4,
    title: "Depilación Láser",
    subtitle: "Tecnología de última generación",
    description: "Eliminación progresiva y duradera del vello corporal con máxima precisión y confort.",
    image: "/tratamientos/depilacionlaser.jpg",
    link: "/cliente/tratamientos/4",
  },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play cada 4 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % treatmentsCarousel.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? treatmentsCarousel.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % treatmentsCarousel.length);
  };

  const currentItem = treatmentsCarousel[currentIndex];

  const colors = {
    primary: "#775a19",
    surface: "#fcf9f8",
  };

  return (
    <div style={{ backgroundColor: colors.surface, minHeight: "100vh" }} className="text-gray-900 selection:bg-amber-100 font-sans">
      
      <Navbar />

      <main className="pb-24">
        
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-20 flex flex-col md:flex-row items-center gap-12 md:gap-16">
          
          {/* Texto Principal */}
          <div className="flex-1 space-y-8 z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#c5a059]/10 text-[#775a19] text-xs font-bold tracking-widest uppercase mb-2 border border-[#c5a059]/20">
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
                Agendar Cita
              </Link>
              <Link 
                href="/cliente/tratamientos"
                className="px-8 py-4 rounded-full font-semibold tracking-wide text-center transition-all duration-300 border border-[#d1c5b4] hover:border-[#775a19] text-[#775a19] bg-white/50 hover:bg-white"
              >
                Ver Catálogo
              </Link>
            </div>
          </div>
          
          {/* Carrusel de Tratamientos en el Hero */}
          <div className="flex-1 w-full max-w-lg md:max-w-none">
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl border border-white/60 group bg-gray-950">
              
              {/* Imagen del Slide Activo */}
              <img 
                src={currentItem.image} 
                alt={currentItem.title}
                className="w-full h-full object-cover opacity-75 transition-all duration-700 scale-100 group-hover:scale-105"
              />
              
              {/* Overlay en degradé */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
              
              {/* Información del Slide */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white z-10">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#c5a059] block mb-2">
                  Tratamiento Destacado {currentIndex + 1} / {treatmentsCarousel.length}
                </span>
                <h3 className="text-3xl font-serif mb-2 text-white">{currentItem.title}</h3>
                <p className="text-sm text-gray-200 font-light mb-6 line-clamp-2">{currentItem.subtitle}</p>
                
                <Link 
                  href={currentItem.link}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md border border-white/30 text-sm font-semibold transition-all duration-300"
                >
                  Ver Tratamiento
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Botones de Navegación del Carrusel */}
              <div className="absolute top-6 right-6 flex gap-2 z-20">
                <button 
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-colors border border-white/30 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button 
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-colors border border-white/30 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>

              {/* Indicadores en Barra */}
              <div className="absolute bottom-4 left-8 right-8 flex gap-2 justify-center z-20">
                {treatmentsCarousel.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-[#c5a059]' : 'w-2 bg-white/40'}`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* Sección de Galería / Carrusel Secundario Horizontal */}
        <div className="max-w-7xl mx-auto px-6 pt-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-[#775a19] mb-1">Nuestros Servicios</p>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900">Galería de Tratamientos</h2>
            </div>
            <Link href="/cliente/tratamientos" className="text-sm font-semibold text-[#775a19] hover:underline flex items-center gap-1">
              Ver todos <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatmentsCarousel.map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`cursor-pointer group relative rounded-2xl overflow-hidden bg-white border transition-all duration-300 ${idx === currentIndex ? 'border-[#775a19] ring-2 ring-[#775a19]/20 shadow-lg' : 'border-[#d1c5b4]/30 hover:border-[#775a19]/50'}`}
              >
                <div className="h-44 relative overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent"></div>
                </div>
                <div className="p-4">
                  <h4 className="font-serif text-lg text-gray-900 group-hover:text-[#775a19] transition-colors">{item.title}</h4>
                  <p className="text-xs text-gray-500 font-light mt-1 line-clamp-1">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
