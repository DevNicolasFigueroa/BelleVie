"use client";

import React, { useState, useMemo } from "react";

interface AppointmentRow {
  id: number;
  clientName: string;
  treatmentName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  depositStatus: "pending" | "paid";
  totalPrice: number;
  depositAmount: number;
}

const STATUS_CONFIG = {
  confirmed: { label: "Confirmada", cls: "bg-green-100 text-green-700" },
  pending: { label: "Pendiente", cls: "bg-amber-100 text-amber-700" },
  completed: { label: "Completada", cls: "bg-gray-100 text-gray-600" },
  cancelled: { label: "Cancelada", cls: "bg-red-100 text-red-700" },
};

export default function AdminCitasClient({
  initialAppointments,
}: {
  initialAppointments: AppointmentRow[];
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [filterDate, setFilterDate] = useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState<number | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const filtered = useMemo(() => {
    const STATUS_ORDER = {
      pending: 0,
      confirmed: 1,
      completed: 2,
      cancelled: 3,
    };

    const result = appointments.filter((a) => {
      const matchStatus = filterStatus === "all" || a.status === filterStatus;
      const matchDate = !filterDate || a.date === filterDate;
      const matchSearch =
        !search ||
        a.clientName.toLowerCase().includes(search.toLowerCase()) ||
        a.treatmentName.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchDate && matchSearch;
    });

    return result.sort((a, b) => {
      // Ordenar por prioridad de estado
      const orderA = STATUS_ORDER[a.status] ?? 99;
      const orderB = STATUS_ORDER[b.status] ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      
      // Si tienen el mismo estado, ordenar por fecha y hora (más recientes/próximas primero)
      const dateA = new Date(`${a.date || "1970-01-01"}T${a.time || "00:00"}`).getTime();
      const dateB = new Date(`${b.date || "1970-01-01"}T${b.time || "00:00"}`).getTime();
      return dateA - dateB;
    });
  }, [appointments, filterStatus, filterDate, search]);

  const handleUpdateStatus = async (
    id: number,
    newStatus: AppointmentRow["status"]
  ) => {
    setLoading(id);
    try {
      const res = await fetch(`/api/appointment/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
    } catch {
      // optimistic fallback
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } finally {
      setLoading(null);
    }
  };

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    pending: appointments.filter((a) => a.status === "pending").length,
    revenue: appointments
      .filter((a) => a.status !== "cancelled")
      .reduce((s, a) => s + a.totalPrice, 0),
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#c5a059] mb-1">Panel Admin</p>
        <h1 className="text-4xl font-serif text-gray-900">Gestión de Citas</h1>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Citas", value: stats.total, icon: "event", color: "#775a19" },
          { label: "Confirmadas", value: stats.confirmed, icon: "check_circle", color: "#16a34a" },
          { label: "Pendientes", value: stats.pending, icon: "pending_actions", color: "#c5a059" },
          { label: "Ingresos Proj.", value: `$${stats.revenue.toLocaleString("es-CL")}`, icon: "payments", color: "#775a19" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#d1c5b4]/30 p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-[22px]" style={{ color: s.color }}>{s.icon}</span>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">{s.label}</p>
              <p className="text-xl font-serif" style={{ color: s.color }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-[#d1c5b4]/30 p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
          <input
            type="text"
            placeholder="Buscar cliente o tratamiento…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#d1c5b4]/40 bg-[#fcf9f8] text-sm focus:outline-none focus:border-[#775a19] transition-colors"
          />
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-[#d1c5b4]/40 bg-[#fcf9f8] text-sm focus:outline-none focus:border-[#775a19] transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                filterStatus === s
                  ? "bg-[#775a19] text-white"
                  : "bg-[#fcf9f8] text-gray-500 border border-[#d1c5b4]/40 hover:border-[#775a19]"
              }`}
            >
              {s === "all" ? "Todas" : s === "pending" ? "Pendientes" : s === "confirmed" ? "Confirmadas" : s === "completed" ? "Completadas" : "Canceladas"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setFilterDate(today)}
          className="px-3 py-2 rounded-xl text-xs font-semibold text-[#775a19] border border-[#c5a059]/40 hover:bg-[#c5a059]/10 transition-colors"
        >
          Hoy
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-[#d1c5b4]/30 shadow-[0_4px_20px_-8px_rgba(197,160,89,0.15)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcf9f8] border-b border-[#d1c5b4]/20 text-[11px] uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4 font-semibold">Fecha / Hora</th>
                <th className="px-6 py-4 font-semibold">Paciente</th>
                <th className="px-6 py-4 font-semibold">Tratamiento</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Abono</th>
                <th className="px-6 py-4 font-semibold text-right">Total</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d1c5b4]/15">
              {filtered.map((app) => {
                const sc = STATUS_CONFIG[app.status] ?? { label: app.status, cls: "bg-gray-100 text-gray-600" };
                return (
                  <tr key={app.id} className="hover:bg-[#fcf9f8]/60 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-800">
                        {app.date ? new Date(app.date + "T00:00:00").toLocaleDateString("es-CL", { day: "2-digit", month: "short" }) : "—"}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {app.time}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-serif text-base text-gray-900">{app.clientName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{app.treatmentName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc.cls}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        app.depositStatus === "paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {app.depositStatus === "paid" ? "Pagado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-serif text-[#775a19]">${app.totalPrice.toLocaleString("es-CL")}</p>
                      <p className="text-xs text-gray-400">Abono: ${app.depositAmount.toLocaleString("es-CL")}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {app.status === "pending" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "confirmed")}
                            disabled={loading === app.id}
                            title="Confirmar"
                            className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          </button>
                        )}
                        {app.status === "confirmed" && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "completed")}
                            disabled={loading === app.id}
                            title="Marcar como Completada"
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">task_alt</span>
                          </button>
                        )}
                        {(app.status === "pending" || app.status === "confirmed") && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, "cancelled")}
                            disabled={loading === app.id}
                            title="Cancelar"
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[18px]">cancel</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">event_busy</span>
                    <p className="text-gray-400 text-sm">No se encontraron citas con los filtros aplicados.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-[#d1c5b4]/20 text-xs text-gray-400">
          Mostrando {filtered.length} de {appointments.length} citas
        </div>
      </div>
    </div>
  );
}
