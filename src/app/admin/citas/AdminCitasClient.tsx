"use client";

import React, { useState } from "react";
import Link from "next/link";

interface AppointmentDetails {
  id: number;
  clientName: string;
  treatmentName: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  price: number;
}

interface AdminCitasClientProps {
  initialAppointments: AppointmentDetails[];
}

export default function AdminCitasClient({ initialAppointments }: AdminCitasClientProps) {
  const [selectedDate, setSelectedDate] = useState("Hoy");
  const [appointments, setAppointments] = useState<AppointmentDetails[]>(initialAppointments);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold tracking-wider uppercase">Confirmada</span>;
      case "pending":
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold tracking-wider uppercase">Pendiente</span>;
      case "completed":
        return <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-semibold tracking-wider uppercase">Completada</span>;
      case "cancelled":
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold tracking-wider uppercase">Cancelada</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold tracking-wider uppercase">{status}</span>;
    }
  };

  const handleUpdateStatus = (id: number, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
    // Aquí iría la llamada real al backend: fetch(`/api/appointment/${id}`, { method: 'PATCH', body: { status: newStatus } })
  };

  const activeAppointments = appointments.filter(a => a.status !== 'cancelled');
  const totalRevenue = activeAppointments.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div style={{ backgroundColor: colors.surface, minHeight: "100vh" }} className="text-gray-900 pb-12 selection:bg-amber-100">

      {/* Header Admin */}
      <header className="bg-white/80 backdrop-blur-md flex items-center justify-between px-8 py-5 border-b border-[#d1c5b4]/30 sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link href="/">
            <button className="hover:bg-[#e5e2dd]/50 transition-colors p-2 rounded-full active:scale-95 duration-200">
              <span className="material-symbols-outlined" style={{ color: colors.primary }}>home</span>
            </button>
          </Link>
          <div className="w-px h-6 bg-[#d1c5b4]/50"></div>
          <h1 className="text-2xl font-serif" style={{ color: colors.primary }}>BelleVie <span className="text-gray-400 font-sans text-sm ml-2 tracking-widest uppercase">Admin</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-[#e5e2dd]/50 transition-colors relative">
            <span className="material-symbols-outlined text-gray-600">notifications</span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-10 h-10 rounded-full bg-[#c5a059]/20 flex items-center justify-center text-[#775a19] font-bold border border-[#c5a059]/30">
            A
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Controls and Stats */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-8">
          <div>
            <p className="text-sm uppercase tracking-widest font-semibold mb-2" style={{ color: colors.secondary }}>Agenda de Citas</p>
            <div className="flex items-center gap-3 bg-white border border-[#d1c5b4]/50 shadow-sm rounded-full px-5 py-2 cursor-pointer hover:border-[#775a19] transition-colors">
              <span className="material-symbols-outlined text-gray-500 text-sm">calendar_month</span>
              <span className="font-medium text-gray-800">{selectedDate}</span>
              <span className="material-symbols-outlined text-gray-400">expand_more</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-[0_10px_30px_-10px_rgba(197,160,89,0.12)] border border-[#d1c5b4]/30 min-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#775a19] text-[20px]">groups</span>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Citas Hoy</h3>
              </div>
              <p className="text-3xl font-serif text-gray-900">{appointments.length}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-[0_10px_30px_-10px_rgba(197,160,89,0.12)] border border-[#d1c5b4]/30 min-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#775a19] text-[20px]">payments</span>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Proyectado</h3>
              </div>
              <p className="text-3xl font-serif text-[#775a19]">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_-10px_rgba(197,160,89,0.12)] border border-[#d1c5b4]/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcf9f8] border-b border-[#d1c5b4]/30 text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-5 font-semibold">Hora</th>
                  <th className="px-6 py-5 font-semibold">Paciente</th>
                  <th className="px-6 py-5 font-semibold">Tratamiento</th>
                  <th className="px-6 py-5 font-semibold">Estado</th>
                  <th className="px-6 py-5 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d1c5b4]/20">
                {appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-[#fcf9f8]/50 transition-colors group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400 text-[18px]">schedule</span>
                        <span className="font-medium text-gray-900">{app.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="font-serif text-lg text-gray-900">{app.clientName}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-600">{app.treatmentName}</div>
                      <div className="text-xs text-[#775a19] font-medium mt-0.5">${app.price.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {app.status === 'pending' && (
                          <button 
                            onClick={() => handleUpdateStatus(app.id, 'confirmed')}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            title="Confirmar"
                          >
                            <span className="material-symbols-outlined text-[20px]">check</span>
                          </button>
                        )}
                        {(app.status === 'pending' || app.status === 'confirmed') && (
                          <button 
                            onClick={() => handleUpdateStatus(app.id, 'cancelled')}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Cancelar"
                          >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                          </button>
                        )}
                        <button className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors" title="Ver Detalles">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <span className="material-symbols-outlined text-4xl mb-3 text-gray-300">event_busy</span>
                      <p>No hay citas agendadas.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
