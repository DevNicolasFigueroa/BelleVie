import { xanoFetch } from "@/lib/xano";
import type { Appointment, Product } from "@/types";
import Link from "next/link";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

function StatCard({ icon, label, value, sub, color = "#775a19" }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#d1c5b4]/30 shadow-[0_4px_20px_-8px_rgba(197,160,89,0.15)] p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">{label}</p>
          <p className="text-4xl font-serif" style={{ color }}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1.5">{sub}</p>}
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <span className="material-symbols-outlined text-[24px]" style={{ color }}>{icon}</span>
        </div>
      </div>
    </div>
  );
}

import { cookies } from "next/headers";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bellevie_auth_token")?.value;

  const [appointments, products] = await Promise.all([
    xanoFetch<Appointment[]>("/appointment", { token }).catch(() => [] as Appointment[]),
    xanoFetch<Product[]>("/product").catch(() => [] as Product[]),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.date === today);
  const pendingAppointments = appointments.filter((a) => a.status === "pending");
  const confirmedToday = todayAppointments.filter((a) => a.status === "confirmed");
  const revenueToday = todayAppointments
    .filter((a) => a.status !== "cancelled")
    .reduce((sum, a) => sum + (a.total_price || 0), 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const outOfStock = products.filter((p) => p.stock === 0);

  const quickLinks = [
    { href: "/admin/citas", icon: "calendar_month", label: "Ver todas las citas", color: "#775a19" },
    { href: "/admin/pedidos", icon: "shopping_bag", label: "Ver pedidos", color: "#5f5e5b" },
    { href: "/admin/inventario", icon: "inventory_2", label: "Gestionar inventario", color: "#775a19" },
    { href: "/admin/clientes", icon: "group", label: "Ver clientes", color: "#5f5e5b" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#c5a059] mb-1">Panel de Control</p>
        <h1 className="text-4xl font-serif text-gray-900">Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">
          {new Date().toLocaleDateString("es-CL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        <StatCard
          icon="calendar_month"
          label="Citas de Hoy"
          value={todayAppointments.length}
          sub={`${confirmedToday.length} confirmadas`}
        />
        <StatCard
          icon="payments"
          label="Ingresos Hoy"
          value={`$${revenueToday.toLocaleString("es-CL")}`}
          sub="citas activas del día"
          color="#775a19"
        />
        <StatCard
          icon="pending_actions"
          label="Citas Pendientes"
          value={pendingAppointments.length}
          sub="requieren confirmación"
          color="#c5a059"
        />
        <StatCard
          icon="warning"
          label="Stock Crítico"
          value={lowStock.length + outOfStock.length}
          sub={`${outOfStock.length} sin stock`}
          color={outOfStock.length > 0 ? "#dc2626" : "#c5a059"}
        />
      </div>

      {/* Citas de Hoy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#d1c5b4]/30 shadow-[0_4px_20px_-8px_rgba(197,160,89,0.15)] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#d1c5b4]/20 flex items-center justify-between">
            <h2 className="font-serif text-xl text-gray-900">Citas de Hoy</h2>
            <Link href="/admin/citas" className="text-xs font-semibold text-[#775a19] hover:underline flex items-center gap-1">
              Ver todas <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>
          {todayAppointments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-200 block mb-3">event_available</span>
              <p className="text-gray-400 text-sm">No hay citas agendadas para hoy.</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#d1c5b4]/20">
              {todayAppointments.slice(0, 5).map((a) => (
                <li key={a.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#fcf9f8] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-gray-300 text-[20px]">schedule</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{a.time} hrs</p>
                      <p className="text-xs text-gray-400">Cita #{a.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-serif text-[#775a19]">${(a.total_price || 0).toLocaleString("es-CL")}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      a.status === "confirmed" ? "bg-green-100 text-green-700" :
                      a.status === "pending" ? "bg-amber-100 text-amber-700" :
                      a.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{a.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Accesos Rápidos */}
        <div className="bg-white rounded-2xl border border-[#d1c5b4]/30 shadow-[0_4px_20px_-8px_rgba(197,160,89,0.15)] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#d1c5b4]/20">
            <h2 className="font-serif text-xl text-gray-900">Accesos Rápidos</h2>
          </div>
          <div className="p-4 space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#fcf9f8] transition-colors group"
              >
                <span className="material-symbols-outlined text-[20px] text-[#d1c5b4] group-hover:text-[#775a19] transition-colors">
                  {link.icon}
                </span>
                <span className="text-sm font-medium text-gray-600 group-hover:text-[#775a19] transition-colors">
                  {link.label}
                </span>
                <span className="material-symbols-outlined text-[16px] text-gray-300 ml-auto group-hover:text-[#775a19] transition-colors">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>

          {/* Productos con Stock Bajo */}
          {(lowStock.length > 0 || outOfStock.length > 0) && (
            <div className="mx-4 mb-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                Stock Crítico
              </p>
              {outOfStock.slice(0, 2).map((p) => (
                <p key={p.id} className="text-xs text-red-600 font-medium truncate">• {p.name} — Agotado</p>
              ))}
              {lowStock.slice(0, 2).map((p) => (
                <p key={p.id} className="text-xs text-amber-700 truncate">• {p.name} — {p.stock} unidades</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}