"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ClientProfileClientProps {
  user: any;
  appointments: any[];
  orders: any[];
  initialClientFile: any;
}

export default function ClientProfileClient({
  user,
  appointments,
  orders,
  initialClientFile,
}: ClientProfileClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "historial" | "ficha">("ficha");

  const [clientFile, setClientFile] = useState(initialClientFile || { clinical_notes: "", history: "", allergies: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  if (!user) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center">
        <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">person_off</span>
        <h1 className="text-2xl font-serif text-gray-900 mb-2">Cliente no encontrado</h1>
        <p className="text-gray-500 mb-6">El cliente que buscas no existe o ha sido eliminado.</p>
        <Link href="/admin/clientes" className="inline-block px-6 py-3 bg-[#775a19] text-white rounded-xl hover:bg-[#5f4713] transition-colors font-semibold">
          Volver al directorio
        </Link>
      </div>
    );
  }

  const handleSaveFicha = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      const isUpdate = !!initialClientFile?.id;
      const url = isUpdate ? `/api/client_file/${initialClientFile.id}` : `/api/client_file`;
      const method = isUpdate ? "PATCH" : "POST";
      
      const payload = {
        user_id: user.id,
        clinical_notes: clientFile.clinical_notes,
        history: clientFile.history,
        allergies: clientFile.allergies,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveMessage("Ficha guardada exitosamente.");
        router.refresh();
      } else {
        const errorData = await res.json();
        setSaveMessage(`Error al guardar: ${errorData.error}`);
      }
    } catch (e) {
      setSaveMessage("Error de conexión al guardar.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 4000);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "confirmed" || status === "paid") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-amber-100 text-amber-700";
    if (status === "cancelled" || status === "failed") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Navegación y Header */}
      <div className="mb-8">
        <Link href="/admin/clientes" className="text-[#775a19] text-sm font-semibold hover:underline flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Volver a clientes
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#c5a059]/15 flex items-center justify-center text-[#775a19] font-bold text-2xl border border-[#c5a059]/20">
            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <h1 className="text-3xl font-serif text-gray-900">{user.name}</h1>
            <p className="text-gray-500 text-sm">Cliente desde el {new Date(user.created_at).toLocaleDateString("es-CL")}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#d1c5b4]/30 mb-8">
        <button
          onClick={() => setActiveTab("general")}
          className={`pb-3 text-sm font-semibold uppercase tracking-widest transition-colors border-b-2 ${
            activeTab === "general" ? "border-[#775a19] text-[#775a19]" : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Perfil General
        </button>
        <button
          onClick={() => setActiveTab("historial")}
          className={`pb-3 text-sm font-semibold uppercase tracking-widest transition-colors border-b-2 ${
            activeTab === "historial" ? "border-[#775a19] text-[#775a19]" : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Historial & Compras
        </button>
        <button
          onClick={() => setActiveTab("ficha")}
          className={`pb-3 text-sm font-semibold uppercase tracking-widest transition-colors border-b-2 ${
            activeTab === "ficha" ? "border-[#775a19] text-[#775a19]" : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Ficha Clínica
        </button>
      </div>

      {/* Contenido - Perfil General */}
      {activeTab === "general" && (
        <div className="bg-white rounded-2xl border border-[#d1c5b4]/30 p-6 shadow-[0_4px_20px_-8px_rgba(197,160,89,0.15)]">
          <h2 className="text-xl font-serif text-gray-900 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#775a19]">contact_page</span>
            Datos de Contacto
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Nombre Completo</p>
              <p className="text-gray-900 font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Correo Electrónico</p>
              <p className="text-gray-900 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Teléfono</p>
              <p className="text-gray-900 font-medium">{user.phone || "No registrado"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">ID de Usuario</p>
              <p className="text-gray-900 font-medium">#{user.id}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contenido - Historial & Compras */}
      {activeTab === "historial" && (
        <div className="space-y-8">
          {/* Citas */}
          <div className="bg-white rounded-2xl border border-[#d1c5b4]/30 overflow-hidden shadow-[0_4px_20px_-8px_rgba(197,160,89,0.15)]">
            <div className="p-6 border-b border-[#d1c5b4]/20 flex justify-between items-center bg-[#fcf9f8]/50">
              <h2 className="text-xl font-serif text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#775a19]">calendar_month</span>
                Historial de Citas
              </h2>
              <span className="text-sm font-semibold text-[#775a19] bg-[#c5a059]/10 px-3 py-1 rounded-full">
                {appointments.length} citas
              </span>
            </div>
            <div className="p-0">
              {appointments.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">Este cliente no tiene citas registradas.</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-[#d1c5b4]/10 text-xs uppercase tracking-widest text-gray-400">
                      <th className="px-6 py-3 font-semibold">Fecha / Hora</th>
                      <th className="px-6 py-3 font-semibold">Tratamiento</th>
                      <th className="px-6 py-3 font-semibold">Estado</th>
                      <th className="px-6 py-3 font-semibold">Precio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d1c5b4]/10">
                    {appointments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(app => (
                      <tr key={app.id} className="hover:bg-[#fcf9f8] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm font-medium text-gray-800">{new Date(app.date).toLocaleDateString("es-CL")}</p>
                          <p className="text-xs text-gray-400">{app.time} hrs</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{app.treatmentName}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-serif text-[#775a19]">
                          ${app.total_price?.toLocaleString("es-CL") || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Pedidos */}
          <div className="bg-white rounded-2xl border border-[#d1c5b4]/30 overflow-hidden shadow-[0_4px_20px_-8px_rgba(197,160,89,0.15)]">
            <div className="p-6 border-b border-[#d1c5b4]/20 flex justify-between items-center bg-[#fcf9f8]/50">
              <h2 className="text-xl font-serif text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#775a19]">shopping_bag</span>
                Historial de Pedidos
              </h2>
              <span className="text-sm font-semibold text-[#775a19] bg-[#c5a059]/10 px-3 py-1 rounded-full">
                {orders.length} pedidos
              </span>
            </div>
            <div className="p-0">
              {orders.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">Este cliente no ha realizado compras de productos.</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white border-b border-[#d1c5b4]/10 text-xs uppercase tracking-widest text-gray-400">
                      <th className="px-6 py-3 font-semibold">ID Pedido</th>
                      <th className="px-6 py-3 font-semibold">Fecha</th>
                      <th className="px-6 py-3 font-semibold">Tipo</th>
                      <th className="px-6 py-3 font-semibold">Total</th>
                      <th className="px-6 py-3 font-semibold">Pago</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d1c5b4]/10">
                    {orders.sort((a,b) => b.created_at - a.created_at).map(order => (
                      <tr key={order.id} className="hover:bg-[#fcf9f8] transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-500">#{order.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {new Date(order.created_at).toLocaleDateString("es-CL")}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                            {order.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-serif text-[#775a19]">
                          ${order.total?.toLocaleString("es-CL") || 0}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.payment_status)}`}>
                            {order.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenido - Ficha Clínica */}
      {activeTab === "ficha" && (
        <div className="bg-white rounded-2xl border border-[#d1c5b4]/30 shadow-[0_4px_20px_-8px_rgba(197,160,89,0.15)] overflow-hidden flex flex-col h-[700px]">
          <div className="px-6 py-5 border-b border-[#d1c5b4]/20 flex justify-between items-center bg-[#fcf9f8]/50">
            <h2 className="text-xl font-serif text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#775a19]">medical_information</span>
              Notas y Ficha Médica
            </h2>
            {saveMessage && (
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                saveMessage.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              }`}>
                {saveMessage}
              </span>
            )}
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                Alergias Conocidas
              </label>
              <textarea
                value={clientFile.allergies}
                onChange={(e) => setClientFile({ ...clientFile, allergies: e.target.value })}
                placeholder="Ej: Alergia a la penicilina, intolerancia al látex..."
                className="w-full px-4 py-3 rounded-xl border border-[#d1c5b4]/40 bg-[#fcf9f8] text-sm text-gray-800 focus:outline-none focus:border-[#775a19] focus:bg-white transition-colors resize-none h-24"
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                Antecedentes Médicos (History)
              </label>
              <textarea
                value={clientFile.history}
                onChange={(e) => setClientFile({ ...clientFile, history: e.target.value })}
                placeholder="Condiciones preexistentes, cirugías previas, medicamentos actuales..."
                className="w-full px-4 py-3 rounded-xl border border-[#d1c5b4]/40 bg-[#fcf9f8] text-sm text-gray-800 focus:outline-none focus:border-[#775a19] focus:bg-white transition-colors resize-none h-32"
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
                Evolución y Notas Clínicas de Tratamientos
              </label>
              <textarea
                value={clientFile.clinical_notes}
                onChange={(e) => setClientFile({ ...clientFile, clinical_notes: e.target.value })}
                placeholder="01-Mar: 1ra sesión de depilación láser sin complicaciones. Parámetros usados: X, Y..."
                className="w-full px-4 py-3 rounded-xl border border-[#d1c5b4]/40 bg-[#fcf9f8] text-sm text-gray-800 focus:outline-none focus:border-[#775a19] focus:bg-white transition-colors resize-none h-48"
              />
            </div>
          </div>

          <div className="p-4 border-t border-[#d1c5b4]/20 bg-[#fcf9f8]/80 flex justify-end">
            <button
              onClick={handleSaveFicha}
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#775a19] text-white rounded-xl hover:bg-[#5f4713] transition-colors font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">sync</span> Guardando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span> Guardar Ficha
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
