"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", icon: "dashboard", label: "Dashboard", exact: true },
  { href: "/admin/citas", icon: "calendar_month", label: "Citas" },
  { href: "/admin/pedidos", icon: "shopping_bag", label: "Pedidos" },
  { href: "/admin/inventario", icon: "inventory_2", label: "Inventario" },
  { href: "/admin/clientes", icon: "group", label: "Clientes" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/cliente/login");
  };

  const isActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-[#d1c5b4]/30 flex flex-col sticky top-0 h-screen shrink-0">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-[#d1c5b4]/30">
        <Link href="/admin" className="block">
          <p className="text-2xl font-serif text-[#775a19]">BelleVie</p>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-400 mt-0.5">
            Panel Admin
          </p>
        </Link>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-[#775a19] text-white shadow-[0_4px_12px_-4px_rgba(119,90,25,0.4)]"
                  : "text-gray-500 hover:bg-[#fcf9f8] hover:text-[#775a19]"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#d1c5b4]/30 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          Ir al Sitio
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
