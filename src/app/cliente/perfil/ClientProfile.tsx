"use client";

import React from "react";
import Navbar from "@/components/shared/Navbar";
import { User } from "@/types";
import Link from "next/link";

interface ClientProfileProps {
  user: User;
  appointments: any[];
}

export default function ClientProfile({ user, appointments }: ClientProfileProps) {
  const colors = {
    primary: "#775a19",
    surface: "#fcf9f8",
  };

  return (
    <div style={{ backgroundColor: colors.surface, minHeight: "100vh" }} className="text-gray-900 font-sans selection:bg-amber-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-serif text-gray-900 tracking-tight">Mi Perfil</h1>
          <p className="text-gray-500 font-light mt-2">Bienvenido de vuelta, {user.name}. Aquí puedes gestionar tus citas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Tarjeta de Información de Usuario */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-[#d1c5b4]/30 shadow-[0_10px_30px_-15px_rgba(197,160,89,0.1)]">
              <div className="w-20 h-20 bg-[#c5a059]/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-[#775a19]">person</span>
              </div>
              <h2 className="text-xl font-serif text-gray-800 mb-6">Tus Datos</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">Nombre</p>
                  <p className="text-gray-800">{user.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">Email</p>
                  <p className="text-gray-800 break-all">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">Teléfono</p>
                  <p className="text-gray-800">{user.phone || "No registrado"}</p>
                </div>
              </div>
            </div>
            
            <Link 
              href="/cliente/tratamientos"
              className="w-full py-4 rounded-xl text-[#775a19] font-semibold tracking-wide transition-all border border-[#d1c5b4] hover:border-[#775a19] bg-white hover:bg-[#fcf9f8] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              Agendar Nueva Cita
            </Link>
          </div>

          {/* Historial de Citas */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-8 border border-[#d1c5b4]/30 shadow-[0_10px_30px_-15px_rgba(197,160,89,0.1)] h-full">
              <h2 className="text-2xl font-serif text-gray-800 mb-6">Tus Citas</h2>
              
              {appointments.length === 0 ? (
                <div className="text-center py-16">
                  <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">calendar_month</span>
                  <p className="text-gray-500">No tienes citas agendadas aún.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((app) => (
                    <div key={app.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border border-[#f6f3f2] rounded-2xl hover:border-[#d1c5b4]/50 transition-colors bg-[#fcf9f8]/50">
                      <div>
                        <h3 className="text-lg font-serif text-gray-900 mb-1">{app.treatmentName}</h3>
                        <p className="text-sm text-gray-500 font-light flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">event</span>
                          {new Date(app.date).toLocaleDateString('es-CL')} — {app.time}
                        </p>
                      </div>
                      
                      <div className="mt-4 sm:mt-0 text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-2
                          ${app.status === 'confirmed' ? 'bg-green-50 text-green-600 border border-green-100' : 
                            app.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' : 
                            app.status === 'completed' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            'bg-yellow-50 text-yellow-600 border border-yellow-100'
                          }`}
                        >
                          {app.status === 'confirmed' ? 'Confirmada' : 
                           app.status === 'cancelled' ? 'Cancelada' : 
                           app.status === 'completed' ? 'Completada' : 'Pendiente'}
                        </span>
                        
                        <p className="text-[#775a19] font-serif font-medium">
                          ${(app.total_price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
