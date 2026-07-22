"use client";

import React, { useState, useMemo } from "react";
import { getToken } from "@/lib/auth";

interface ClientRow {
  id: number;
  name: string;
  email: string;
  phone?: string;
  created_at: number;
  role: string;
}

import { useRouter } from "next/navigation";

export default function AdminClientesPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  React.useEffect(() => {
    const XANO_AUTH_URL = process.env.NEXT_PUBLIC_XANO_AUTH_URL;
    const token = getToken();
    fetch(`${XANO_AUTH_URL}/user`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store"
    })
      .then((r) => r.json())
      .then((data: ClientRow[]) => {
        setClients(Array.isArray(data) ? data.filter((u) => u.role !== "admin") : []);
      })
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search) return clients;
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
    );
  }, [clients, search]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#c5a059] mb-1">Panel Admin</p>
        <h1 className="text-4xl font-serif text-gray-900">Clientes</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#d1c5b4]/30 p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-[22px] text-[#775a19]">group</span>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">Total Clientes</p>
            <p className="text-xl font-serif text-gray-900">{clients.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#d1c5b4]/30 p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-[22px] text-[#775a19]">person_add</span>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">Este Mes</p>
            <p className="text-xl font-serif text-gray-900">
              {clients.filter((c) => {
                const d = new Date(c.created_at);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-[#d1c5b4]/30 p-4 mb-6">
        <div className="relative max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#d1c5b4]/40 bg-[#fcf9f8] text-sm focus:outline-none focus:border-[#775a19] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#d1c5b4]/30 shadow-[0_4px_20px_-8px_rgba(197,160,89,0.15)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcf9f8] border-b border-[#d1c5b4]/20 text-[11px] uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Teléfono</th>
                <th className="px-6 py-4 font-semibold">Registro</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d1c5b4]/15">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-200 block mb-3 animate-pulse">group</span>
                    <p className="text-gray-400 text-sm">Cargando clientes…</p>
                  </td>
                </tr>
              ) : filtered.map((client) => {
                const initials = client.name
                  ? client.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
                  : "?";
                return (
                  <tr key={client.id} className="hover:bg-[#fcf9f8]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#c5a059]/15 flex items-center justify-center text-[#775a19] font-bold text-sm shrink-0 border border-[#c5a059]/20">
                          {initials}
                        </div>
                        <p className="font-serif text-base text-gray-900">{client.name || "Sin nombre"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{client.email || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{client.phone || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                      {new Date(client.created_at).toLocaleDateString("es-CL", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => router.push(`/admin/clientes/${client.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-[#c5a059]/10 text-[#775a19] hover:bg-[#c5a059]/20 transition-colors flex items-center gap-1.5 ml-auto text-sm font-semibold"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        Ver ficha
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">person_search</span>
                    <p className="text-gray-400 text-sm">No se encontraron clientes.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-[#d1c5b4]/20 text-xs text-gray-400">
          {filtered.length} cliente{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
