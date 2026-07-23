"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken, logout } from "@/lib/auth";
import { getCart } from "@/lib/cart";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const router = useRouter();

  const fetchCartCount = async () => {
    const token = getToken();
    if (token) {
      try {
        const items = await getCart();
        setCartCount(items.length);
      } catch (e) {
        setCartCount(0);
      }
    }
  };

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
    setRole(localStorage.getItem("bellevie_user_role"));

    // Obtener carrito si está autenticado
    fetchCartCount();

    // Actualizar carrito cuando vuelve el foco
    window.addEventListener("focus", fetchCartCount);
    return () => window.removeEventListener("focus", fetchCartCount);
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setRole(null);
    router.push("/");
  };

  const colors = {
    primary: "#775a19",
    secondary: "#5f5e5b",
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-[#d1c5b4]/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-3xl font-serif tracking-tight" style={{ color: colors.primary }}>
          BelleVie
        </Link>

        {/* Links Principales */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/cliente/tratamientos" className="text-[14px] font-semibold tracking-widest uppercase hover:text-[#775a19] transition-colors" style={{ color: colors.secondary }}>
            Tratamientos
          </Link>
          <Link href="/cliente/productos" className="text-[14px] font-semibold tracking-widest uppercase hover:text-[#775a19] transition-colors" style={{ color: colors.secondary }}>
            Tienda
          </Link>
          <Link href="/contacto" className="text-[14px] font-semibold tracking-widest uppercase hover:text-[#775a19] transition-colors" style={{ color: colors.secondary }}>
            Contacto
          </Link>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          <Link href="/cliente/carrito" className="p-2 rounded-full hover:bg-[#e5e2dd]/50 transition-colors relative flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-600 font-light text-[28px]">local_mall</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#775a19] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <div className="w-px h-6 bg-[#d1c5b4]/50 mx-2 hidden md:block"></div>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href={role === "admin" ? "/admin/citas" : "/cliente/perfil"} className="text-[13px] font-semibold tracking-widest uppercase text-gray-500 hover:text-[#775a19] transition-colors hidden md:block">
                {role === "admin" ? "Mi Panel" : "Mi Perfil"}
              </Link>
              <button 
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 border border-[#d1c5b4] hover:border-[#775a19] text-[#775a19]"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                href="/cliente/login" 
                className="px-5 py-2.5 text-sm font-semibold tracking-wide text-[#775a19] hover:bg-[#c5a059]/10 rounded-full transition-colors hidden md:block"
              >
                Ingresar
              </Link>
              <Link 
                href="/cliente/signup" 
                className="px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide text-white transition-all duration-300 shadow-md hover:shadow-lg"
                style={{ backgroundColor: colors.primary }}
              >
                Crear Cuenta
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
