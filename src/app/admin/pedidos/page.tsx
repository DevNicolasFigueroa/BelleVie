import { xanoFetch } from "@/lib/xano";
import Link from "next/link";

import { cookies } from "next/headers";

interface Order {
  id: number;
  created_at: number;
  client_id: number;
  total: number;
  payment_status: "paid" | "pending" | "failed";
  _user?: { name?: string; email?: string };
  items?: { product_id: number; quantity: number; unit_price: number; _product?: { name?: string } }[];
}

export default async function AdminPedidosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bellevie_auth_token")?.value;

  const orders = await fetch(
    `${process.env.NEXT_PUBLIC_XANO_BASE_URL}/order`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store"
    }
  ).then((r) => (r.ok ? r.json() : [])).catch(() => []) as Order[];

  let users: any[] = [];
  try {
    const usersRes = await fetch(`${process.env.NEXT_PUBLIC_XANO_AUTH_URL}/user`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (usersRes.ok) {
      users = await usersRes.json();
    }
  } catch {}

  const stats = {
    total: orders.length,
    paid: orders.filter((o) => o.payment_status === "paid").length,
    pending: orders.filter((o) => o.payment_status === "pending").length,
    revenue: orders
      .filter((o) => o.payment_status === "paid")
      .reduce((s, o) => s + (o.total || 0), 0),
  };

  const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
    paid: { label: "Pagado", cls: "bg-green-100 text-green-700" },
    pending: { label: "Pendiente", cls: "bg-amber-100 text-amber-700" },
    failed: { label: "Fallido", cls: "bg-red-100 text-red-700" },
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#c5a059] mb-1">Panel Admin</p>
        <h1 className="text-4xl font-serif text-gray-900">Pedidos</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Pedidos", value: stats.total, icon: "shopping_bag", color: "#775a19" },
          { label: "Pagados", value: stats.paid, icon: "check_circle", color: "#16a34a" },
          { label: "Pendientes", value: stats.pending, icon: "pending_actions", color: "#c5a059" },
          { label: "Ingresos Totales", value: `$${stats.revenue.toLocaleString("es-CL")}`, icon: "payments", color: "#775a19" },
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

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#d1c5b4]/30 shadow-[0_4px_20px_-8px_rgba(197,160,89,0.15)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcf9f8] border-b border-[#d1c5b4]/20 text-[11px] uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4 font-semibold">#</th>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Productos</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold text-center">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d1c5b4]/15">
              {orders.map((order) => {
                const sc = STATUS_CONFIG[order.payment_status] ?? { label: order.payment_status, cls: "bg-gray-100 text-gray-600" };
                const user = users.find((u) => u.id === order.client_id);
                const clientName = order._user?.name || user?.name || `Cliente #${order.client_id}`;
                const clientEmail = order._user?.email || user?.email || null;
                const date = new Date(order.created_at).toLocaleDateString("es-CL", {
                  day: "2-digit", month: "short", year: "numeric",
                });
                const itemCount = order.items?.length ?? 0;
                return (
                  <tr key={order.id} className="hover:bg-[#fcf9f8]/60 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-400">#{order.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-serif text-base text-gray-900">{clientName}</p>
                      {clientEmail && (
                        <p className="text-xs text-gray-400">{clientEmail}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {itemCount > 0 ? (
                        <p className="text-sm text-gray-600">{itemCount} producto{itemCount !== 1 ? "s" : ""}</p>
                      ) : (
                        <p className="text-sm text-gray-400">—</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{date}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sc.cls}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-serif text-[#775a19]">${(order.total || 0).toLocaleString("es-CL")}</p>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">receipt_long</span>
                    <p className="text-gray-400 text-sm">No hay pedidos registrados aún.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-[#d1c5b4]/20 text-xs text-gray-400">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""} en total
        </div>
      </div>
    </div>
  );
}
